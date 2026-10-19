
package com.example.demo.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.razorpay.RazorpayException;

import jakarta.validation.Valid;

import com.example.demo.dto.CreatePaymentRequest;
import com.example.demo.dto.CreateRazorpayOrderRequest;
import com.example.demo.dto.PaymentRegistrationRequest;
import com.example.demo.dto.PaymentWithUserResponse;
import com.example.demo.dto.UserPaymentResponse;
import com.example.demo.entity.Payment;
import com.example.demo.service.PaymentService;
import com.example.demo.service.RazorpayService;
import com.example.demo.service.UserService;
import com.example.demo.dto.ExistingMemberPaymentRequest;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final RazorpayService razorpayService;
    private final UserService userService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    public PaymentController(
            PaymentService paymentService,
            RazorpayService razorpayService,
            UserService userService) {

        this.paymentService = paymentService;
        this.razorpayService = razorpayService;
        this.userService = userService;
    }

    // ADD PAYMENT - EXISTING API
    @PostMapping("/addPayment")
    public Map<String, Object> createPayment(
            @RequestBody CreatePaymentRequest request) {

        paymentService.createPayment(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment added successfully");

        return response;
    }

    // GET ALL PAYMENTS WITH USER NAME
    @GetMapping("/getAllPaymentList")
    public List<PaymentWithUserResponse> getPayments() {

        return paymentService.getAllPayments();
    }

    // GET PAYMENTS BY USER ID
    @GetMapping("/getPaymentById/{user_id}")
    public UserPaymentResponse getPaymentById(
            @PathVariable("user_id") Long userId) {

        return paymentService.getPaymentsByUserId(userId);
    }

    // CREATE RAZORPAY ORDER
    @PostMapping("/create-order")
    public Map<String, Object> createRazorpayOrder(
            @Valid @RequestBody CreateRazorpayOrderRequest request) {

        BigDecimal amount = request.getAmount();

        String email = request.getEmail();

        if (email != null && !email.isBlank()) {
            if (userService.emailExists(email.trim())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This email is already registered. Please use another email.");
            }
        }

        // Continue with your existing Razorpay order creation logic here.

        if (request.getMembershipId() == null
                || amount == null
                || amount.compareTo(BigDecimal.ZERO) <= 0
                || amount.scale() > 2) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid membership or payment amount");
        }

        try {
            int amountInPaise = amount
                    .multiply(BigDecimal.valueOf(100))
                    .intValueExact();

            JSONObject order = razorpayService.createOrder(amountInPaise);

            Map<String, Object> response = new HashMap<>();
            response.put("keyId", razorpayKeyId);
            response.put("orderId", order.getString("id"));
            response.put("amount", order.getInt("amount"));
            response.put("currency", order.getString("currency"));

            return response;

        } catch (RazorpayException | ArithmeticException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to create Razorpay order");
        }
    }

    // VERIFY RAZORPAY PAYMENT AND CREATE MEMBER
    @PostMapping("/verify-and-create-member")
    @Transactional
    public Map<String, Object> verifyAndCreateMember(
            @Valid @RequestBody PaymentRegistrationRequest request)
            throws RazorpayException {

        // Verify Razorpay signature and fetch payment details.
        JSONObject payment = razorpayService.verifyPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        // Confirm the payment belongs to the submitted order.
        if (!request.getRazorpayOrderId().equals(
                payment.optString("order_id"))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment order does not match");
        }

        // Only proceed when Razorpay confirms a captured payment.
        if (!"captured".equals(payment.optString("status"))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment has not been captured");
        }

        // Check the payment amount against the submitted member amount.
        BigDecimal memberAmount = BigDecimal.valueOf(
                request.getMemberData().getAmount());

        int expectedAmountInPaise;

        try {
            expectedAmountInPaise = memberAmount
                    .multiply(BigDecimal.valueOf(100))
                    .intValueExact();

        } catch (ArithmeticException | NumberFormatException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid payment amount");
        }

        if (payment.optInt("amount", -1) != expectedAmountInPaise
                || !"INR".equals(payment.optString("currency"))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment amount or currency does not match");
        }

        // Set payment details on the member request.
        request.getMemberData().setAmount(
                payment.getInt("amount") / 100.0);

        request.getMemberData().setPaymentMethod("UPI");

        // Create member and associated payment only after verification.
        userService.createMember(request.getMemberData());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message",
                "Payment verified and member created successfully");
        response.put("razorpayPaymentId",
                request.getRazorpayPaymentId());

        return response;
    }

    // For re payment section

    @PostMapping("/verify-and-add-payment")
    @Transactional
    public Map<String, Object> verifyAndAddPayment(
            @Valid @RequestBody ExistingMemberPaymentRequest request)
            throws RazorpayException {

        JSONObject verifiedPayment = razorpayService.verifyPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        CreatePaymentRequest paymentData = request.getPaymentData();

        if (!request.getRazorpayOrderId().equals(
                verifiedPayment.optString("order_id"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Order ID does not match");
        }

        if (!"captured".equals(verifiedPayment.optString("status"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Payment is not captured");
        }

        int expectedAmount;
        try {
            expectedAmount = BigDecimal.valueOf(paymentData.getAmount())
                    .multiply(BigDecimal.valueOf(100))
                    .intValueExact();
        } catch (ArithmeticException | NullPointerException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid payment amount");
        }

        if (verifiedPayment.optInt("amount", -1) != expectedAmount
                || !"INR".equals(verifiedPayment.optString("currency"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Payment amount or currency mismatch");
        }

        paymentData.setPaymentMethod("UPI");
        paymentService.createPayment(paymentData);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment verified and added successfully");
        response.put("razorpayPaymentId", request.getRazorpayPaymentId());

        return response;
    }

}
