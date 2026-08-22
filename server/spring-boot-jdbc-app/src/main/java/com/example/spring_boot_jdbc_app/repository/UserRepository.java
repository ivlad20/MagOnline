package com.example.spring_boot_jdbc_app.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.example.spring_boot_jdbc_app.model.Address;
import com.example.spring_boot_jdbc_app.model.User;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    // RowMapper to map SQL result to User object
    private RowMapper<User> userRowMapper = (rs, rowNum) -> {
        Address address = null;

        // verificăm dacă cel puțin un câmp nu e null
        if (rs.getString("street") != null || rs.getString("city") != null || rs.getString("zipcode") != null ||
                rs.getString("apartment") != null || rs.getString("floor") != null) {
            address = new Address(
                    rs.getString("street"),
                    rs.getString("city"),
                    rs.getString("zipcode"),
                    rs.getString("apartment"),
                    rs.getString("floor")
            );
        }

        return new User(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("surname"),
                rs.getString("username"),
                rs.getString("email"),
                address,
                rs.getString("phone"),
                rs.getString("password")
        );
    };

    // CREATE: Add a new user and their address
    public int saveUser(User user) {
        // Inserare în tabela users
        String userSql = "INSERT INTO users (name, surname, username, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.name());
            ps.setString(2, user.surname());
            ps.setString(3, user.username());
            ps.setString(4, user.email());
            ps.setString(5, user.phone());
            ps.setString(6, passwordEncoder.encode(user.password()));
            return ps;
        }, keyHolder);

        int userId = keyHolder.getKey().intValue();

        // Dacă adresa e null, nu o inserezi
        if (user.address() == null) {
            return 1; // succes inserare doar user
        }

        // Inserare în tabela addresses
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
        try {
            String sql = "SELECT u.*, a.street, a.city, a.zipcode, a.apartment, a.floor " +
                    "FROM users u LEFT JOIN addresses a ON u.id = a.user_id WHERE u.id = ?";
            return jdbcTemplate.queryForObject(sql, userRowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    // UPDATE: Update a user and their address
    public int updateUser(User user) {
        // First check if user exists
        User existingUser = getUserById(user.id());
        if (existingUser == null) {
            return 0;
        }

        // Only encode password if it's different from the existing one
        String passwordToUpdate = user.password();
        if (!passwordToUpdate.equals(existingUser.password())) {
            // If password is not already encoded, encode it
            if (!passwordToUpdate.startsWith("$2a$")) {
                passwordToUpdate = passwordEncoder.encode(passwordToUpdate);
            }
        }

        String userSql = "UPDATE users SET name = ?, surname = ?, username = ?, email = ?, phone = ?, password = ? WHERE id = ?";
        jdbcTemplate.update(
                userSql,
                user.name(),
                user.surname(),
                user.username(),
                user.email(),
                user.phone(),
                passwordToUpdate,
                user.id()
        );

        // Handle address update
        if (user.address() == null) {
            // Delete existing address if new user has no address
            jdbcTemplate.update("DELETE FROM addresses WHERE user_id = ?", user.id());
            return 1;
        }

        // Check if address exists
        String checkAddressSql = "SELECT COUNT(*) FROM addresses WHERE user_id = ?";
        int addressCount = jdbcTemplate.queryForObject(checkAddressSql, Integer.class, user.id());

        if (addressCount > 0) {
            // Update existing address
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
        } else {
            // Insert new address
            String addressSql = "INSERT INTO addresses (street, city, zipcode, apartment, floor, user_id) VALUES (?, ?, ?, ?, ?, ?)";
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
    }

    // DELETE: Delete a user and their associated address (cascade delete is handled by the database)
    public int deleteUser(Integer id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Used for logging in
    public User getUserByEmail(String email) {
        try {
            String sql = "SELECT u.*, a.street, a.city, a.zipcode, a.apartment, a.floor " +
                    "FROM users u LEFT JOIN addresses a ON u.id = a.user_id " +
                    "WHERE u.email = ?";
            return jdbcTemplate.queryForObject(sql, userRowMapper, email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}