package com.example.spring_boot_jdbc_app.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.spring_boot_jdbc_app.model.ContactMessage;

@Repository
public class ContactRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(ContactMessage m) {
        return jdbcTemplate.update(
                "INSERT INTO contact_messages (name, email, subject, order_number, message) VALUES (?, ?, ?, ?, ?)",
                m.name(), m.email(), m.subject(), m.orderNumber(), m.message());
    }
}
