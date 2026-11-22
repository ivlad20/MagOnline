package com.example.spring_boot_jdbc_app.repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.spring_boot_jdbc_app.model.Address;
import com.example.spring_boot_jdbc_app.model.CheckoutException;
import com.example.spring_boot_jdbc_app.model.CheckoutRequest;
import com.example.spring_boot_jdbc_app.model.OrderSummary;
import com.example.spring_boot_jdbc_app.model.OrderSummary.OrderLine;
import com.example.spring_boot_jdbc_app.model.Shipping;

@Repository
public class OrderRepository {

    private static final int MAX_QTY_PER_PRODUCT = 10;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    /** Header columns of one order, collected while reading the joined rows. */
    private record Header(LocalDateTime date, String status, BigDecimal shippingCost, String name,
                          String address, String delivery, String payment) {}

    /** All orders of a user, newest first, each with its lines (product title + main image). */
    public List<OrderSummary> getOrdersByUserId(Integer userId) {
        String sql = """
                SELECT o.id, o.order_date, o.status, o.shipping_cost, o.shipping_name, o.shipping_address,
                       o.delivery_method, o.payment_method,
                       oi.product_id, oi.quantity, oi.price,
                       p.title,
                       (SELECT pi.image_url FROM product_images pi
                         WHERE pi.product_id = oi.product_id
                         ORDER BY pi.is_main DESC, pi.id LIMIT 1) AS image
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                LEFT JOIN products p ON p.id = oi.product_id
                WHERE o.user_id = ?
                ORDER BY o.order_date DESC, o.id DESC, oi.id
                """;

        Map<Integer, Header> headers = new LinkedHashMap<>();
        Map<Integer, List<OrderLine>> lines = new LinkedHashMap<>();

        jdbcTemplate.query(sql, rs -> {
            int orderId = rs.getInt("id");
            if (!headers.containsKey(orderId)) {
                headers.put(orderId, new Header(
                        rs.getTimestamp("order_date").toLocalDateTime(), rs.getString("status"),
                        rs.getBigDecimal("shipping_cost"), rs.getString("shipping_name"),
                        rs.getString("shipping_address"), rs.getString("delivery_method"),
                        rs.getString("payment_method")));
                lines.put(orderId, new ArrayList<>());
            }
            int productId = rs.getInt("product_id");
            if (!rs.wasNull()) {
                lines.get(orderId).add(new OrderLine(productId, rs.getString("title"), rs.getString("image"),
                        rs.getInt("quantity"), rs.getBigDecimal("price")));
            }
        }, userId);

        List<OrderSummary> orders = new ArrayList<>();
        headers.forEach((id, h) -> {
            List<OrderLine> orderLines = lines.get(id);
            BigDecimal shipping = h.shippingCost() == null ? BigDecimal.ZERO : h.shippingCost();
            BigDecimal total = orderLines.stream()
                    .map(l -> l.price().multiply(BigDecimal.valueOf(l.quantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .add(shipping);
            orders.add(new OrderSummary(id, h.date(), h.status(), shipping, total, h.name(), h.address(),
                    h.delivery(), h.payment(), orderLines));
        });
        return orders;
    }

    /**
     * Places an order from the checkout form, all in one transaction:
     * locks the products, checks stock, uses database prices, writes the order and lowers stock.
     *
     * @return the new order id
     */
    @Transactional
    public int createOrder(Integer userId, CheckoutRequest req) {
        validate(req);

        // Merge duplicate lines (same product twice) into one quantity.
        Map<Integer, Integer> quantities = new LinkedHashMap<>();
        for (CheckoutRequest.Line line : req.items()) {
            quantities.merge(line.productId(), line.quantity(), Integer::sum);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        Map<Integer, BigDecimal> prices = new LinkedHashMap<>();
        for (Map.Entry<Integer, Integer> e : quantities.entrySet()) {
            int productId = e.getKey();
            int qty = e.getValue();
            if (qty > MAX_QTY_PER_PRODUCT) {
                throw new CheckoutException(HttpStatus.BAD_REQUEST,
                        "Poți comanda cel mult " + MAX_QTY_PER_PRODUCT + " bucăți din același produs.");
            }
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                    "SELECT title, price, stock FROM products WHERE id = ? FOR UPDATE", productId);
            if (rows.isEmpty()) {
                throw new CheckoutException(HttpStatus.CONFLICT,
                        "Un produs din coș nu mai este disponibil. Elimină-l și încearcă din nou.");
            }
            Map<String, Object> row = rows.get(0);
            int stock = ((Number) row.get("stock")).intValue();
            if (stock < qty) {
                throw new CheckoutException(HttpStatus.CONFLICT, stock == 0
                        ? "„" + row.get("title") + "” nu mai este în stoc."
                        : "Mai sunt doar " + stock + " bucăți din „" + row.get("title") + "”.");
            }
            BigDecimal price = new BigDecimal(row.get("price").toString()).setScale(2, RoundingMode.HALF_UP);
            prices.put(productId, price);
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(qty)));
        }

        BigDecimal shippingCost = Shipping.cost(req.deliveryMethod(), subtotal);
        String address = formatAddress(req.address());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO orders (user_id, status, shipping_name, shipping_phone, shipping_address, "
                            + "delivery_method, payment_method, shipping_cost, notes) "
                            + "VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, userId);
            ps.setString(2, req.name().trim());
            ps.setString(3, req.phone().trim());
            ps.setString(4, address);
            ps.setString(5, req.deliveryMethod());
            ps.setString(6, req.paymentMethod());
            ps.setBigDecimal(7, shippingCost);
            ps.setString(8, req.notes() == null || req.notes().isBlank() ? null : req.notes().trim());
            return ps;
        }, keyHolder);
        int orderId = keyHolder.getKey().intValue();

        for (Map.Entry<Integer, Integer> e : quantities.entrySet()) {
            jdbcTemplate.update("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                    orderId, e.getKey(), e.getValue(), prices.get(e.getKey()));
            jdbcTemplate.update("UPDATE products SET stock = stock - ? WHERE id = ?", e.getValue(), e.getKey());
        }

        if (Boolean.TRUE.equals(req.saveAddress())) {
            userRepository.upsertAddress(userId, req.address());
        }
        return orderId;
    }

    private static void validate(CheckoutRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Coșul este gol.");
        }
        for (CheckoutRequest.Line line : req.items()) {
            if (line.productId() == null || line.quantity() == null || line.quantity() < 1) {
                throw new CheckoutException(HttpStatus.BAD_REQUEST, "Coșul conține un produs invalid.");
            }
        }
        if (isBlank(req.name()) || req.name().length() > 200) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Completează numele destinatarului.");
        }
        if (isBlank(req.phone()) || !req.phone().replaceAll("[\\s.-]", "").matches("^\\+?\\d{9,14}$")) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Introdu un număr de telefon valid.");
        }
        Address a = req.address();
        if (a == null || isBlank(a.street()) || isBlank(a.city()) || isBlank(a.zipcode())) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Completează strada, orașul și codul poștal.");
        }
        if (!Shipping.PRICES.containsKey(req.deliveryMethod())) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Alege o metodă de livrare.");
        }
        if (!Shipping.PAYMENT_METHODS.contains(req.paymentMethod())) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Alege o metodă de plată.");
        }
        if (req.notes() != null && req.notes().length() > 500) {
            throw new CheckoutException(HttpStatus.BAD_REQUEST, "Observațiile pot avea cel mult 500 de caractere.");
        }
    }

    private static String formatAddress(Address a) {
        List<String> parts = new ArrayList<>();
        parts.add(a.street().trim());
        if (!isBlank(a.apartment())) parts.add("Ap. " + a.apartment().trim());
        if (!isBlank(a.floor())) parts.add("Etaj " + a.floor().trim());
        parts.add(a.city().trim());
        parts.add(a.zipcode().trim());
        String text = String.join(", ", parts);
        return text.length() > 400 ? text.substring(0, 400) : text;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
