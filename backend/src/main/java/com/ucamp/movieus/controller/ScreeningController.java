// ScreeningController.java
package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.ScreeningTimeDTO;
import com.ucamp.movieus.entity.ScreeningTime;
import com.ucamp.movieus.repository.ScreeningTimeRepository;
import com.ucamp.movieus.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/screenings")
@RequiredArgsConstructor
public class ScreeningController {
    private final ScreeningService screeningService;
    private final ScreeningTimeRepository screeningTimeRepository;

    //    @GetMapping("/times")
//    public ResponseEntity<List<ScreeningTimeDTO>> getScreeningTimes(
//            @RequestParam Long movieId,
//            @RequestParam int theaterId,
//            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate screeningDate) {
//
//        List<ScreeningTimeDTO> times = screeningService.getScreeningTimes(movieId,theaterId,screeningDate);
//        return ResponseEntity.ok(times);
//    }
    @GetMapping("/times")
    public ResponseEntity<List<ScreeningTimeDTO>> getScreeningTimes(
            @RequestParam Long movieId,
            @RequestParam String theaterName,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate screeningDate) {

        List<ScreeningTimeDTO> times = screeningService.getScreeningTimes(movieId, theaterName, screeningDate);
        return ResponseEntity.ok(times);
    }

    // 특정 time_id에 대한 reserved_seats 값을 반환하는 엔드포인트
    @GetMapping("/{timeId}/reserved-seats")
    public ResponseEntity<?> getReservedSeats(@PathVariable Long timeId) {
        // timeId로 ScreeningTime 조회
        ScreeningTime screeningTime = screeningTimeRepository.findById(timeId).orElse(null);

        if (screeningTime == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "ScreeningTime not found for timeId: " + timeId));
        }

        // reservedSeats 값 반환
        return ResponseEntity.ok(Map.of("timeId", timeId, "reservedSeats", screeningTime.getReservedSeats()));
    }
}
