package com.example.spring_boot_jdbc_app.model;

import org.springframework.http.HttpStatus;

/** An error with a readable (Romanian) message meant to be shown as-is in the UI. */
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
