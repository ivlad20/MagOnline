package com.example.spring_boot_jdbc_app.model;

public record Favorites(
        Integer id,
        Integer user_id,
        Integer product_id
) {}
