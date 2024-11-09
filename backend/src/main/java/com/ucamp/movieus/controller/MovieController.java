package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.DailyBoxOfficeDTO;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Object credits = movieService.getMovieDetail(id);
        return ResponseEntity.ok(credits);
    }

    // TMDB API의 인기 영화 목록에 DB 존재 여부 표시 page1
    @GetMapping("/popularMovies")
    public ResponseEntity<List<Map<String, Object>>> getPopularMovies() {
        List<Map<String, Object>> moviesWithDbInfo = movieService.getPopularMovies();
        return ResponseEntity.ok(moviesWithDbInfo);
    }

    // TMDB API의 인기 영화 목록에 DB 존재 여부 표시 page1~page5
    @GetMapping("/allPopularMovies")
    public ResponseEntity<List<Map<String, Object>>> getAllPopularMovies() {
        List<Map<String, Object>> moviesWithDbInfo = movieService.getAllPopularMovies();
        return ResponseEntity.ok(moviesWithDbInfo);
    }

    // TMDB API의 영화 상세 페이지 (TMDB API - TMDB id)
    @GetMapping("/{id}/getMovieDetail")
    public ResponseEntity<Object> getMovieDetail(@PathVariable Long id) {
        Object detail = movieService.getMovieDetail(id);
        return ResponseEntity.ok(detail);
    }

    // TMDB API의 인기 영화 목록 장르별 조회
    @GetMapping("/popular/genre/{genreName}")
    public ResponseEntity<List<Map<String, Object>>> getPopularMoviesByGenre(
            @PathVariable("genreName") String genreName) {
        List<Map<String, Object>> moviesWithGenre = movieService.getPopularMoviesByGenre(genreName);
        return ResponseEntity.ok(moviesWithGenre);
    }


    // 특정 영화 상세정보 정보 조회
    @GetMapping("/{tmdbId}")
    public ResponseEntity<Movie> getMovieByTmdbId(@PathVariable Long tmdbId) {
        return movieRepository.findByTmdbId(tmdbId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Movie not found with TMDB ID: " + tmdbId));
    }



    //boxoffice
    @GetMapping("/boxoffice")
    public ResponseEntity<List<DailyBoxOfficeDTO>> getDailyBoxOffice() {
        List<DailyBoxOfficeDTO> boxOfficeData = movieService.getAllOrderedByRankAsDTO();
        return ResponseEntity.ok(boxOfficeData);
    }
}