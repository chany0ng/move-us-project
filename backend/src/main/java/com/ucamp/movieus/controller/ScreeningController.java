// ScreeningController.java
package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.ScreeningTimeDTO;
import com.ucamp.movieus.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/screenings")
@RequiredArgsConstructor
public class ScreeningController {
    private final ScreeningService screeningService;

    @GetMapping("/times")
    public ResponseEntity<List<ScreeningTimeDTO>> getScreeningTimes(
            @RequestParam Long movieId,
            @RequestParam int theaterId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate screeningDate) {

        List<ScreeningTimeDTO> times = screeningService.getScreeningTimes(movieId,theaterId,screeningDate);
        return ResponseEntity.ok(times);
    }
}
