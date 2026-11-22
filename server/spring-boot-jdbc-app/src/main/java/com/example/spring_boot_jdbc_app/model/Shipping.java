package com.example.spring_boot_jdbc_app.model;

import java.math.BigDecimal;
import java.util.Map;

/** Delivery prices. Keep in sync with client-nextjs/src/lib/shipping.ts. */
public final class Shipping {

    public static final BigDecimal FREE_FROM = new BigDecimal("250.00");

    public static final Map<String, BigDecimal> PRICES = Map.of(
            "courier", new BigDecimal("19.99"),
            "locker", new BigDecimal("12.99"));

    public static final java.util.Set<String> PAYMENT_METHODS = java.util.Set.of("cash", "card_on_delivery");

    private Shipping() {}

    public static BigDecimal cost(String method, BigDecimal subtotal) {
        return subtotal.compareTo(FREE_FROM) >= 0 ? BigDecimal.ZERO : PRICES.get(method);
    }
}
