package com.ucamp.movieus.security;

import com.ucamp.movieus.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    private final UserEntity user;

    public UserPrincipal(UserEntity user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 역할을 GrantedAuthority로 변환하여 반환
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getUserPw(); // 비밀번호 필드 반환
    }

    @Override
    public String getUsername() {
        return user.getUserEmail(); // 이메일 필드 반환
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 필요에 따라 조정
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 필요에 따라 조정
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 필요에 따라 조정
    }

    @Override
    public boolean isEnabled() {
        return true; // 사용자의 활성화 여부 판단
    }

    public int getId() {
        return user.getUserNum(); // UserEntity의 ID 반환
    }

    public int getUserNum() {
        return user.getUserNum(); // UserEntity의 사용자 번호 반환
    }

    public String getKakaoEmail() {
        return user.getKakaoEmail(); // 카카오 이메일 반환
    }

    public String getUserName() {
        return user.getUserName(); // 사용자 이름 반환
    }

    public String getUserPhone() {
        return user.getUserPhone(); // 사용자 전화번호 반환
    }

    public LocalDateTime getCreateDt() {
        return user.getCreateDt(); // 생성일 반환
    }

    public LocalDateTime getUpdateDt() {
        return user.getUpdateDt(); // 수정일 반환
    }

    public String getEmail() {
        return user.getUserEmail(); // 사용자 이메일 반환
    }
}
