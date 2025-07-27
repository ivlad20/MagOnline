package com.example.spring_boot_jdbc_app.model;

public record ProductImage(
        Integer id,
        Integer product_id,
        String image_url,
        Boolean is_main
) {}
