package com.ucamp.movieus.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucamp.movieus.dto.UserMyPageDTO;
import com.ucamp.movieus.dto.UserReqDTO;
import com.ucamp.movieus.dto.UserResDTO;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.exception.BusinessException;
import com.ucamp.movieus.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
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
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Runner를 통한 사용자 등록 메서드
    public void registerUser(String userEmail, String userName, String userPhone, String plainPassword) {
        String hashedPassword = passwordEncoder.encode(plainPassword);

        UserEntity userEntity = new UserEntity();
        userEntity.setUserEmail(userEmail);
        userEntity.setUserName(userName);
        userEntity.setUserPw(hashedPassword);
        userEntity.setUserPhone(userPhone);

        userRepository.save(userEntity);
    }

    // 이메일 중복 체크 메서드
    public boolean isEmailDuplicate(String email) {
        return userRepository.findByUserEmail(email).isPresent();
    }

    // 사용자 추가 메서드
    @Transactional
    public UserResDTO addUser(UserReqDTO userReqDTO) {
        if (isEmailDuplicate(userReqDTO.getUserEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encryptedPassword = passwordEncoder.encode(userReqDTO.getUserPw());

        UserEntity userEntity = modelMapper.map(userReqDTO, UserEntity.class);
        userEntity.setUserPw(encryptedPassword);
        userEntity.setRole("USER");

        UserEntity saved = userRepository.save(userEntity);

        return modelMapper.map(saved, UserResDTO.class);
    }

    // 사용자 목록 조회 메서드
    public List<UserResDTO> getUsers() {
        List<UserEntity> userEntityList = userRepository.findAll();
        return userEntityList.stream()
                .map(entity -> modelMapper.map(entity, UserResDTO.class))
                .toList();
    }

    public UserEntity saveOrUpdateUser(UserReqDTO userDTO) {
        UserEntity user = userRepository.findByKakaoEmail(userDTO.getKakaoEmail())
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setUserName(userDTO.getUserName());
                    newUser.setKakaoEmail(userDTO.getKakaoEmail());
                    newUser.setUserPhone(userDTO.getUserPhone());
                    return newUser;
                });

// 업데이트 로직
        user.setUserName(userDTO.getUserName());
        user.setUserPhone(userDTO.getUserPhone());

        return userRepository.save(user);

    }

    // 카카오 로그인 사용자 정보 추출 메서드
    public UserReqDTO extractKakaoUserInfo(String tokenResponse, String userInfoResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode tokenNode = objectMapper.readTree(tokenResponse);
            String accessToken = tokenNode.get("access_token").asText();

            JsonNode userNode = objectMapper.readTree(userInfoResponse);
            String email = userNode.get("kakao_account").get("email").asText();
            String name = userNode.get("kakao_account").get("profile").get("nickname").asText();

            String phoneNumber = userNode.get("kakao_account").get("phone_number").asText();
            if (phoneNumber != null) {
                phoneNumber = phoneNumber.replace("+82", "0").replaceAll("[^0-9]", "");
                if (phoneNumber.length() == 11) {
                    phoneNumber = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 7) + "-" + phoneNumber.substring(7);
                } else if (phoneNumber.length() == 10) {
                    phoneNumber = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6);
                }
            }

            return new UserReqDTO(email, null, null, name, phoneNumber);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Access token 추출 메서드
    public String extractAccessToken(String tokenResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(tokenResponse);
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /////
    public Boolean checkEmailDuplication(String email) {
        return userRepository.getByUserEmail(email).isPresent();
    }

    public void passwordReset(String email, String newPassword) {
        UserEntity user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        user.setUserPw(newPassword); // 비밀번호 업데이트
    }

    public UserResDTO getUser(String email){
        return userRepository.findByUserEmail(email)
                .map(user -> modelMapper.map(user, UserResDTO.class)).orElseThrow(
                        () -> new BusinessException("User not Found", HttpStatus.NOT_FOUND)
                );
    }
     //재하 추가 코드 (회원정보 조회)
    public UserMyPageDTO getUserMyPage(String userEmail) {
    UserEntity user = userRepository.findByUserEmail(userEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    UserMyPageDTO dto = new UserMyPageDTO();
    modelMapper.map(user, dto);
    return dto;
}

    //재하 추가 코드 (회원정보 수정)
    public UserMyPageDTO updateUserInfo(String userEmail, UserMyPageDTO updateDto) {
        UserEntity user = userRepository.findByUserEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        modelMapper.map(updateDto, user);
        UserEntity savedUser = userRepository.save(user);
        
        return modelMapper.map(savedUser, UserMyPageDTO.class);
    }

    //재하 추가 코드 (회원정보 조회) - userNum 버전
    public UserMyPageDTO getUserMyPageByNum(Integer userNum) {
        UserEntity user = userRepository.findById(userNum)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserMyPageDTO dto = new UserMyPageDTO();
        modelMapper.map(user, dto);
        return dto;
    }

    //재하 추가 코드 (회원정보 수정) - userNum 버전
    public UserMyPageDTO updateUserInfoByNum(Integer userNum, UserMyPageDTO updateDto) {
        UserEntity user = userRepository.findById(userNum)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        modelMapper.map(updateDto, user);
        UserEntity savedUser = userRepository.save(user);
        
        return modelMapper.map(savedUser, UserMyPageDTO.class);
    }
}
