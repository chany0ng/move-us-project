package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.UserReqDTO;
import com.ucamp.movieus.service.UserService;
import com.ucamp.movieus.dto.UserReqDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class KakaoRestController {

    @Value("${kakao.client.id}")
    private String clientId;

    @Value("${kakao.redirect.url}")
    private String redirectUri;

    @Autowired
    private UserService userService;

    @GetMapping("/login") // 로그인 프로세스를 시작하는 엔드포인트
    public ResponseEntity<String> login() {
        return ResponseEntity.ok("로그인 엔드포인트에 접근했습니다. /kakao/login을 사용하여 카카오 인증을 시작하세요.");
    }

    @GetMapping("/logout") // 로그인 프로세스를 시작하는 엔드포인트
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("로그아웃 엔드포인트에 접근했습니다.");
    }

    @GetMapping("/kakao/login") // 카카오 로그인으로 리디렉션
    public ResponseEntity<String> kakaoLogin() {
        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code";
        return ResponseEntity.status(302).location(URI.create(kakaoAuthUrl)).build(); // 카카오 인증 URL로 리디렉션
    }

//    @GetMapping("/kakao/callback") // 인증 후 호출되는 콜백 엔드포인트
//    public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
//        System.out.println("Authorization code: " + code);
//
//        RestTemplate restTemplate = new RestTemplate();
//        String tokenUrl = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + code;
//
//        // 액세스 토큰 요청
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
//        return ResponseEntity.ok(userDTO); // 사용자 정보를 JSON 응답으로 반환
//    }
    //기존 카카오
@GetMapping("/kakao/callback")
public RedirectView kakaoCallback(@RequestParam String code) {
    System.out.println("Authorization code: " + code);

    RestTemplate restTemplate = new RestTemplate();
    String tokenUrl = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + code;

    // 액세스 토큰 요청
    String tokenResponse = restTemplate.postForObject(tokenUrl, null, String.class);

    // 사용자 정보 요청
    String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + userService.extractAccessToken(tokenResponse));
    HttpEntity<String> entity = new HttpEntity<>(headers);

    ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, String.class);
    String userInfo = userInfoResponse.getBody();

    // 사용자 정보 추출 및 저장
    UserReqDTO userDTO = userService.extractKakaoUserInfo(tokenResponse, userInfo);
    userService.saveOrUpdateUser(userDTO);

    // 로그인 후 React 앱의 특정 URL로 리다이렉션
    RedirectView redirectView = new RedirectView();
    redirectView.setUrl("http://localhost:3000/main"); // 리액트 URL로 리다이렉션
    return redirectView;
}




}
