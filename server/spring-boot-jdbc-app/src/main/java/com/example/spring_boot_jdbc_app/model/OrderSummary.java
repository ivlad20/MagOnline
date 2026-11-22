package com.example.spring_boot_jdbc_app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** An order as shown on the "Comenzile mele" page. total = items + shippingCost. */
public record OrderSummary(
        Integer id,
        LocalDateTime orderDate,
        String status,
        BigDecimal shippingCost,
        BigDecimal total,
        String shippingName,
        String shippingAddress,
        String deliveryMethod,
        String paymentMethod,
        List<OrderLine> items
) {
    public record OrderLine(
            Integer productId,
            String title,
            String image,
            Integer quantity,
            BigDecimal price
    ) {}
}
