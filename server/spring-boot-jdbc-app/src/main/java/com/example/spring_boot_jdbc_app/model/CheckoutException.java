package com.example.spring_boot_jdbc_app.model;

import org.springframework.http.HttpStatus;

/** A checkout problem the user can fix (bad input, product gone, not enough stock). */
public class CheckoutException extends RuntimeException {
    private final HttpStatus status;

    public CheckoutException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
