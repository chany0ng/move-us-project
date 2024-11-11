package com.ucamp.movieus.controller;

import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public List<Movie> getRankedMovies() {
        return movieRepository.findAllByOrderByRankingAsc();
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

    // 영화 제목으로 검색
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchMovies(@RequestParam String query) {
        try {
            // 클라이언트로부터 받은 검색어로 영화 목록 검색
            List<Map<String, Object>> searchResults = movieService.searchMoviesByTitle(query);

            // 검색 결과가 없다면, 빈 리스트를 반환
            if (searchResults.isEmpty()) {
                return new ResponseEntity<>(searchResults, HttpStatus.NOT_FOUND);
            }

            // 검색 결과 반환
            return new ResponseEntity<>(searchResults, HttpStatus.OK);

        } catch (Exception e) {
            // 예외 처리
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 영화 제목으로 검색 (5개만 반환)
    @GetMapping("/search/top5")
    public ResponseEntity<List<Map<String, Object>>> searchMoviesTop5(@RequestParam String query) {
        try {
            // 클라이언트로부터 받은 검색어로 영화 목록 검색
            List<Map<String, Object>> searchResults = movieService.searchMoviesByTitle(query);

            // 검색 결과가 없다면, 빈 리스트를 반환
            if (searchResults.isEmpty()) {
                return new ResponseEntity<>(searchResults, HttpStatus.NOT_FOUND);
            }

            // 검색 결과 중에서 최대 5개만 반환
            List<Map<String, Object>> top5Results = searchResults.size() > 5
                    ? searchResults.subList(0, 5)  // 5개까지만 반환
                    : searchResults;

            // 검색 결과 반환
            return new ResponseEntity<>(top5Results, HttpStatus.OK);

        } catch (Exception e) {
            // 예외 처리
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 리뷰 개수를 기준으로 정렬된 영화 목록 가져오기
    @GetMapping("/sortedByReviews")
    public ResponseEntity<List<Map<String, Object>>> getMoviesSortedByReviews() {
        try {
            System.out.println("Controller method invoked");
            // 서비스에서 정렬된 영화 목록 가져오기
            List<Map<String, Object>> apiMovies = movieService.getAllPopularMovies();
            List<Map<String, Object>> sortedMovies = movieService.getMoviesSortedByReviewCount(apiMovies);

            // 결과 반환
            return new ResponseEntity<>(sortedMovies, HttpStatus.OK);

        } catch (Exception e) {
            // 예외 처리
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}