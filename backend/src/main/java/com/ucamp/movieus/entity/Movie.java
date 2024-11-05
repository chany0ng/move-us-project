package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tmdbId;// TMDB 영화 ID
    private String title;
    private String originalTitle;

    @Lob
    private String overview;
    private String posterPath;
    private String backdropPath;
    private double popularity;
    private double voteAverage;
    private int voteCount;
    private LocalDate releaseDate;

    @ManyToMany
    @JoinTable(
            name = "movie_genre_ids",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id") // 변경됨
    )
    private Set<Genre> genres = new HashSet<>(); // 장르 리스트
}