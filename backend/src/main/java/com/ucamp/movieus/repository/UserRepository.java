package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUserName(String userName);
    Optional<UserEntity> findByUserEmail(String userEmail);
    Optional<UserEntity> findByKakaoEmail(String kakaoEmail);
    Optional<UserEntity> findByUserNum(Integer userNum);


    boolean existsByUserEmail(String userEmail); // 중복된 이메일 확인
    boolean existsByKakaoEmail(String kakaoEmail); // 카카오 로그인 이메일 중복 확인

}
