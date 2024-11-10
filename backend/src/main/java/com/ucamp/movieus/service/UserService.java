package com.ucamp.movieus.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucamp.movieus.dto.UserLoginDto;
import com.ucamp.movieus.dto.UserMyPageDTO;
import com.ucamp.movieus.dto.UserReqDTO;
import com.ucamp.movieus.dto.UserResDTO;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.exception.BusinessException;
import com.ucamp.movieus.repository.UserRepository;
import com.ucamp.movieus.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 회원 가입 메서드
    public UserResDTO addUser(UserReqDTO userReqDTO) {
        // 이미 가입된 사용자인지 확인 (이메일 기준)
        if (isEmailDuplicate(userReqDTO.getUserEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 신규 사용자 생성
        String encryptedPassword = passwordEncoder.encode(userReqDTO.getUserPw());
        UserEntity userEntity = modelMapper.map(userReqDTO, UserEntity.class);
        userEntity.setUserPw(encryptedPassword);
        userEntity.setRole("USER");

        // 사용자 저장
        UserEntity saved = userRepository.save(userEntity);
        return modelMapper.map(saved, UserResDTO.class);
    }

    //kakao 사용자 생성 메서드
    public UserEntity createUser(String kakaoEmail, String userName) {
        UserEntity userEntity = new UserEntity();
        userEntity.setKakaoEmail(kakaoEmail);
        userEntity.setUserName(userName);
//        userEntity.setUserEmail(kakaoEmail); // 카카오 이메일을 사용자 이메일로 설정
        userEntity.setRole("USER"); // 기본 역할 설정
        userEntity.setUserPw(null); // 비밀번호는 소셜 로그인 사용자의 경우 null로 설정
        userEntity.setUserPhone(null); // 전화번호는 입력받지 않으면 null로 설정

        return userRepository.save(userEntity); // 사용자 저장
    }


    // 이메일 중복 체크 메서드
    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByUserEmail(email); // userEmail 필드로 중복 확인
    }


    public UserEntity handleSocialLogin(String userEmail, String userName) {
        // 이메일 중복 체크 (이메일로 기존 사용자 확인)
        Optional<UserEntity> existingUser = userRepository.findByUserEmail(userEmail);

        if (existingUser.isPresent()) {
            // 기존 사용자가 있을 경우 해당 사용자 반환
            return existingUser.get();
        } else {
            // 기존 사용자가 없을 경우 새 사용자 생성
            UserEntity newUser = createUser(userEmail, userName);
            return newUser;
        }
    }

    // UserService 클래스에 추가
    public String authenticateUser(UserLoginDto userLoginDto) {
        UserEntity user = userRepository.findByUserEmail(userLoginDto.getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (passwordEncoder.matches(userLoginDto.getUserPw(), user.getUserPw())) {
            // userNum을 포함하여 토큰 생성
            return jwtTokenProvider.createToken(user.getUserEmail(), user.getUserName(), user.getUserNum());
        } else {
            throw new BadCredentialsException("Invalid password");
        }
    }



    // 사용자 목록 조회 메서드
    public List<UserResDTO> getUsers() {
        List<UserEntity> userEntityList = userRepository.findAll();
        return userEntityList.stream()
                .map(entity -> modelMapper.map(entity, UserResDTO.class))
                .toList();
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


    // 비밀번호 재설정 메서드
    public void passwordReset(String email, String newPassword) {
        UserEntity user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        user.setUserPw(passwordEncoder.encode(newPassword)); // 암호화된 비밀번호로 업데이트
    }

    // 사용자 정보 조회 메서드
    public UserResDTO getUser(String email){
        return userRepository.findByUserEmail(email)
                .map(user -> modelMapper.map(user, UserResDTO.class))
                .orElseThrow(() -> new BusinessException("User not Found", HttpStatus.NOT_FOUND));
    }

    // 사용자 저장 또는 업데이트 메서드 (카카오 연동 사용자의 경우)
    public UserEntity saveOrUpdateUser(UserReqDTO userDTO) {
        UserEntity user = userRepository.findByKakaoEmail(userDTO.getKakaoEmail())
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setUserName(userDTO.getUserName());
                    newUser.setKakaoEmail(userDTO.getKakaoEmail());
                    newUser.setUserPhone(userDTO.getUserPhone());
                    return newUser;
                });

        user.setUserName(userDTO.getUserName());
        user.setUserPhone(userDTO.getUserPhone());

        return userRepository.save(user);
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
}
