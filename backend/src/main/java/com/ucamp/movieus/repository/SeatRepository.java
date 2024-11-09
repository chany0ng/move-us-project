package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.ScreeningTime;
import com.ucamp.movieus.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByScreeningTime(ScreeningTime time);
}