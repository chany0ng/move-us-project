package com.ucamp.movieus.controller;

import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {

    private final MovieService movieService;
    private final MovieRepository movieRepository;

    // API 호출하여 영화 정보 저장
    @GetMapping("/fetch")
    public String fetchAndSaveMovies() {
        movieService.fetchAndSaveNowPlayingMovies();
        return "Movies fetched and saved!";
    }

    // 저장된 영화 리스트 반환
    @GetMapping("/moviesList")
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }
    // 특정 영화 상세정보 정보 조회
    @GetMapping("/{tmdbId}")
    public ResponseEntity<Movie> getMovieByTmdbId(@PathVariable Long tmdbId) {
        return movieRepository.findByTmdbId(tmdbId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Movie not found with TMDB ID: " + tmdbId));
    }
}
