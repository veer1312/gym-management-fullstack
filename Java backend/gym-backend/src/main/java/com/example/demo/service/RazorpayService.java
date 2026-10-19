package com.example.demo.service; // Change if your package is different

import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;


@Service
public class RazorpayService {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public JSONObject createOrder(int amountInPaise)
            throws RazorpayException {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject request = new JSONObject();
        request.put("amount", amountInPaise);
        request.put("currency", "INR");
        request.put("receipt", "gym_" + UUID.randomUUID());

        return client.orders.create(request).toJson();
    }

    public JSONObject verifyPayment(
            String orderId,
            String paymentId,
            String signature) throws RazorpayException {

        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", orderId);
        attributes.put("razorpay_payment_id", paymentId);
        attributes.put("razorpay_signature", signature);

        try {
            boolean signatureValid = com.razorpay.Utils.verifyPaymentSignature(
                    attributes, keySecret);

            if (!signatureValid) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid payment signature");
            }
        } catch (RazorpayException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment verification failed");
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        // Fetch payment status directly from Razorpay.
        JSONObject payment = client.payments.fetch(paymentId).toJson();

        if (!orderId.equals(payment.optString("order_id"))
                || !"captured".equals(payment.optString("status"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment is not confirmed");
        }

        return payment;
    }
}