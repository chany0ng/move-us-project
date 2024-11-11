package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentId(Long paymentId);
    Payment findByOrderId(String orderId);
    Optional<Payment> findByPaymentKey(String paymentKey);

}