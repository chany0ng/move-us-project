package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.entity.Movie;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class MovieDTO {
    @JsonProperty("id")
    private Long tmdbId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("original_title")
    private String originalTitle;

    @JsonProperty("overview")
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("popularity")
    private double popularity;

    @JsonProperty("vote_average")
    private double voteAverage;

    @JsonProperty("vote_count")
    private int voteCount;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    @JsonProperty("genre_ids")
    private List<Long> genreIds;

    public Movie toMovie() {
        Movie movie = new Movie();
        movie.setTmdbId(tmdbId);
        movie.setTitle(title);
        movie.setOriginalTitle(originalTitle);
        movie.setOverview(overview);
        movie.setPosterPath(posterPath);
        movie.setBackdropPath(backdropPath);
        movie.setPopularity(popularity);
        movie.setVoteAverage(voteAverage);
        movie.setVoteCount(voteCount);
        movie.setReleaseDate(releaseDate);
        movie.setGenreIds(genreIds);
        return movie;
    }
}
