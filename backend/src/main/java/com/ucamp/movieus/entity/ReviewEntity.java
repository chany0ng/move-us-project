package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@DynamicUpdate
@Table(name = "review")
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId; // 리뷰 ID (Primary Key)

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private UserEntity user; // 사용자 (User 테이블 참조)

    private Long tmdbId; // 영화 TMDB ID

    @Column(nullable = false)
    private BigDecimal rating; // 평점 (1.0 - 10.0)

    @Column(columnDefinition = "TEXT")
    private String comment; // 리뷰 내용

    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate; // 리뷰 작성 날짜

    @Column(name = "report_user_email")
    private String reportUserEmail;

    @Column(nullable = false)
    private Boolean report; // 신고

    @Column(name = "report_comment", columnDefinition = "TEXT")
    private String reportComment; // 신고 내용

    @Column(name = "review_report_date")
    private LocalDateTime reviewReportDate; // 리뷰 신고 날짜
}
