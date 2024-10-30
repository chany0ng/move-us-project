package com.ucamp.movieus.controller;//package com.teamproject.teamthree.controller;
//
//import com.teamproject.teamthree.dto.UserReqDTO;
//import com.teamproject.teamthree.dto.UserReqFormDTO;
////import com.teamproject.teamthree.service.UserDetailsService;
//import com.teamproject.teamthree.service.UserService;
//import jakarta.servlet.http.HttpSession;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//
//@Controller
//@RequiredArgsConstructor
//@RequestMapping("/movies")
//public class UserController {
//    private final UserService userService;
//    private final UserDetailsService userDetailsService;
//
//    @Autowired
//    private ModelMapper modelMapper;
//
////    @GetMapping("/index")
////    public String index() {
////        return "index";
////    }
//
////    @GetMapping("/index")
////    public String index(Model model, Authentication authentication) {
////        if (authentication != null && authentication.isAuthenticated()) {
////            // 로그인된 사용자의 이름 가져오기
////            String userName = authentication.getName(); // userName을 UserDetails에서 가져올 수 있습니다.
////
////            // 모델에 사용자 정보 추가
////            model.addAttribute("userName", userName);
////        }
////        return "index"; // Thymeleaf 템플릿 이름
////    }
//
//    @GetMapping("/index")
//    public String index(Model model, HttpSession session) {
//        String userName = (String) session.getAttribute("userName");
//        model.addAttribute("userName", userName); // 모델에 추가
//        return "index"; // 뷰 이름
//    }
//
//
//
//    // 로그인 요청 처리
//    @GetMapping("/login")
//    public String login() {
//        return "login"; // 로그인 페이지의 HTML 파일 이름
//    }
//
//    // 로그인 폼
//    @GetMapping("/loginform")
//    public String loginForm(@RequestParam(value = "error", required = false) String error,
//                            @RequestParam(value = "signupSuccess", required = false) String signupSuccess,
//                            Model model,
//                            @ModelAttribute("user") UserReqFormDTO userReqFormDTO) {
//
//
//        if (error != null) {
//            model.addAttribute("loginError", "아이디 또는 비밀번호가 잘못되었습니다.");
//        }
//
//        // 회원가입 성공 메시지 확인
//        if (signupSuccess != null) {
//            model.addAttribute("signupSuccess", signupSuccess);
//        }
//
//        model.addAttribute("userName", SecurityContextHolder.getContext().getAuthentication().getName());
//
//        return "/login";
//    }
//
//
//    @GetMapping("/signform")
//    public String signUpForm(Model model
//                            , @ModelAttribute("user") UserReqFormDTO userReqFormDTO) {
//        model.addAttribute("user", userReqFormDTO);
//         // User 클래스는 폼 데이터를 위한 DTO나 엔티티
//        return "sign-up";
//    }
//
//
//
//    @PostMapping("/signup")
//    public String addUser(@Valid @ModelAttribute("user") UserReqDTO userReqDTO
//                                                , BindingResult result
//                                                , RedirectAttributes redirectAttributes) {
//        // 필드 검증
//        if (result.hasErrors()) {
//            return "sign-up";
//        }
//
//        // 사용자 등록
//        userService.addUser(userReqDTO);
//
//        // 성공 메시지 추가
//        redirectAttributes.addFlashAttribute("signupSuccess", "회원가입이 완료되었습니다. 로그인 해주세요.");
//
//        return "redirect:/movies/login";  // 회원가입 후 로그인 폼으로 리다이렉트
//    }
//
//
//    @GetMapping("/mypage")
//    public String myPage(Model model, Authentication authentication) {
//        // 현재 로그인된 사용자 정보 추가
//        model.addAttribute("userName", authentication.getName());
//        return "mypage";
//    }
//
//
//
//
//
//}
