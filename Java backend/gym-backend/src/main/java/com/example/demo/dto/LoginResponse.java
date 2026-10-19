package com.example.demo.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String name;
    private String email;
    private String authToken;

    public LoginResponse(
            boolean success,
            String message,
            Long userId,
            String name,
            String email,
            String authToken) {

        this.success = success;
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.authToken = authToken;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
    public String getAuthToken() {
        return authToken;
    }
}