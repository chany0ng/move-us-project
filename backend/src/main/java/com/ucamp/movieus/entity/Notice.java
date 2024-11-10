package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Data
@Entity
@DynamicUpdate
@Table(name = "notice")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Integer noticeId;    // 공지사항 ID

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "admin_id", referencedColumnName = "id", nullable = false)
    private AdminEntity admin;    // 관리자 ID (Admin 테이블 외래키)

    @Column(name = "title", nullable = false, length = 255)
    private String title;   // 공지사항 제목

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content; // 공지사항 내용

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 생성 일자

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;  // 수정 일자

    @PrePersist // 엔티티가 처음 persist될 때, 즉 데이터베이스에 처음으로 저장되기 전에 호출
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate // 엔티티가 변경되어 update될 때, 즉 데이터베이스에 업데이트되기 전에 호출
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
