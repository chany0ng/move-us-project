package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.PaymentRequestDTO;
import com.ucamp.movieus.dto.PaymentResponseDTO;
import com.ucamp.movieus.entity.Payment;
import com.ucamp.movieus.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {
    @Value("${payment.toss.test_secret_api_key}")
    private String tossApiKey;

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final String tossPaymentsBaseUrl = "https://api.tosspayments.com/v1/payments";

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment findPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public void saveSuccessfulPayment(String orderId, int amount, String paymentMethod) {
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
//        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentDate(LocalDateTime.now().withSecond(0).withNano(0));
        payment.setStatus("SUCCESS");

        paymentRepository.save(payment); // 결제 정보 저장
    }

    public PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO) {
        // orderId가 제공되지 않으면 고유한 값 생성
        if (requestDTO.getOrderId() == null || requestDTO.getOrderId().isEmpty()) {
            requestDTO.setOrderId(UUID.randomUUID().toString());
        }

        // Toss Payments API 호출 예제
        String tossUrl = "https://api.tosspayments.com/v1/payments";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(tossApiKey, "");

        Map<String, Object> tossRequest = new HashMap<>();
        tossRequest.put("amount", requestDTO.getAmount());
        tossRequest.put("orderName", requestDTO.getOrderName());
        tossRequest.put("successUrl", requestDTO.getSuccessUrl());
        tossRequest.put("failUrl", requestDTO.getFailUrl());
        tossRequest.put("orderId", requestDTO.getOrderId()); // orderId 추가

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(tossRequest, headers);

        // Toss Payments API 호출 및 응답 처리
        ResponseEntity<String> response = restTemplate.postForEntity(tossUrl, request, String.class);

        // JSON 응답에서 paymentKey 추출 (예제)
        String paymentKey = ""; // 실제 구현에서는 JSON 파싱 필요
        // JSON 응답을 파싱하여 paymentKey 값을 설정해야 합니다.

        // 결제 상태 확인 및 DB에 저장
        Payment payment = new Payment();
        payment.setPaymentMethod(requestDTO.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setAmount(requestDTO.getAmount());
        payment.setStatus("PENDING");
        payment.setOrderId(requestDTO.getOrderId());

        payment = paymentRepository.save(payment);

        // PaymentResponseDTO 생성 및 응답 반환
        PaymentResponseDTO responseDTO = new PaymentResponseDTO();
        responseDTO.setPaymentId(payment.getPaymentId());
        responseDTO.setStatus("PENDING");
        responseDTO.setMessage("Payment initiated");
        responseDTO.setAmount(requestDTO.getAmount());

        return responseDTO;
    }


    public boolean verifyPayment(String paymentKey, String orderId, int amount) {
        String url = tossPaymentsBaseUrl + "/confirm";

        // 요청 헤더에 인증 정보를 포함
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(tossApiKey, "");  // Basic Auth 방식 사용
        headers.set("Content-Type", "application/json");

        // 요청 바디에 필요한 데이터를 포함
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("paymentKey", paymentKey);
        requestBody.put("orderId", orderId);
        requestBody.put("amount", amount);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Toss Payments API에 요청을 보내고 결제 상태 확인
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();  // 성공적이면 true 반환
        } catch (Exception e) {
            e.printStackTrace();  // 에러 로그
            return false;
        }
    }

    public void updatePaymentStatus(String orderId, String status) {
        // orderId로 Payment 객체 조회 후 상태 업데이트 (예시)
        Payment payment = paymentRepository.findByOrderId(orderId);
        if (payment != null) {
            payment.setStatus(status);
            paymentRepository.save(payment);
        }
    }
    public void updatePaymentStatusByPaymentKey(String paymentKey, String status) {
        Optional<Payment> paymentOpt = paymentRepository.findByPaymentKey(paymentKey);
        paymentOpt.ifPresent(payment -> {
            payment.setStatus(status);
            paymentRepository.save(payment);
        });
    }









    public void saveSuccessfulPayment(String orderId, int amount, String paymentMethod, String paymentKey) {
        Payment payment = paymentRepository.findByOrderId(orderId);
        if (payment == null) {
            payment = new Payment();
            payment.setOrderId(orderId);
        }
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus("!!!");
        payment.setPaymentKey(paymentKey); // paymentKey 저장
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);
    }





    public boolean cancelPayment(String paymentKey, String cancelReason) {
        String url = tossPaymentsBaseUrl + "/" + paymentKey + "/cancel";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(tossApiKey, "");

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("cancelReason", cancelReason);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();  // 성공 시 true 반환
        } catch (Exception e) {
            e.printStackTrace();  // 에러 로그 출력
            return false;
        }
    }
}
