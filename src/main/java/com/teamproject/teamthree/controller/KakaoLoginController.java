//package com.teamproject.teamthree.controller;
//
//import com.teamproject.teamthree.dto.UserReqDTO;
//import com.teamproject.teamthree.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.client.RestTemplate;
//
//@Controller
//public class KakaoLoginController {
//
//    @Value("${kakao.client.id}")
//    private String clientId;
//
//    @Value("${kakao.redirect.url}")
//    private String redirectUri;
//
//    @Autowired
//    private UserService userService;
//
//    @GetMapping("/login")
//    public String login() {
//        return "index";
//    }
//
//    @GetMapping("/logout")
//    public String logout() {
//        return "index";
//    }
//
//    @GetMapping("/kakao/login")
//    public String kakaoLogin() {
//        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code";
//        return "redirect:" + kakaoAuthUrl;
//    }
//
//    @GetMapping("/kakao/callback")
//    public String kakaoCallback(@RequestParam String code) {
//        System.out.println("Authorization code: " + code);
//
//        RestTemplate restTemplate = new RestTemplate();
//        String tokenUrl = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + code;
//
//        // Access Token 요청
//        String tokenResponse = restTemplate.postForObject(tokenUrl, null, String.class);
//
//        // 사용자 정보 요청
//        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + userService.extractAccessToken(tokenResponse));
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, String.class);
//        String userInfo = userInfoResponse.getBody();
//
//        // 사용자 정보 추출 및 저장
//        UserReqDTO userDTO = userService.extractKakaoUserInfo(tokenResponse, userInfo);
//        userService.saveOrUpdateUser(userDTO);
//
//        return "index";
//    }
//}
