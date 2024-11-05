package com.ucamp.movieus.dto;

import lombok.Data;

@Data
public class GenreDTO {
    private Long id; // 장르 ID
    private String name; // 장르 이름

    public GenreDTO(Long id) {
        this.id = id;
    }
}