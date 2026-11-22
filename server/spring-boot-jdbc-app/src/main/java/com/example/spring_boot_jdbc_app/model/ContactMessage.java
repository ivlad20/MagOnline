package com.example.spring_boot_jdbc_app.model;

/** A message sent from the contact page. */
public record ContactMessage(
        String name,
        String email,
        String subject,
        String orderNumber,
        String message
) {}
