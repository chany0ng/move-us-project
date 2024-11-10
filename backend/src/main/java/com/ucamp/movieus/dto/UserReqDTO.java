package com.ucamp.movieus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserReqDTO {

    @NotEmpty(message = "Email은 필수 입력 항목입니다.")
    @Email(message = "올바른 이메일 주소를 입력해주세요.")
    private String userEmail;    // 자체 회원가입 이메일

    private String kakaoEmail;    // 카카오 소셜 로그인 이메일

    @NotEmpty(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.")
    private String userPw;        // 사용자 비밀번호

    private String confirmPassword;

    @NotEmpty(message = "이름은 필수 입력 항목입니다.")
    private String userName;      // 사용자 이름

    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호는 '-'를 포함해서 입력해주세요.")
    private String userPhone;     // 사용자 전화번호

    // 추가된 Role 필드
    private String role;

    // 기본 생성자
    public UserReqDTO() {}

    // 필드 초기화를 위한 생성자
    public UserReqDTO(String kakaoEmail, String userPw, String confirmPassword, String userName, String userPhone) {
        this.kakaoEmail = kakaoEmail;
        this.userPw = userPw;
        this.confirmPassword = confirmPassword;
        this.userName = userName;
        this.userPhone = userPhone;
        this.role = "USER"; // 기본 역할 설정
    }
}
