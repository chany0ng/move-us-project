package com.ucamp.movieus.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class PaymentRequestDTO {
    private String paymentMethod;
    private int amount;
    private String successUrl;
    private String orderName;
    private String failUrl;
    private String orderId; // 주문 ID 필드
    private String paymentKey; // 추가: 결제 키 필드

    // 추가 필드들
    private Long movieId; // 예매할 영화 ID
    private int theaterId; // 상영관 ID
    private Long timeId;
    private  int seatId;
    private int userNum; // 사용자 번호
    private Long screeningScheduleId;
    private LocalDate screeningDate; // 상영 날짜
    private LocalTime screeningTime; // 상영 시간
    private List<String> seatIds; // 좌석 리스트
}
