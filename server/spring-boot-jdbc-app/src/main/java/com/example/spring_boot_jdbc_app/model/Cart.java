package com.example.spring_boot_jdbc_app.model;

public record Cart(
        Integer id,
        Integer user_id,
        Integer product_id,
        Integer quantity
) {}
