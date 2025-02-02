package com.example.spring_boot_jdbc_app.repository;

import com.example.spring_boot_jdbc_app.model.User;
import com.example.spring_boot_jdbc_app.model.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper to map SQL result to User object
    private RowMapper<User> userRowMapper = (rs, rowNum) -> {
        Address address = new Address(
                rs.getString("street"),
                rs.getString("city"),
                rs.getString("zipcode"),
                rs.getString("apartment"),
                rs.getString("floor")
        );

        return new User(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("surname"),
                rs.getString("username"),
                rs.getString("email"),
                address,
                rs.getString("phone")
        );
    };

    // CREATE: Add a new user and their address
    public int saveUser(User user) {
        // Insert into users table
        String userSql = "INSERT INTO users (name, surname, username, email, phone) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.name());
            ps.setString(2, user.surname());
            ps.setString(3, user.username());
            ps.setString(4, user.email());
            ps.setString(5, user.phone());
            return ps;
        }, keyHolder);

        // Get the generated user ID
        int userId = keyHolder.getKey().intValue();

        // Insert into addresses table
        String addressSql = "INSERT INTO addresses (street, city, zipcode, apartment, floor, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(
                addressSql,
                user.address().street(),
                user.address().city(),
                user.address().zipcode(),
                user.address().apartment(),
                user.address().floor(),
                userId
        );
    }

    // READ: Get all users with their addresses
    public List<User> getAllUsers() {
        String sql = "SELECT u.*, a.street, a.city, a.zipcode, a.apartment, a.floor " +
                "FROM users u LEFT JOIN addresses a ON u.id = a.user_id";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    // READ: Get user by ID with their address
    public User getUserById(Integer id) {
        String sql = "SELECT u.*, a.street, a.city, a.zipcode, a.apartment, a.floor " +
                "FROM users u LEFT JOIN addresses a ON u.id = a.user_id WHERE u.id = ?";
        return jdbcTemplate.queryForObject(sql, userRowMapper, id);
    }

    // UPDATE: Update a user and their address
    public int updateUser(User user) {
        // Update users table
        String userSql = "UPDATE users SET name = ?, surname = ?, username = ?, email = ?, phone = ? WHERE id = ?";
        jdbcTemplate.update(
                userSql,
                user.name(),
                user.surname(),
                user.username(),
                user.email(),
                user.phone(),
                user.id()
        );

        // Update addresses table
        String addressSql = "UPDATE addresses SET street = ?, city = ?, zipcode = ?, apartment = ?, floor = ? WHERE user_id = ?";
        return jdbcTemplate.update(
                addressSql,
                user.address().street(),
                user.address().city(),
                user.address().zipcode(),
                user.address().apartment(),
                user.address().floor(),
                user.id()
        );
    }

    // DELETE: Delete a user and their associated address (cascade delete is handled by the database)
    public int deleteUser(Integer id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}