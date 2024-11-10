package com.ucamp.movieus.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class NoticeRequestDTO {

    private Integer admin;      // 관리자 ID

    @NotEmpty(message = "title은 필수 입력항목입니다.")
    private String title;         // 공지사항 제목

    @NotEmpty(message = "content는 필수 입력항목입니다.")
    private String content;       // 공지사항 내용

}
