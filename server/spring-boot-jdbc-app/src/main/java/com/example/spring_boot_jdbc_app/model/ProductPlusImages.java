package com.example.spring_boot_jdbc_app.model;

import java.util.List;

public record ProductPlusImages(
        Integer id,
        String brand,
        String category,
        String title,
        Float price,
        String mainImage,
        List<String> images

) {}
