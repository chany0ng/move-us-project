package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
   List<ReviewEntity> findAllByUser(UserEntity user);
   List<ReviewEntity> findAllByTmdbId(Long tmdbId);

   Optional<ReviewEntity> findByTmdbIdAndUser(Long tmdbId, UserEntity user);
   Optional<ReviewEntity> findByReviewIdAndReportUserEmail(Long reviewId, String reportUserEmail);

   Integer countByTmdbId(Long tmdbId);
}
