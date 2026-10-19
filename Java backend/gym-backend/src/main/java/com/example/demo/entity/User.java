package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================
    // MEMBER INFORMATION
    // =========================

    @NotBlank(message = "Name is required")
    @Pattern(
        regexp = "^[A-Za-z ]+$",
        message = "Name should contain only characters"
    )
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Gender is required")
    @Column(nullable = false)
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    @Column(unique = true, nullable = false)
    private String email;

    // Password is OPTIONAL
    private String password;

    @NotBlank(message = "Phone number is required")
    @Column(nullable = false)
    private String contactNumber;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;


    // =========================
    // MEMBERSHIP INFORMATION
    // =========================

    // ID from membership_plan table
    @NotNull(message = "Membership is required")
    @Column(nullable = false)
    private Long membershipId;

    @NotNull(message = "Membership start date is required")
    @Column(nullable = false)
    private LocalDate membershipStartDate;

    // End date is OPTIONAL
    private LocalDate membershipEndDate;


    // =========================
    // EMERGENCY CONTACT
    // =========================

    @NotBlank(message = "Emergency contact name is required")
    @Column(nullable = false)
    private String emergencyContactName;

    @NotBlank(message = "Emergency relationship is required")
    @Column(nullable = false)
    private String emergencyRelationship;

    @NotBlank(message = "Emergency contact number is required")
    @Column(nullable = false)
    private String emergencyContactNumber;


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }


    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }


    public LocalDate getMembershipStartDate() {
        return membershipStartDate;
    }

    public void setMembershipStartDate(LocalDate membershipStartDate) {
        this.membershipStartDate = membershipStartDate;
    }


    public LocalDate getMembershipEndDate() {
        return membershipEndDate;
    }

    public void setMembershipEndDate(LocalDate membershipEndDate) {
        this.membershipEndDate = membershipEndDate;
    }


    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }


    public String getEmergencyRelationship() {
        return emergencyRelationship;
    }

    public void setEmergencyRelationship(String emergencyRelationship) {
        this.emergencyRelationship = emergencyRelationship;
    }


    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }
}