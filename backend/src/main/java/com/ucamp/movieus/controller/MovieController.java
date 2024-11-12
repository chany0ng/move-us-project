package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.DailyBoxOfficeDTO;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<Movie>> getMovies(@RequestParam(required = false) String genre) {
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
        System.out.println(id + " " + detail);
        return ResponseEntity.ok(detail);
    }

    // TMDB 인기영화 목록 장르별/정렬별 조회(DB존재여부 표시, page 1~5)
    @GetMapping("/allPopularMovies")
    public ResponseEntity<List<Map<String, Object>>> getAllPopularMovies(@RequestParam(required = false) String genre) {
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
    public ResponseEntity<List<Map<String, Object>>> getMoviesSortedByReviews(
            @RequestParam(required = false) String genre) {
        System.out.println(genre);
        if(genre.equals("All")){
            genre = "";
        }
        System.out.println(genre);

        try {
            System.out.println("Controller method invoked");

            // TMDB API에서 인기 있는 영화 목록 가져오기
            List<Map<String, Object>> apiMovies = movieService.getAllPopularMovies2();

            // 장르 필터링 및 정렬된 영화 목록 가져오기
            List<Map<String, Object>> sortedMovies = movieService.getMoviesSortedByReviewCountAndGenre(apiMovies, genre);

            // 결과 반환
            return new ResponseEntity<>(sortedMovies, HttpStatus.OK);

        } catch (Exception e) {
            // 예외 처리
            System.err.println("Error occurred: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @GetMapping("/combinedMovies")
    public ResponseEntity<Page<Map<String, Object>>> getCombinedMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "popular") String sort
    ) {
        page = page - 1; // 1페이지부터 시작하도록 조정

        // 1. DB 영화 목록 가져오기 및 장르 필터링
        List<Map<String, Object>> dbMovies;
        if ("All".equals(genre) || genre == null) {
            dbMovies = movieRepository.findAll().stream()
                    .map(this::convertDbMovieToStandardFormat)
                    .collect(Collectors.toList());
        } else {
            dbMovies = movieService.getMoviesByGenreName(genre).stream()
                    .map(this::convertDbMovieToStandardFormat)
                    .collect(Collectors.toList());
        }

        // 2. 외부 API 영화 목록 가져오기 및 장르 필터링
        List<Map<String, Object>> apiMovies;
        if ("All".equals(genre) || genre == null) {
            apiMovies = movieService.getAllPopularMovies().stream()
                    .map(this::convertApiMovieToStandardFormat)
                    .collect(Collectors.toList());
        } else {
            apiMovies = movieService.getPopularMoviesByGenre(genre).stream()
                    .map(this::convertApiMovieToStandardFormat)
                    .collect(Collectors.toList());
        }

        // 3. 두 영화 리스트 합치기
        List<Map<String, Object>> allMovies = new ArrayList<>(dbMovies);
        allMovies.addAll(apiMovies);

        // 4. 정렬 (popularity 기준으로 내림차순)
        allMovies.sort((movie1, movie2) ->
                Double.compare(
                        Double.parseDouble(movie2.get("popularity").toString()),
                        Double.parseDouble(movie1.get("popularity").toString())
                )
        );

        // 5. 페이지네이션 처리
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + size, allMovies.size());
        List<Map<String, Object>> paginatedMovies = allMovies.subList(start, end);
        Page<Map<String, Object>> moviePage = new PageImpl<>(paginatedMovies, pageable, allMovies.size());

        return ResponseEntity.ok(moviePage);
    }

    // DB 영화 데이터를 공통 포맷으로 변환
    private Map<String, Object> convertDbMovieToStandardFormat(Movie movie) {
        return Map.of(
                "id", Objects.requireNonNullElse(movie.getTmdbId(), 0),  // id가 null이면 기본값 0 사용
                "title", Objects.requireNonNullElse(movie.getTitle(), "제목 없음"),  // 기본값을 "제목 없음"으로 설정
                "poster_path", Objects.requireNonNullElse(movie.getPosterPath(), ""),
                "popularity", Objects.requireNonNullElse(movie.getPopularity(), ""),
                "overview", Objects.requireNonNullElse(movie.getOverview(), "정보 없음"),
                "release_date", Objects.requireNonNullElse(movie.getReleaseDate(), "미정"),
                "exists_in_db", true  // DB 영화 데이터이므로 항상 true
        );
    }


    // 외부 API 영화 데이터를 공통 포맷으로 변환
    private Map<String, Object> convertApiMovieToStandardFormat(Map<String, Object> movie) {
        return Map.of(
                "id", movie.get("id"),
                "title", movie.get("title"),
                "poster_path", movie.get("poster_path"),
                "popularity", movie.get("popularity"),
                "overview", movie.get("overview"),
                "release_date", movie.get("release_date"),
                "exists_in_db", false  // 외부 API 데이터이므로 항상 false
        );
    }

}