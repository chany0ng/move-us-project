package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // DB에 저장된 모든 TMDB ID 조회
    @Query("SELECT m.tmdbId FROM Movie m")
    List<Integer> findAllTmdbIds();

    Optional<Movie> findByTmdbId(Long tmdbId);

    List<Movie> findAllByOrderByRankingAsc(); // 랭킹 오름차순 조회

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) = LOWER(:title)")
    Movie findByTitleIgnoreCase(@Param("title") String title);

    //jh
    @Query("SELECT m.posterPath FROM Movie m WHERE LOWER(m.title) = LOWER(:title)")
    Optional<String> findPosterPathByTitleIgnoreCase(@Param("title") String title);

}

