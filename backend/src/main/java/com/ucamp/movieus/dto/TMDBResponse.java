package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.GenreRepository;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class TMDBResponse {

    @JsonProperty("results")
    private List<MovieDTO> results;
    @JsonProperty("total_pages")
    private Integer totalPages;
    @JsonProperty("total_results")
    private Integer totalResults;

    public List<Movie> toMovies(GenreRepository genreRepository) {
        return results.stream()
                .map(movieDTO -> {
                    Set<Genre> genres = convertGenreIdsToGenres(movieDTO.getGenreIds(), genreRepository);
                    return movieDTO.toMovie(genres);
                })
                .collect(Collectors.toList());
    }

    private Set<Genre> convertGenreIdsToGenres(List<Long> genreIds, GenreRepository genreRepository) {
        Set<Genre> genres = new HashSet<>();
        for (Long genreId : genreIds) {
            genreRepository.findById(genreId).ifPresent(genres::add);
        }
        return genres;
    }

}
