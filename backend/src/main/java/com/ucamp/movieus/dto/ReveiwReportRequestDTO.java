package com.ucamp.movieus.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReveiwReportRequestDTO {

    private Long reviewId; // 리뷰 ID (Primary Key)

    private String reportUserEmail;

    private Boolean report; // 신고

    @NotEmpty(message = "reportComment는 필수 입력 항목입니다.")
    @Size(max = 500, message = "reportComment는 최대 500자까지 입력할 수 있습니다.")
    private String reportComment; // 신고 내용

}
