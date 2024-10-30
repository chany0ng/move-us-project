//package com.teamproject.teamthree.runner;
//
//import com.teamproject.teamthree.service.AuthenticationService;
//import com.teamproject.teamthree.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class AppRunner implements CommandLineRunner {
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private AuthenticationService authenticationService;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // 사용자 등록
//        userService.registerUser("test03@example.com","test03", "010-1234-5678","1234");
//
//        // 비밀번호 검증
//        boolean isAuthenticated = authenticationService.authenticate("test03", "1234");
//        System.out.println("인증 성공 여부: " + isAuthenticated);
//    }
//}
