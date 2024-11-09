package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Long> {
    // 필요한 경우 추가 쿼리 메소드 작성
}