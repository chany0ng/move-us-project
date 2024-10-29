package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.entity.Movie;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TMDBResponse {

    @JsonProperty("results")
    private List<MovieDTO> results;
    @JsonProperty("total_pages")
    private Integer totalPages;
    @JsonProperty("total_results")
    private Integer totalResults;

    public List<Movie> toMovies() {
        return results.stream().map(MovieDTO::toMovie).toList();
    }
}
