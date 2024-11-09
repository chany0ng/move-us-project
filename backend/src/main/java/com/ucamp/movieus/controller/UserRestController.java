package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.UserLoginDto;
import com.ucamp.movieus.dto.UserMyPageDTO;
import com.ucamp.movieus.dto.UserReqDTO;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.security.JwtTokenProvider;
import com.ucamp.movieus.service.MailService;
import com.ucamp.movieus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movies")
//@CrossOrigin(origins = "http://localhost:3000")
public class UserRestController {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final MailService mailService;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/index")
    public ResponseEntity<Map<String, String>> index() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, String> response = new HashMap<>();
        response.put("userName", userName);
        return ResponseEntity.ok(response); // userName을 JSON 응답으로 반환
    }

    // JWT를 사용한 로그인 요청 처리
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginDto userLoginDto) {
        System.out.println(userLoginDto.getUserPw());

        // 사용자 인증 후 JWT 토큰 생성
        String jwtToken = userService.authenticateUser(userLoginDto);

        // JWT에서 사용자 정보 추출
        String email = jwtTokenProvider.getEmailFromJWT(jwtToken); // JWT에서 이메일 추출
        String name = jwtTokenProvider.getNameFromJWT(jwtToken); // JWT에서 이름 추출

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("email", email); // 이메일 추가
        response.put("name", name); // 이름 추가
        response.put("message", "로그인 성공");
        return ResponseEntity.ok(response); // JWT 토큰과 메시지 반환
    }


    // 카카오 소셜 로그인 처리
    @PostMapping("/social-login")
    public ResponseEntity<Map<String, String>> handleSocialLogin(@RequestBody Map<String, String> loginRequest) {
        String kakaoEmail = loginRequest.get("kakaoEmail");
        String userName = loginRequest.get("userName");

        // 소셜 로그인 처리
        UserEntity user = userService.handleSocialLogin(kakaoEmail, userName);

        // JWT 토큰 생성
        String jwtToken = jwtTokenProvider.createToken(user.getUserEmail(), user.getUserName());

        // 응답 JSON 구성
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("email", user.getUserEmail());
        response.put("name", user.getUserName());
        response.put("message", "소셜 로그인 성공");

        return ResponseEntity.ok(response); // JWT 토큰과 사용자 정보 반환
    }

    // 회원가입 요청 처리
    @PostMapping("/signup")
    public ResponseEntity<String> addUser(@Valid @RequestBody UserReqDTO userReqDTO) {
        System.out.println(userReqDTO);
        userService.addUser(userReqDTO);
        return ResponseEntity.ok("회원가입이 완료되었습니다. 로그인 해주세요."); // 성공 메시지 반환
    }

    // 이메일 중복 확인
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailDuplication(@PathVariable String email) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isDuplicated = userService.isEmailDuplicate(email);
        response.put("isDuplicated", isDuplicated);
        return ResponseEntity.ok(response); // 중복 여부 반환
    }

    // 마이페이지 - 인증된 사용자 정보 확인
    @GetMapping("/mypage")
    public ResponseEntity<Map<String, String>> myPage(Authentication authentication) {
        Map<String, String> response = new HashMap<>();
        response.put("userName", authentication.getName());
        return ResponseEntity.ok(response);
    }

    // 비밀번호 재설정 이메일 전송
    @GetMapping("/send-reset-email/{email}")
    public ResponseEntity<String> sendPasswordResetEmail(@PathVariable String email) {
        String resetUrl = "http://localhost:3000/change-pw/" + email; // 비밀번호 재설정 URL

        try {
            mailService.sendPasswordResetMail(email, resetUrl);
            return ResponseEntity.ok("비밀번호 재설정 이메일이 전송되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송에 실패했습니다."); // 500
        }
    }

    // 비밀번호 재설정 처리
    @PostMapping("/passwordReset")
    public ResponseEntity<String> passwordReset(@RequestBody UserLoginDto userLoginDto) {
        System.out.println("Resetting password for email: " + userLoginDto.getUserEmail());
        userService.passwordReset(userLoginDto.getUserEmail(), userLoginDto.getUserPw());
        return ResponseEntity.ok("비밀번호가 성공적으로 재설정되었습니다.");
    }


    // 로그인 요청 처리
//    @GetMapping("/login")
//    public ResponseEntity<String> login() {
//        return ResponseEntity.ok("로그인 페이지"); // 로그인 페이지 접근 가능 메시지
//    }
//

//    @PostMapping("/login")
//    public String login(@RequestBody UserLoginDto userLoginDto, Model model) {
//        System.out.println(userLoginDto.getUserPw());
//        // 로그인 처리 로직
//        return ("성공"); // 로그인 후 리다이렉트할 페이지
//    }


//    // 로그인 폼
//    @GetMapping("/loginform")
//    public ResponseEntity<Map<String, String>> loginForm(@RequestParam(value = "error", required = false) String error,
//                                                         @RequestParam(value = "signupSuccess", required = false) String signupSuccess) {
//        Map<String, String> response = new HashMap<>();
//
//        if (error != null) {
//            response.put("loginError", "아이디 또는 비밀번호가 잘못되었습니다.");
//        }
//
//        // 회원가입 성공 메시지 확인
//        if (signupSuccess != null) {
//            response.put("signupSuccess", signupSuccess);
//        }
//
//        response.put("userName", SecurityContextHolder.getContext().getAuthentication().getName());
//
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/signform")
//    public ResponseEntity<UserReqFormDTO> signUpForm() {
//        return ResponseEntity.ok(new UserReqFormDTO()); // 빈 UserReqFormDTO를 반환
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<String> addUser(@Valid @RequestBody UserReqDTO userReqDTO) {
//        System.out.println(userReqDTO);
//        userService.addUser(userReqDTO);
//        return ResponseEntity.ok("회원가입이 완료되었습니다. 로그인 해주세요."); // 성공 메시지 반환
//    }
//
//    @GetMapping("/mypage")
//    public ResponseEntity<Map<String, String>> myPage(Authentication authentication) {
//        Map<String, String> response = new HashMap<>();
//        response.put("userName", authentication.getName());
//        return ResponseEntity.ok(response);
//    }
//
//    //////
//    @GetMapping("/check-email/{email}")
//    @ResponseBody
//    public ResponseEntity<Map<String, Boolean>> checkEmailDuplication(@PathVariable String email) {
//        Map<String, Boolean> response = new HashMap<>();
//        System.out.println("Email 요청: " + email);
//        boolean isDuplicated = userService.checkEmailDuplication(email);
//        response.put("isDuplicated", isDuplicated);
//
////        String resetUrl = "http://localhost:3000/change-pw";
//        String resetUrl = "http://localhost:3000/change-pw/" + email; // 비밀번호 재설정 URL
//        if(isDuplicated){
//            try {
//                mailService.sendPasswordResetMail(email, resetUrl);
//                return ResponseEntity.ok(response);
//            } catch (Exception e) {
//                e.printStackTrace();
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
//            }
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); //404
//    }
//
//    @PostMapping("/passwordReset")
//    public String passwordReset(@RequestBody UserLoginDto userLoginDto) {
//        System.out.println("Resetting password for email: " + userLoginDto.getUserEmail()); // 디버깅 로그
//        userService.passwordReset(userLoginDto.getUserEmail(), userLoginDto.getUserPw());
//        return ("성공");
//    }

//    @PostMapping("/login")
//    public ResponseEntity<UserEntity> login(@RequestBody UserLoginDto userLoginDto) {
//        System.out.println(userLoginDto.getUserPw());
//
//        // 로그인 처리 로직
//        UserEntity user = new UserEntity();
//        UserResDTO userResDTO = userService.getUser(userLoginDto.getUserEmail());
//        user.setUserName(userResDTO.getUserName());
//        user.setUserEmail(userResDTO.getUserEmail());
//        return ResponseEntity.ok(user);
//        // 실제 로직에서는 userLoginDto를 통해 사용자 정보를 DB에서 조회하고,
//        // 해당 사용자 정보를 UserEntity에 담아 반환해야 합니다.
//
//        // 예시로 기본적인 유저 정보를 설정
////        user.setEmail("john.doe@example.com");
//        // 성공 시 UserEntity JSON 반환
//    }

        //재하 추가 코드 (회원정보 조회)
        @GetMapping("/mypage/{userEmail}")
        public ResponseEntity<UserMyPageDTO> myPage(@PathVariable String userEmail) {
            UserMyPageDTO userInfo = userService.getUserMyPage(userEmail);
        return ResponseEntity.ok(userInfo);
    }

        //재하 추가 코드 (회원정보 수정)
        @PutMapping("/mypage/{userEmail}")
        public ResponseEntity<UserMyPageDTO> updateUserInfo(
            @PathVariable String userEmail,
            @RequestBody UserMyPageDTO updateDto
        ) {
            UserMyPageDTO updatedUser = userService.updateUserInfo(userEmail, updateDto);
            return ResponseEntity.ok(updatedUser);
        }

}
