package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ucamp.movieus.entity.Notice;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class NoticeResponseDTO {

    private Integer noticeId;     // 공지사항 ID
    private String adminName;     // 관리자 이름
    private String title;         // 공지사항 제목
    private String content;       // 공지사항 내용

    @JsonFormat(pattern = "yyyy-MM-dd") // 날짜 포맷 지정
    private LocalDateTime createdAt;  // 생성 일자
    @JsonFormat(pattern = "yyyy-MM-dd") // 날짜 포맷 지정
    private LocalDateTime updatedAt;  // 수정 일자

    // Notice 엔티티를 받아서 DTO로 변환하는 생성자
    public NoticeResponseDTO(Notice notice) {
        this.noticeId = notice.getNoticeId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.createdAt = notice.getCreatedAt();
        this.updatedAt = notice.getUpdatedAt();
        this.adminName = notice.getAdmin() != null ? notice.getAdmin().getName() : null;
    }
}
