package com.ucamp.movieus.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReviewRequestDTO {
    @NotNull(message = "User number은 필수 입력 항목입니다.")
    private Long userNum;       // 사용자 ID

    @NotNull(message = "Movie ID는 필수 입력 항목입니다.")
    private Long movieId;       // 영화 ID

    @NotNull(message = "Rating은 필수 입력 항목입니다.")
    @DecimalMin(value = "1.0", message = "Rating은 1.0 이상이어야 합니다.")
    @DecimalMax(value = "10.0", message = "Rating은 10.0 이하이어야 합니다.")
    private BigDecimal rating;   // 평점 (1.0 - 10.0)

    @NotEmpty(message = "Comment은 필수 입력 항목입니다.")
    @Size(max = 500, message = "Comment은 최대 500자까지 입력할 수 있습니다.")
    private String comment;      // 리뷰 내용
}
