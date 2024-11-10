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

    // 영화 리스트 조회 (장르 필터링 포함)
    @GetMapping("/moviesList")
    public ResponseEntity<List<Movie>> getMovies(@RequestParam(required = false) String genre, @RequestParam(required = false) String sort) {
        List<Movie> movies;
        if ("All".equals(genre) || genre == null) {
            // 필터 없이 전체 목록 조회
            movies = movieRepository.findAll();
        }
        else {
            // 장르 필터링
            movies = movieService.getMoviesByGenreName(genre);
        }

        if (movies.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movies);
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


    // TMDB API의 영화 상세 페이지 (TMDB API - TMDB id)
    @GetMapping("/{id}/getMovieDetail")
    public ResponseEntity<Object> getMovieDetail(@PathVariable Long id) {
        Object detail = movieService.getMovieDetail(id);
        return ResponseEntity.ok(detail);
    }

    // TMDB 인기영화 목록 장르별/정렬별 조회(DB존재여부 표시, page 1~5)
    @GetMapping("/allPopularMovies")
    public ResponseEntity<List<Map<String, Object>>> getAllPopularMovies(@RequestParam(required = false) String genre, @RequestParam(required = false) String sort) {
        List<Map<String, Object>> movies;
        if("All".equals(genre) || genre == null) {
            movies = movieService.getAllPopularMovies();
        }
        else{
            // 장르별로 page 1~5 넘겨주기
            movies = movieService.getPopularMoviesByGenre(genre);
        }
        if(movies.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movies);
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