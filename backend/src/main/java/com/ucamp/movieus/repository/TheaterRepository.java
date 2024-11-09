package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.District;
import com.ucamp.movieus.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheaterRepository extends JpaRepository<Theater, Integer> {
    List<Theater> findByDistrict(District district);
}