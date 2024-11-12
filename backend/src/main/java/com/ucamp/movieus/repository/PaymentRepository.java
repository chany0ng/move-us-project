package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentId(Long paymentId);
    Payment findByOrderId(String orderId);
    Optional<Payment> findByPaymentKey(String paymentKey);
    // 사용자 번호(userNum)로 결제 내역 조회
    List<Payment> findByUser_UserNum(int userNum);
}