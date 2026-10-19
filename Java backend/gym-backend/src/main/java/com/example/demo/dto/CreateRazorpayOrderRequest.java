package com.example.demo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;

public class CreateRazorpayOrderRequest {

    private Long membershipId;
    private BigDecimal amount;

    @Email
    private String email;

    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}