package com.example.spring_boot_jdbc_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot_jdbc_app.model.ContactMessage;
import com.example.spring_boot_jdbc_app.repository.ContactRepository;

@RestController
@RequestMapping("/contact")
public class ContactController {

    @Autowired private ContactRepository contactRepository;

    /** Public endpoint: stores a message from the contact form. */
    @PostMapping
    public ResponseEntity<String> send(@RequestBody ContactMessage m) {
        if (isBlank(m.name()) || isBlank(m.email()) || isBlank(m.message())
                || !m.email().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            return ResponseEntity.badRequest().body("Completează numele, un email valid și mesajul.");
        }
        if (m.name().length() > 100 || m.email().length() > 150 || m.message().length() > 4000
                || (m.subject() != null && m.subject().length() > 100)
                || (m.orderNumber() != null && m.orderNumber().length() > 30)) {
            return ResponseEntity.badRequest().body("Unul dintre câmpuri este prea lung.");
        }
        contactRepository.save(new ContactMessage(m.name().trim(), m.email().trim(),
                m.subject(), blankToNull(m.orderNumber()), m.message().trim()));
        return ResponseEntity.status(HttpStatus.CREATED).body("Mesaj trimis.");
    }

    private static boolean isBlank(String s) { return s == null || s.isBlank(); }

    private static String blankToNull(String s) { return isBlank(s) ? null : s.trim(); }
}
