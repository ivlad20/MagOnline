package com.example.spring_boot_jdbc_app.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RecentlyViewedRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void upsertView(int userId, int productId) {
        String sql = """
            INSERT INTO recently_viewed (user_id, product_id, viewed_at)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE viewed_at = NOW()
            """;
        jdbcTemplate.update(sql, userId, productId);
    }

    public List<Integer> getRecentProductIds(int userId, int limit) {
        String sql = """
            SELECT product_id FROM recently_viewed
            WHERE user_id = ?
            ORDER BY viewed_at DESC
            LIMIT ?
            """;
        return jdbcTemplate.queryForList(sql, Integer.class, userId, limit);
    }
}