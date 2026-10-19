package com.example.demo.dto;

public class PaymentResponse {

    private Long id;
    private Double amount;
    private String paymentDate;
    private String paymentMethod;
    private String membership;

    public PaymentResponse(Long id, Double amount, String paymentDate, String paymentMethod, String membership) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.membership = membership;
    }

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getMembership() {
        return membership;
    }
}
