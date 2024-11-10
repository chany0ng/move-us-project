// ScreeningService.java
package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.ScreeningTimeDTO;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ScreeningSchedule;
import com.ucamp.movieus.entity.Theater;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.ScreeningScheduleRepository;
import com.ucamp.movieus.repository.ScreeningTimeRepository;
import com.ucamp.movieus.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreeningService {
    private final ScreeningScheduleRepository scheduleRepository;
    private final ScreeningTimeRepository timeRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

//    public List<ScreeningTimeDTO> getScreeningTimes(Long movieId, int theaterId, LocalDate screeningDate) {
//        Movie movie = movieRepository.findById(movieId)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid movie ID"));
//        Theater theater = theaterRepository.findById(theaterId)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid theater ID"));
//
//        ScreeningSchedule schedule = scheduleRepository.findByMovieAndTheaterAndScreeningDate(movie, theater, screeningDate)
//                .orElse(null);
//
//        if (schedule == null) {
//            return Collections.emptyList();
//        }
//
//        return timeRepository.findByScreeningSchedule(schedule).stream()
//                .map(time -> new ScreeningTimeDTO(time.getTimeId(), time.getScreeningTime(), time.getReservedSeats()))
//                .collect(Collectors.toList());
//    }
public List<ScreeningTimeDTO> getScreeningTimes(Long movieId, String theaterName, LocalDate screeningDate) {
    Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid movie ID"));

    // theaterName을 사용하여 theaterId를 조회
    Theater theater = theaterRepository.findByTheaterName(theaterName)
            .orElseThrow(() -> new IllegalArgumentException("Invalid theater name"));

    ScreeningSchedule schedule = scheduleRepository.findByMovieAndTheaterAndScreeningDate(movie, theater, screeningDate)
            .orElse(null);

    if (schedule == null) {
        return Collections.emptyList();
    }

    return timeRepository.findByScreeningSchedule(schedule).stream()
            .map(time -> new ScreeningTimeDTO(time.getTimeId(), time.getScreeningTime(), time.getReservedSeats()))
            .collect(Collectors.toList());
}
}
