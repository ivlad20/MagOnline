package com.example.spring_boot_jdbc_app.model;
import java.time.LocalDate;

public record Order(
        Integer id,
        Integer user_id,
        LocalDate order_date,
        String status
) {}
