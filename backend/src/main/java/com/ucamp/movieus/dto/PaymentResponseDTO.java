package com.ucamp.movieus.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private String status;
    private String message;
    private int amount; // 결제 금액
    private String orderId; // 주문 ID
    private String orderName; // 주문 이름
    private String paymentKey; // 추가: 결제 키 필드
    private LocalDateTime paymentDate;

    // 추가 필드들
    private Long movieId; // 예매한 영화 ID
    private int theaterId; // 상영관 ID
    private int userNum;
    private Long timeId;
    private LocalDate screeningDate; // 상영 날짜
    private LocalTime screeningTime; // 상영 시간
    private List<SeatDTO> seats; // 좌석 정보 리스트
}
