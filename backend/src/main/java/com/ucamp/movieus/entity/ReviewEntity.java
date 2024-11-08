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

    @ManyToOne
    @JoinColumn(name = "movie_Id", referencedColumnName = "tmdbId", nullable = false)
    private Movie movieId; // 영화 ID (외래키, Movie 테이블 참조)

    @Column(nullable = false)
    private BigDecimal rating; // 평점 (1.0 - 10.0)

    @Column(columnDefinition = "TEXT")
    private String comment; // 리뷰 내용

    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate; // 리뷰 작성 날짜
}
