package com.example.spring_boot_jdbc_app.model;

public record OrderItem(
        Integer id,
        Integer order_id,
        Integer product_id,
        Integer quantity,
        Float price
) {}
