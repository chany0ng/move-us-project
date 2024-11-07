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
import java.util.Map;

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

    // 영화 Credits 조회 (TMDB API - TMDB id)
    @GetMapping("/{id}/credits")
    public ResponseEntity<Object> getMovieCredits(@PathVariable Long id) {
        Object credits = movieService.getMovieCredits(id);
        return ResponseEntity.ok(credits);
    }

    // 영화 Runtime 조회 (TMDB API - TMDB id)
    @GetMapping("/{id}/runtime")
    public ResponseEntity<Object> getMovieRuntime(@PathVariable Long id) {
        Object credits = movieService.getMovieRuntime(id);
        return ResponseEntity.ok(credits);
    }

    // TMDB API의 인기 영화 목록에 DB 존재 여부 표시
    @GetMapping("/AllPopularMovies")
    public ResponseEntity<List<Map<String, Object>>> getAllPopularMovies() {
        List<Map<String, Object>> moviesWithDbInfo = movieService.getAllPopularMovies();
        return ResponseEntity.ok(moviesWithDbInfo);
    }
}