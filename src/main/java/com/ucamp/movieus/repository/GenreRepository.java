package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
