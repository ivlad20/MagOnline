package com.example.spring_boot_jdbc_app.model;

public record Seller(
        Integer userId,
        String companyName,
        String cui,
        String address,
        String phone,
        String iban
) {}