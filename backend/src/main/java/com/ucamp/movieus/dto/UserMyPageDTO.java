// 재하 추가 코드 (회원정보 조회)
package com.ucamp.movieus.dto;

import lombok.Data;

@Data
public class UserMyPageDTO {
    private String userName;
    private String userEmail;
    private String kakaoEmail;
    private String userPhone;
}
