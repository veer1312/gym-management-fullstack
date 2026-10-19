package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    Optional<Payment> findFirstByUserIdOrderByPaymentDateDescIdDesc(
            Long userId);
    List<Payment> findByUserIdOrderByPaymentDateDesc(Long userId);
}