//package com.ucamp.movieus.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import org.hibernate.annotations.GenericGenerator;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Entity
//@Data
//public class Payment {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 설정
//    @Column(name = "payment_id")
//    private Long paymentId;
//
//    @Column(name = "payment_key", nullable = true) // 결제 키
//    private String paymentKey;
//
//    // @Column(nullable = false, name = "reservation_id")
//    // private Long reservationId; // 예매 ID (주석 처리된 필드)
//
//    @Column(name = "payment_method", nullable = false)
//    private String paymentMethod; // 결제 방식
//
//    @Column(name = "payment_date", nullable = false, columnDefinition = "DATETIME(0)")
//    private LocalDateTime paymentDate; // 결제 날짜
//
//    @Column(name = "amount", nullable = false)
//    private int amount; // 결제 금액
//
//    @Column(name = "status", nullable = false)
//    private String status; // 결제 상태
//
//    @ManyToOne
//    @JoinColumn(name = "userNum", referencedColumnName = "userNum", nullable = true)
//    private UserEntity user; // 사용자 정보와의 연관 관계
//
//    @Column(name = "order_id", columnDefinition = "CHAR(64)")
//    private String orderId; // 주문 ID
//
//
//    @PrePersist
//    public void prePersist() {
//        if (orderId == null) {
//            orderId = UUID.randomUUID().toString(); // orderId 생성
//        }
//    }
//}

package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "payment_key", nullable = true)
    private String paymentKey;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "payment_date", nullable = false, columnDefinition = "DATETIME(0)")
    private LocalDateTime paymentDate;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "status", nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_num", referencedColumnName = "userNum", nullable = true)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private ScreeningSchedule screeningSchedule; // 상영 일정 참조

    @ManyToOne
    @JoinColumn(name = "time_id", referencedColumnName = "time_id", nullable = false)
    private ScreeningTime screeningTime;

    @ManyToMany
    @JoinTable(
            name = "payment_seat",
            joinColumns = @JoinColumn(name = "payment_id"),
            inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    private List<Seat> seats;  // 여러 좌석을 참조할 수 있는 필드


    @Column(name = "order_id", columnDefinition = "CHAR(64)")
    private String orderId;

    @Column(name = "order_name", columnDefinition = "CHAR(64)")
    private String orderName;

    @PrePersist
    public void prePersist() {
        if (orderId == null) {
            orderId = UUID.randomUUID().toString();
        }
    }
}