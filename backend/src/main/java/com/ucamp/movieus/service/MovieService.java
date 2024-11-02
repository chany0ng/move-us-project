package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.TMDBResponse;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.MovieRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate;
    private final String API_KEY = "40405429a36ddf7b1d4337a022992fbc";

    @PostConstruct
    public void init() {
        fetchAndSaveNowPlayingMovies(); // 애플리케이션 시작 시 데이터 로딩
    }

    public void fetchAndSaveNowPlayingMovies() {
        // 1. API로부터 영화 목록 가져오기
        List<Movie> movies = fetchMoviesFromApi();

        // 2. DB에서 모든 영화 목록 가져오기
        List<Movie> existingMovies = movieRepository.findAll();

        // 3. 영화 목록을 맵에 저장하여 쉽게 찾을 수 있게 하기
        Map<Long, Movie> existingMovieMap = existingMovies.stream()
                .collect(Collectors.toMap(Movie::getTmdbId, Function.identity()));

        // 4. 새 영화 추가 또는 업데이트
        for (Movie movie : movies) {
            if (existingMovieMap.containsKey(movie.getTmdbId())) {
                // 기존 영화 업데이트
                Movie existingMovie = existingMovieMap.get(movie.getTmdbId());
                existingMovie.setTitle(movie.getTitle());
                existingMovie.setOriginalTitle(movie.getOriginalTitle());
                existingMovie.setOverview(movie.getOverview());
                existingMovie.setPosterPath(movie.getPosterPath());
                existingMovie.setBackdropPath(movie.getBackdropPath());
                existingMovie.setPopularity(movie.getPopularity());
                existingMovie.setVoteAverage(movie.getVoteAverage());
                existingMovie.setVoteCount(movie.getVoteCount());
                existingMovie.setReleaseDate(movie.getReleaseDate());
                existingMovie.setGenreIds(movie.getGenreIds()); // 장르 ID 업데이트
            } else {
                // 새 영화 추가
                movieRepository.save(movie);
            }
        }
    }

    private List<Movie> fetchMoviesFromApi() {
        List<Movie> allMovies = new ArrayList<>();
        int page = 1;

        while (true) {
            String url = String.format("https://api.themoviedb.org/3/movie/now_playing?api_key=%s&region=KR&language=ko&sort_by=popularity.desc&page=%d", API_KEY, page);
            TMDBResponse response = restTemplate.getForObject(url, TMDBResponse.class);

            // 총 결과와 페이지 수 출력
            System.out.println("Total Results: " + response.getTotalResults());
            System.out.println("Total Pages: " + response.getTotalPages());

            if (response != null) {
                allMovies.addAll(response.toMovies()); // 현재 페이지의 영화 추가

                // 다음 페이지가 없으면 반복 종료
                if (page >= response.getTotalPages()) {
                    break;
                }

                page++; // 다음 페이지로 이동
            } else {
                break; // 응답이 null인 경우 종료
            }
        }

        return allMovies; // 모든 영화 리스트 반환
    }

    public Movie getMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with ID: " + id));
    }
}
