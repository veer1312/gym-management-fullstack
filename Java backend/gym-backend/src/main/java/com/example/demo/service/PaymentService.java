package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.dto.CreatePaymentRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.dto.PaymentWithUserResponse;
import com.example.demo.dto.UserPaymentResponse;
import com.example.demo.entity.Payment;
import com.example.demo.entity.User;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service

public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;

    }

    // ADD PAYMENT

    @Transactional
    public Payment createPayment(CreatePaymentRequest request) {

        // Find member
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Update latest membership details
        user.setMembershipId(request.getMembershipId());
        user.setMembershipStartDate(request.getMembershipStartDate());
        user.setMembershipEndDate(request.getMembershipEndDate());

        userRepository.save(user);

        // Create payment
        Payment payment = new Payment();

        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDate(LocalDate.now());

        return paymentRepository.save(payment);
    }

    // GET ALL PAYMENTS WITH USER NAME
    public List<PaymentWithUserResponse> getAllPayments() {

        List<Payment> payments = paymentRepository.findAll();

        return payments.stream()
                .map(payment -> {

                    User user = userRepository
                            .findById(payment.getUserId())
                            .orElse(null);

                    String userName = user != null
                            ? user.getName()
                            : "Unknown User";

                    return new PaymentWithUserResponse(
                            payment.getId(),
                            payment.getUserId(),
                            userName,
                            payment.getAmount(),
                            payment.getPaymentDate(),
                            payment.getPaymentMethod());
                })
                .toList();
    }

    // GET ALL PAYMENTS OF ONE USER
    public UserPaymentResponse getPaymentsByUserId(Long userId) {

        // 1. Fetch the member from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Fetch all payments, latest first
        List<Payment> payments = paymentRepository.findByUserIdOrderByPaymentDateDesc(userId);

        // 3. Convert Payment entities into PaymentResponse DTOs
        List<PaymentResponse> paymentResponses = payments.stream()
                .map(payment -> new PaymentResponse(
                        payment.getId(),
                        payment.getAmount(),
                        payment.getPaymentDate().toString(),
                        payment.getPaymentMethod(),
                        null))
                .toList();

        // 4. Return member details + payment history
        return new UserPaymentResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getContactNumber(),
                user.getGender(),
                user.getDateOfBirth().toString(),
                user.getAddress(),
                user.getMembershipId(),
                null,
                user.getMembershipStartDate().toString(),
                user.getMembershipEndDate() != null
                        ? user.getMembershipEndDate().toString()
                        : null,
                paymentResponses);
    }

}
