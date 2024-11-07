package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // DB에 저장된 모든 TMDB ID 조회
    @Query("SELECT m.tmdbId FROM Movie m")
    List<Integer> findAllTmdbIds();

    Optional<Movie> findByTmdbId(Long aLong);
}
