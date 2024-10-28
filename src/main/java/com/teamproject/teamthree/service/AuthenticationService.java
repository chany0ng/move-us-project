package com.teamproject.teamthree.service;

import com.teamproject.teamthree.entity.UserEntity;
import com.teamproject.teamthree.entity.UserEntity;
import com.teamproject.teamthree.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// 비밀번호 암호화 처리 서비스
@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean authenticate(String userName, String inputPassword) {
        Optional<UserEntity> user = userRepository.findByUserName(userName);

        if(user != null) {
            // 해시된 비밀번호와 입력된 비밀번호를 비교
            return passwordEncoder.matches(inputPassword, user.get().getUserPw());
        }
        return false;


    }
}
