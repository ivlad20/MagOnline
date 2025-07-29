package com.example.spring_boot_jdbc_app.model;

import java.util.List;

public record ProductPlusImages(
        Integer id,
        String brand,
        String category,
        String subcategory,
        String description,
        Float price,
        Integer stock,
        String mainImage,
        List<String> images

) {}
