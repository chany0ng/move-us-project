package com.ucamp.movieus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ucamp.movieus.entity.Genre;
import lombok.Data;

import java.util.List;

@Data
public class GenreResponse {

    @JsonProperty("genres")
    private List<Genre> genres;

}
