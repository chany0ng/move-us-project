package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
