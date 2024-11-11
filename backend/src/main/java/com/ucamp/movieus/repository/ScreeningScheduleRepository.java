package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ScreeningSchedule;
import com.ucamp.movieus.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface ScreeningScheduleRepository extends JpaRepository<ScreeningSchedule, Long> {
    Optional<ScreeningSchedule> findByMovieAndTheaterAndScreeningDate(Movie movie, Theater theater, LocalDate screeningDate);
}