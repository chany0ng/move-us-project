package com.teamproject.teamthree.service;

import com.teamproject.teamthree.dto.UserReqDTO;
import com.teamproject.teamthree.dto.UserReqDTO;
import com.teamproject.teamthree.dto.UserResDTO;
import com.teamproject.teamthree.entity.UserEntity;
import com.teamproject.teamthree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // runner를 통한 사용자 등록 메서드
    public void registerUser(String userEmail, String userName, String userPhone, String plainPassword) {
        // 비밀번호 해시 처리
        String hashedPassword = passwordEncoder.encode(plainPassword);

        // 사용자 엔티티 생성
        UserEntity userEntity = new UserEntity();
        userEntity.setUserEmail(userEmail);
        userEntity.setUserName(userName);
        userEntity.setUserPw(hashedPassword);
        userEntity.setUserPhone(userPhone);

        // 데이터베이스에 사용자 저장
        userRepository.save(userEntity);
    }

    // 이메일 중복체크
    public boolean isEmailDuplicate(String email) {
        return userRepository.findByUserEmail(email).isPresent();
    }

    @Transactional
    public UserResDTO addUser(UserReqDTO userReqDTO) {
//        if(isEmailDuplicate((userReqDTO.getUserEmail()))) {
//            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
//        }
        UserEntity userEntity = modelMapper.map(userReqDTO, UserEntity.class);
        UserEntity saved = userRepository.save(userEntity);

        return modelMapper.map(saved, UserResDTO.class);
    }

    public List<UserResDTO> getUsers() {
        List<UserEntity> userEntityList = userRepository.findAll();
        return userEntityList.stream()
                .map(entity -> modelMapper.map(entity, UserResDTO.class))
                .toList();
    }


}
