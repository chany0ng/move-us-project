package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
   List<ReviewEntity> findAllByUser(UserEntity user);
   List<ReviewEntity> findAllByMovieId(Movie movie);
}
