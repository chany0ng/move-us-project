package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.MovieDTO;
import com.ucamp.movieus.dto.TMDBResponse;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.GenreRepository;
import com.ucamp.movieus.repository.MovieRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final RestTemplate restTemplate;
    private final String API_KEY = "40405429a36ddf7b1d4337a022992fbc";

    @PostConstruct
    public void init() {
        fetchAndSaveNowPlayingMovies(); // 애플리케이션 시작 시 데이터 로딩
    }

    public void fetchAndSaveNowPlayingMovies() {
        List<Movie> movies = fetchMoviesFromApi();
        List<Movie> existingMovies = movieRepository.findAll();

        // 기존 영화들을 TMDB ID 기준으로 Map으로 변환
        Map<Long, Movie> existingMovieMap = existingMovies.stream()
                .collect(Collectors.toMap(Movie::getTmdbId, Function.identity()));

        for (Movie movie : movies) {
            if (existingMovieMap.containsKey(movie.getTmdbId())) {
                updateMovie(existingMovieMap.get(movie.getTmdbId()), movie); // 기존 영화 업데이트
            } else {
                movieRepository.save(movie); // 새 영화 저장
            }
        }
    }

    private List<Movie> fetchMoviesFromApi() {
        TMDBResponse response;
        int page = 1;
        List<Movie> allMovies = new ArrayList<>();

        do {
            String url = String.format(
                    "https://api.themoviedb.org/3/movie/now_playing?api_key=%s&region=KR&language=ko&sort_by=popularity.desc&page=%d",
                    API_KEY, page);
            response = restTemplate.getForObject(url, TMDBResponse.class);

            if (response != null && response.getResults() != null) {
                List<Movie> movies = response.toMovies(genreRepository); // GenreRepository를 사용하여 Movie로 변환
                allMovies.addAll(movies);
                page++;
            }
        } while (response != null && page <= response.getTotalPages());

        return allMovies;
    }

    // 기존 Movie 객체 업데이트
    private void updateMovie(Movie existingMovie, Movie newMovie) {
        existingMovie.setTitle(newMovie.getTitle());
        existingMovie.setOriginalTitle(newMovie.getOriginalTitle());
        existingMovie.setOverview(newMovie.getOverview());
        existingMovie.setPosterPath(newMovie.getPosterPath());
        existingMovie.setBackdropPath(newMovie.getBackdropPath());
        existingMovie.setPopularity(newMovie.getPopularity());
        existingMovie.setVoteAverage(newMovie.getVoteAverage());
        existingMovie.setVoteCount(newMovie.getVoteCount());
        existingMovie.setReleaseDate(newMovie.getReleaseDate());
        existingMovie.setGenres(newMovie.getGenres());
    }

    public Movie getMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with ID: " + id));
    }

    public List<Movie> getMoviesByGenreName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }
}
