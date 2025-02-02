package com.example.spring_boot_jdbc_app.model;

public record Address(
        String street,
        String city,
        String zipcode,
        String apartment,
        String floor
) {}

