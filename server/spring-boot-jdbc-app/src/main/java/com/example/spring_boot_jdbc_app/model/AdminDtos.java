package com.example.spring_boot_jdbc_app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.spring_boot_jdbc_app.model.OrderSummary.OrderLine;

/** Request/response shapes used only by the admin panel (/admin/**). */
public final class AdminDtos {

    private AdminDtos() {}

    // ---- Sales dashboard ----

    public record SalesStats(int days, BigDecimal revenue, int orders, BigDecimal averageOrder, int itemsSold,
                             int customers, int pendingOrders, List<DayPoint> daily, Map<String, Integer> byStatus,
                             List<TopProduct> topProducts, List<LowStock> lowStock) {}

    public record DayPoint(String date, BigDecimal revenue, int orders) {}

    public record TopProduct(Integer id, String title, String image, int quantity, BigDecimal revenue) {}

    public record LowStock(Integer id, String title, int stock) {}

    // ---- Orders ----

    public record AdminOrder(Integer id, LocalDateTime orderDate, String status, Integer userId, String customerEmail,
                             String shippingName, String shippingPhone, String shippingAddress, String deliveryMethod,
                             String paymentMethod, String notes, BigDecimal shippingCost, BigDecimal total,
                             List<OrderLine> items) {}

    /** Every field is optional; null means "leave as is". */
    public record OrderUpdate(String status, String shippingName, String shippingPhone, String shippingAddress,
                              String notes) {}

    // ---- Products / listings ----

    public record AdminProduct(Integer id, String title, String brand, String category, String subcategory,
                               String description, BigDecimal price, int stock, Integer sellerId, String sellerEmail,
                               String mainImage, int sold, boolean offer) {}

    public record ProductUpdate(String title, String brand, String category, String subcategory, String description,
                                BigDecimal price, Integer stock) {}

    // ---- Weekly offers ----

    public record OffersUpdate(List<Integer> productIds) {}

    // ---- Database ----

    public record TableInfo(String name, long rows) {}

    public record QueryResult(List<String> columns, List<List<Object>> rows, long total, boolean truncated,
                              long tookMs) {}

    public record SqlQuery(String sql) {}
}
