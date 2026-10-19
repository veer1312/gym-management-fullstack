package com.example.demo.dto;
import java.time.LocalDate;

public class PaymentWithUserResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;

    public PaymentWithUserResponse(
            Long id,
            Long userId,
            String userName,
            Double amount,
            LocalDate paymentDate,
            String paymentMethod) {

        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
}