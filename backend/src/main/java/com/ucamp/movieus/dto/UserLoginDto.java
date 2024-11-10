package com.ucamp.movieus.dto;

import lombok.Data;

@Data
public class UserLoginDto {
    private Integer userNum;
    private String userEmail;
    private String userPw;
}
