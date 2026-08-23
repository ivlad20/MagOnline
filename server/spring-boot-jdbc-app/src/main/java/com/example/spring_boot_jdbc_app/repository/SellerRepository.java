package com.example.spring_boot_jdbc_app.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.spring_boot_jdbc_app.model.Seller;

@Repository
public class SellerRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Seller> sellerRowMapper = (rs, rowNum) -> new Seller(
            rs.getInt("user_id"),
            rs.getString("company_name"),
            rs.getString("cui"),
            rs.getString("address"),
            rs.getString("phone"),
            rs.getString("iban")
    );

    public boolean isSeller(Integer userId) {
        String sql = "SELECT COUNT(*) FROM sellers WHERE user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return count != null && count > 0;
    }

    public Seller getSellerByUserId(Integer userId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM sellers WHERE user_id = ?", sellerRowMapper, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createSeller(Seller seller) {
        String sql = "INSERT INTO sellers (user_id, company_name, cui, address, phone, iban) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, seller.userId(), seller.companyName(), seller.cui(),
                seller.address(), seller.phone(), seller.iban());
    }
}