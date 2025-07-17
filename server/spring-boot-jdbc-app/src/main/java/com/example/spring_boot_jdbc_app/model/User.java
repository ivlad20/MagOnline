package com.example.spring_boot_jdbc_app.model;

public record User(
        Integer id,
        String name,
        String surname,
        String username,
        String email,
        Address address,
        String phone,
        String password
) {}