package com.example.spring_boot_jdbc_app.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.spring_boot_jdbc_app.model.ProductImage;

@Repository
public class ProductImageRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int saveImage(ProductImage image) {
        String sql = "INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, image.product_id(), image.image_url(), image.is_main());
    }
}