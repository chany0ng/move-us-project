package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

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

    @ElementCollection
    private List<Long> genreIds; // 장르 ID 리스트

}
