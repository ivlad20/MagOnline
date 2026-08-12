package com.example.spring_boot_jdbc_app.model;

public record Product(
        Integer id,
        Integer seller_id,
        String brand,
        String category,
        String subcategory,
        String description,
        Float price,
        Integer stock,
        String title
) {}
