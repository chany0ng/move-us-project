package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.ScreeningSchedule;
import com.ucamp.movieus.entity.ScreeningTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScreeningTimeRepository extends JpaRepository<ScreeningTime, Long> {
    List<ScreeningTime> findByScreeningSchedule(ScreeningSchedule schedule);
}