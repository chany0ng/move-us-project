package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResDTO {
    private int userNum;            // 사용자 ID
    private String userEmail;      // 자체 회원가입 이메일
    private String kakaoEmail;     // 카카오 소셜 로그인 이메일
    private String userName;       // 사용자 이름
    private String userPhone;      // 사용자 전화번호

    @JsonFormat(shape = JsonFormat.Shape.STRING
            , pattern = "yyyy-MM-dd HH:mm:ss E a"
            , timezone = "Asia/Seoul")
    private LocalDateTime createDt;  // 계정 생성 시각


    @JsonFormat(shape = JsonFormat.Shape.STRING
            , pattern = "yyyy-MM-dd HH:mm:ss E a"
            , timezone = "Asia/Seoul")
    private LocalDateTime updateDt;  // 계정 업데이트 시각

}
