package com.example.spring_boot_jdbc_app.model;

/** Fields a user may change on their own profile (email, username and password are not editable here). */
public record ProfileUpdate(
        String name,
        String surname,
        String phone,
        Address address
) {}
