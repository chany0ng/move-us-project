package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.District;
import com.ucamp.movieus.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TheaterRepository extends JpaRepository<Theater, Integer> {
    List<Theater> findByDistrict(District district);
    Optional<Theater> findByTheaterName(String theaterName);
}