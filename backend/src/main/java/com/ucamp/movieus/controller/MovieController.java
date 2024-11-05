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

    // 영화 리스트 조회
    @GetMapping("/moviesList")
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    // 영화 조회 (DB movie table)
    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable("id") Long id) {
        return movieService.getMovie(id);
    }

    // 장르 조회
    @GetMapping("/genre/{genreName}")
    public ResponseEntity<List<Movie>> getMoviesByGenre(@PathVariable String genreName) {
        System.out.println("Received request for genre: " + genreName);
        List<Movie> movies = movieService.getMoviesByGenreName(genreName);
        if (movies.isEmpty()) {
            return ResponseEntity.notFound().build(); // 영화가 없을 경우 404 반환
        }
        return ResponseEntity.ok(movies); // 영화 목록 반환
    }

    // 영화 조회 (TMDB API)
    @GetMapping("/{id}/credits")
    public ResponseEntity<Object> getMovieCredits(@PathVariable Long id) {
        Object credits = movieService.getMovieCredits(id);
        return ResponseEntity.ok(credits);
    }
}