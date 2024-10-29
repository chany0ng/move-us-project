package com.teamproject.teamthree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/movies/index", "/movies/signform", "/movies/loginform", "/movies/signup").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin((form) -> form
                        .loginPage("/movies/loginform")         // 로그인 폼 경로 설정
                        .loginProcessingUrl("/movies/login")    // 로그인 요청을 처리할 경로
                        .usernameParameter("useremail")        // 이메일 필드로 지정
                        .passwordParameter("password")         // 비밀번호 필드로 지정
                        .defaultSuccessUrl("/movies/index")     // 로그인 성공 후 이동 경로
                        .failureUrl("/movies/loginform?error=true") // 로그인 실패 시 이동 경로
                        .permitAll()
                )
                .logout((logout) -> logout
                        .logoutUrl("/movies/logout")           // 로그아웃 경로 설정
                        .logoutSuccessUrl("/movies/index")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            String userName = authentication.getName(); // 사용자 이름 가져오기
            request.getSession().setAttribute("userName", userName); // 세션에 저장
            response.sendRedirect("/movies/index"); // 로그인 성공 후 리다이렉트
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


