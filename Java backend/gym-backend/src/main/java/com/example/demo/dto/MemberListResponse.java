package com.example.demo.dto;

import java.time.LocalDate;

public class MemberListResponse {

    private Long id;
    private String name;
    private String email;
    private String contactNumber;
    private String membership;
    private LocalDate membershipStartDate;
    private LocalDate membershipEndDate;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String paymentStatus;
    private String status;

    public MemberListResponse(
            Long id,
            String name,
            String email,
            String contactNumber,
            String membership,
            LocalDate membershipStartDate,
            LocalDate membershipEndDate,
            Double amount,
            LocalDate paymentDate,
            String paymentMethod,
            String paymentStatus,
            String status) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.membership = membership;
        this.membershipStartDate = membershipStartDate;
        this.membershipEndDate = membershipEndDate;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContactNumber() { return contactNumber; }
    public String getMembership() { return membership; }
    public LocalDate getMembershipStartDate() { return membershipStartDate; }
    public LocalDate getMembershipEndDate() { return membershipEndDate; }
    public Double getAmount() { return amount; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public String getStatus() { return status; }
}