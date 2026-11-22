package com.example.spring_boot_jdbc_app.model;

import java.util.List;

/** Body of POST /orders. Prices are never taken from the client; they are read from the database. */
public record CheckoutRequest(
        List<Line> items,
        String name,
        String phone,
        Address address,
        String deliveryMethod,   // "courier" | "locker"
        String paymentMethod,    // "cash" | "card_on_delivery"
        String notes,
        Boolean saveAddress
) {
    public record Line(Integer productId, Integer quantity) {}
}
