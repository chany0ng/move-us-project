package com.teamproject.teamthree.repository;

import com.teamproject.teamthree.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUserName(String userName);
    Optional<UserEntity> findByUserEmail(String userEmail);
    Optional<UserEntity> findByKakaoEmail(String kakaoEmail);
}
