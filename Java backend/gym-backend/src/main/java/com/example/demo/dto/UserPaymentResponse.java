// For getting all payment details of a user

package com.example.demo.dto;
import java.util.List;

public class UserPaymentResponse {

    private Long userId;
    private String userName;
    private String email;
    private String contactNumber;
    private String gender;
    private String dateOfBirth;
    private String address;

    private Long membershipId;
    private String membership;
    private String membershipStartDate;
    private String membershipEndDate;

    private List<PaymentResponse> payments;

    public UserPaymentResponse(
            Long userId,
            String userName,
            String email,
            String contactNumber,
            String gender,
            String dateOfBirth,
            String address,
            Long membershipId,
            String membership,
            String membershipStartDate,
            String membershipEndDate,
            List<PaymentResponse> payments) {

        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.membershipId = membershipId;
        this.membership = membership;
        this.membershipStartDate = membershipStartDate;
        this.membershipEndDate = membershipEndDate;
        this.payments = payments;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getGender() {
        return gender;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public Long getMembershipId() {
        return membershipId;
    }

    public String getMembership() {
        return membership;
    }

    public String getMembershipStartDate() {
        return membershipStartDate;
    }

    public String getMembershipEndDate() {
        return membershipEndDate;
    }

    public List<PaymentResponse> getPayments() {
        return payments;
    }
}