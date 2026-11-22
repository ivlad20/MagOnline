package com.example.spring_boot_jdbc_app.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.spring_boot_jdbc_app.model.AdminDtos.AdminOrder;
import com.example.spring_boot_jdbc_app.model.AdminDtos.AdminProduct;
import com.example.spring_boot_jdbc_app.model.AdminDtos.DayPoint;
import com.example.spring_boot_jdbc_app.model.AdminDtos.LowStock;
import com.example.spring_boot_jdbc_app.model.AdminDtos.OrderUpdate;
import com.example.spring_boot_jdbc_app.model.AdminDtos.ProductUpdate;
import com.example.spring_boot_jdbc_app.model.AdminDtos.SalesStats;
import com.example.spring_boot_jdbc_app.model.AdminDtos.TopProduct;
import com.example.spring_boot_jdbc_app.model.ApiException;
import com.example.spring_boot_jdbc_app.model.OrderSummary.OrderLine;

/** Queries behind the admin panel: sales stats, all orders, all listings and the weekly offers. */
@Repository
public class AdminRepository {

    public static final Set<String> ORDER_STATUSES = Set.of("pending", "processing", "shipped", "delivered", "cancelled");
    private static final int MAX_OFFERS = 12;
    private static final int LOW_STOCK = 3;

    /** Main image of a product, or null. Used inside the SELECT lists below. */
    private static final String MAIN_IMAGE_SQL = """
            (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = %s
              ORDER BY pi.is_main DESC, pi.id LIMIT 1)""";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean isAdmin(Integer userId) {
        Integer n = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM admins WHERE user_id = ?", Integer.class, userId);
        return n != null && n > 0;
    }

    // ------------------------------------------------------------------ sales

    public SalesStats getSalesStats(int days) {
        LocalDate today = LocalDate.now();
        LocalDate from = today.minusDays(days - 1L);

        // One row per order in the period, with its total (items + shipping).
        String sql = """
                SELECT o.id, o.order_date, o.status, o.user_id,
                       o.shipping_cost + COALESCE(SUM(oi.quantity * oi.price), 0) AS total,
                       COALESCE(SUM(oi.quantity), 0) AS items
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                WHERE o.order_date >= ?
                GROUP BY o.id, o.order_date, o.status, o.user_id, o.shipping_cost
                """;

        Map<String, BigDecimal> revenueByDay = new TreeMap<>();
        Map<String, Integer> ordersByDay = new TreeMap<>();
        Map<String, Integer> byStatus = new LinkedHashMap<>();
        for (String s : List.of("pending", "processing", "shipped", "delivered", "cancelled")) byStatus.put(s, 0);
        Set<Integer> customers = new HashSet<>();
        BigDecimal[] revenue = {BigDecimal.ZERO};
        int[] counts = {0, 0}; // orders, items

        jdbcTemplate.query(sql, rs -> {
            String status = rs.getString("status");
            byStatus.merge(status, 1, Integer::sum);
            if ("cancelled".equals(status)) return; // cancelled orders don't count as sales
            String day = rs.getTimestamp("order_date").toLocalDateTime().toLocalDate().toString();
            BigDecimal total = rs.getBigDecimal("total");
            revenue[0] = revenue[0].add(total);
            counts[0]++;
            counts[1] += rs.getInt("items");
            customers.add(rs.getInt("user_id"));
            revenueByDay.merge(day, total, BigDecimal::add);
            ordersByDay.merge(day, 1, Integer::sum);
        }, from.atStartOfDay());

        List<DayPoint> daily = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(today); d = d.plusDays(1)) {
            String key = d.toString();
            daily.add(new DayPoint(key, revenueByDay.getOrDefault(key, BigDecimal.ZERO), ordersByDay.getOrDefault(key, 0)));
        }

        List<TopProduct> top = jdbcTemplate.query("""
                SELECT p.id, p.title, %s AS image,
                       SUM(oi.quantity) AS qty, SUM(oi.quantity * oi.price) AS revenue
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                JOIN products p ON p.id = oi.product_id
                WHERE o.status <> 'cancelled' AND o.order_date >= ?
                GROUP BY p.id, p.title
                ORDER BY revenue DESC
                LIMIT 5
                """.formatted(MAIN_IMAGE_SQL.formatted("p.id")),
                (rs, i) -> new TopProduct(rs.getInt("id"), rs.getString("title"), rs.getString("image"),
                        rs.getInt("qty"), rs.getBigDecimal("revenue")),
                from.atStartOfDay());

        List<LowStock> lowStock = jdbcTemplate.query(
                "SELECT id, title, stock FROM products WHERE stock <= ? ORDER BY stock, id LIMIT 8",
                (rs, i) -> new LowStock(rs.getInt("id"), rs.getString("title"), rs.getInt("stock")), LOW_STOCK);

        Integer pending = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'processing')", Integer.class);

        BigDecimal avg = counts[0] == 0 ? BigDecimal.ZERO
                : revenue[0].divide(BigDecimal.valueOf(counts[0]), 2, java.math.RoundingMode.HALF_UP);

        return new SalesStats(days, revenue[0], counts[0], avg, counts[1], customers.size(),
                pending == null ? 0 : pending, daily, byStatus, top, lowStock);
    }

    // ----------------------------------------------------------------- orders

    /** Latest orders (max 300), optionally filtered by status and a search on id / email / name. */
    public List<AdminOrder> getOrders(String status, String query) {
        StringBuilder where = new StringBuilder("WHERE 1 = 1");
        List<Object> params = new ArrayList<>();
        if (status != null && !status.isBlank() && !"all".equals(status)) {
            where.append(" AND o.status = ?");
            params.add(status);
        }
        if (query != null && !query.isBlank()) {
            String q = query.trim().replaceFirst("^#", "");
            where.append(" AND (u.email LIKE ? OR o.shipping_name LIKE ? OR o.shipping_phone LIKE ?");
            String like = "%" + q + "%";
            params.add(like);
            params.add(like);
            params.add(like);
            if (q.matches("\\d{1,9}")) {
                where.append(" OR o.id = ?");
                params.add(Integer.parseInt(q));
            }
            where.append(")");
        }

        String sql = """
                SELECT o.id, o.order_date, o.status, o.user_id, o.email, o.shipping_name, o.shipping_phone,
                       o.shipping_address, o.delivery_method, o.payment_method, o.notes, o.shipping_cost,
                       oi.product_id, oi.quantity, oi.price, p.title, %s AS image
                FROM (SELECT o.*, u.email FROM orders o JOIN users u ON u.id = o.user_id
                      %s ORDER BY o.order_date DESC, o.id DESC LIMIT 300) o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                LEFT JOIN products p ON p.id = oi.product_id
                ORDER BY o.order_date DESC, o.id DESC, oi.id
                """.formatted(MAIN_IMAGE_SQL.formatted("oi.product_id"), where);

        Map<Integer, Object[]> headers = new LinkedHashMap<>();
        Map<Integer, List<OrderLine>> lines = new LinkedHashMap<>();
        jdbcTemplate.query(sql, rs -> {
            int id = rs.getInt("id");
            if (!headers.containsKey(id)) {
                headers.put(id, new Object[] {
                        rs.getTimestamp("order_date").toLocalDateTime(), rs.getString("status"), rs.getInt("user_id"),
                        rs.getString("email"), rs.getString("shipping_name"), rs.getString("shipping_phone"),
                        rs.getString("shipping_address"), rs.getString("delivery_method"),
                        rs.getString("payment_method"), rs.getString("notes"), rs.getBigDecimal("shipping_cost")});
                lines.put(id, new ArrayList<>());
            }
            int productId = rs.getInt("product_id");
            if (!rs.wasNull()) {
                lines.get(id).add(new OrderLine(productId, rs.getString("title"), rs.getString("image"),
                        rs.getInt("quantity"), rs.getBigDecimal("price")));
            }
        }, params.toArray());

        List<AdminOrder> result = new ArrayList<>();
        headers.forEach((id, h) -> {
            List<OrderLine> l = lines.get(id);
            BigDecimal shipping = h[10] == null ? BigDecimal.ZERO : (BigDecimal) h[10];
            BigDecimal total = l.stream().map(x -> x.price().multiply(BigDecimal.valueOf(x.quantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add).add(shipping);
            result.add(new AdminOrder(id, (LocalDateTime) h[0], (String) h[1], (Integer) h[2], (String) h[3],
                    (String) h[4], (String) h[5], (String) h[6], (String) h[7], (String) h[8], (String) h[9],
                    shipping, total, l));
        });
        return result;
    }

    /**
     * Changes an order's status and/or delivery details. Cancelling puts the items back in stock;
     * reactivating a cancelled order takes them out again (and fails if there isn't enough stock).
     */
    @Transactional
    public void updateOrder(int orderId, OrderUpdate u) {
        List<String> current = jdbcTemplate.queryForList(
                "SELECT status FROM orders WHERE id = ? FOR UPDATE", String.class, orderId);
        if (current.isEmpty()) throw new ApiException(HttpStatus.NOT_FOUND, "Comanda #" + orderId + " nu există.");
        String oldStatus = current.get(0);

        if (u.status() != null && !u.status().equals(oldStatus)) {
            if (!ORDER_STATUSES.contains(u.status())) throw new ApiException(HttpStatus.BAD_REQUEST, "Status necunoscut.");
            boolean wasCancelled = "cancelled".equals(oldStatus);
            boolean nowCancelled = "cancelled".equals(u.status());
            if (!wasCancelled && nowCancelled) {
                jdbcTemplate.update("""
                        UPDATE products p JOIN order_items oi ON oi.product_id = p.id
                        SET p.stock = p.stock + oi.quantity WHERE oi.order_id = ?""", orderId);
            } else if (wasCancelled && !nowCancelled) {
                takeStockForOrder(orderId);
            }
            jdbcTemplate.update("UPDATE orders SET status = ? WHERE id = ?", u.status(), orderId);
        }

        if (u.shippingName() != null) {
            requireLength(u.shippingName(), 1, 200, "Numele de livrare");
            jdbcTemplate.update("UPDATE orders SET shipping_name = ? WHERE id = ?", u.shippingName().trim(), orderId);
        }
        if (u.shippingPhone() != null) {
            String phone = u.shippingPhone().replaceAll("[\\s.-]", "");
            if (!phone.matches("\\+?\\d{9,14}")) throw new ApiException(HttpStatus.BAD_REQUEST, "Telefon invalid.");
            jdbcTemplate.update("UPDATE orders SET shipping_phone = ? WHERE id = ?", phone, orderId);
        }
        if (u.shippingAddress() != null) {
            requireLength(u.shippingAddress(), 5, 400, "Adresa");
            jdbcTemplate.update("UPDATE orders SET shipping_address = ? WHERE id = ?", u.shippingAddress().trim(), orderId);
        }
        if (u.notes() != null) {
            requireLength(u.notes(), 0, 500, "Observațiile");
            jdbcTemplate.update("UPDATE orders SET notes = ? WHERE id = ?",
                    u.notes().isBlank() ? null : u.notes().trim(), orderId);
        }
    }

    private void takeStockForOrder(int orderId) {
        List<Map<String, Object>> items = jdbcTemplate.queryForList("""
                SELECT oi.product_id, oi.quantity, p.title, p.stock
                FROM order_items oi JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ? FOR UPDATE""", orderId);
        for (Map<String, Object> it : items) {
            int qty = ((Number) it.get("quantity")).intValue();
            int stock = ((Number) it.get("stock")).intValue();
            if (stock < qty) {
                throw new ApiException(HttpStatus.CONFLICT, "Nu pot reactiva comanda: din „" + it.get("title")
                        + "” mai sunt " + stock + " bucăți, iar comanda are " + qty + ".");
            }
        }
        jdbcTemplate.update("""
                UPDATE products p JOIN order_items oi ON oi.product_id = p.id
                SET p.stock = p.stock - oi.quantity WHERE oi.order_id = ?""", orderId);
    }

    // --------------------------------------------------------------- products

    public List<AdminProduct> getProducts(String query) {
        String where = "";
        List<Object> params = new ArrayList<>();
        if (query != null && !query.isBlank()) {
            String like = "%" + query.trim() + "%";
            where = "WHERE p.title LIKE ? OR p.brand LIKE ? OR p.category LIKE ? OR CAST(p.id AS CHAR) = ?";
            params.addAll(List.of(like, like, like, query.trim()));
        }
        String sql = """
                SELECT p.*, u.email AS seller_email, %s AS image,
                       (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi JOIN orders o ON o.id = oi.order_id
                         WHERE oi.product_id = p.id AND o.status <> 'cancelled') AS sold,
                       EXISTS (SELECT 1 FROM weekly_offers w WHERE w.product_id = p.id) AS offer
                FROM products p LEFT JOIN users u ON u.id = p.seller_id
                %s
                ORDER BY p.id DESC
                """.formatted(MAIN_IMAGE_SQL.formatted("p.id"), where);
        return jdbcTemplate.query(sql, (rs, i) -> mapProduct(rs), params.toArray());
    }

    private AdminProduct mapProduct(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new AdminProduct(rs.getInt("id"), rs.getString("title"), rs.getString("brand"), rs.getString("category"),
                rs.getString("subcategory"), rs.getString("description"), rs.getBigDecimal("price"), rs.getInt("stock"),
                rs.getInt("seller_id"), rs.getString("seller_email"), rs.getString("image"), rs.getInt("sold"),
                rs.getBoolean("offer"));
    }

    public void updateProduct(int id, ProductUpdate u) {
        requireLength(u.title(), 3, 255, "Titlul");
        if (u.price() == null || u.price().signum() <= 0 || u.price().compareTo(new BigDecimal("1000000")) >= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Prețul trebuie să fie între 0,01 și 999.999,99 lei.");
        }
        if (u.stock() == null || u.stock() < 0 || u.stock() > 100000) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Stocul trebuie să fie între 0 și 100.000.");
        }
        int n = jdbcTemplate.update("""
                UPDATE products SET title = ?, brand = ?, category = ?, subcategory = ?, description = ?, price = ?, stock = ?
                WHERE id = ?""",
                u.title().trim(), blankToNull(u.brand()), blankToNull(u.category()), blankToNull(u.subcategory()),
                u.description() == null ? null : u.description().trim(), u.price(), u.stock(), id);
        if (n == 0) throw new ApiException(HttpStatus.NOT_FOUND, "Produsul #" + id + " nu există.");
    }

    /** Deleting would also delete its order lines (FK cascade), so products that were ordered can't be deleted. */
    public void deleteProduct(int id) {
        Integer ordered = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM order_items WHERE product_id = ?", Integer.class, id);
        if (ordered != null && ordered > 0) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "Produsul apare în comenzi, așa că nu poate fi șters. Setează stocul la 0 ca să nu mai poată fi cumpărat.");
        }
        int n = jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
        if (n == 0) throw new ApiException(HttpStatus.NOT_FOUND, "Produsul #" + id + " nu există.");
    }

    // ----------------------------------------------------------------- offers

    public List<AdminProduct> getOffers() {
        String sql = """
                SELECT p.*, u.email AS seller_email, %s AS image,
                       (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi JOIN orders o ON o.id = oi.order_id
                         WHERE oi.product_id = p.id AND o.status <> 'cancelled') AS sold,
                       TRUE AS offer
                FROM weekly_offers w
                JOIN products p ON p.id = w.product_id
                LEFT JOIN users u ON u.id = p.seller_id
                ORDER BY w.position, p.id
                """.formatted(MAIN_IMAGE_SQL.formatted("p.id"));
        return jdbcTemplate.query(sql, (rs, i) -> mapProduct(rs));
    }

    public List<Integer> getOfferIds() {
        return jdbcTemplate.queryForList("SELECT product_id FROM weekly_offers ORDER BY position, product_id", Integer.class);
    }

    @Transactional
    public void setOffers(List<Integer> productIds) {
        List<Integer> ids = productIds == null ? List.of() : productIds.stream().distinct().toList();
        if (ids.size() > MAX_OFFERS) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Poți alege cel mult " + MAX_OFFERS + " oferte.");
        }
        for (Integer id : ids) {
            Integer exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products WHERE id = ?", Integer.class, id);
            if (exists == null || exists == 0) throw new ApiException(HttpStatus.BAD_REQUEST, "Produsul #" + id + " nu există.");
        }
        jdbcTemplate.update("DELETE FROM weekly_offers");
        for (int i = 0; i < ids.size(); i++) {
            jdbcTemplate.update("INSERT INTO weekly_offers (product_id, position) VALUES (?, ?)", ids.get(i), i);
        }
    }

    // ---------------------------------------------------------------- helpers

    private static void requireLength(String s, int min, int max, String field) {
        int len = s == null ? 0 : s.trim().length();
        if (len < min || len > max) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    min > 0 ? field + " trebuie să aibă între " + min + " și " + max + " caractere."
                            : field + " pot avea cel mult " + max + " caractere.");
        }
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
