package com.example.spring_boot_jdbc_app.model;

public class JWTResponse {
    private String token;

    public JWTResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
