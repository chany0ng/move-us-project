package com.ucamp.movieus.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserReqFormDTO {
    private int userNum;

    @NotEmpty(message = "Email은 필수 입력 항목입니다.")
    private String userEmail;    // 자체 회원가입 이메일

    private String kakaoEmail;    // 카카오 소셜 로그인 이메일

    @NotEmpty(message = "비밀번호는 필수 입력 항목입니다.")
    private String userPw;        // 사용자 비밀번호

    private String confirmPassword;

    @NotEmpty(message = "이름은 필수 입력 항목입니다.")
    private String userName;      // 사용자 이름

    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호는 010-xxxx-xxxx 형식이어야 합니다.")
    private String userPhone;     // 사용자 전화번호
}
