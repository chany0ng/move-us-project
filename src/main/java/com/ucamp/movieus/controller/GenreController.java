package com.ucamp.movieus.controller;

import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.repository.GenreRepository;
import com.ucamp.movieus.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;
    private final GenreRepository genreRepository;

    @GetMapping("/fetch-genres")
    public String fetchGenres() {
        genreService.fetchAndSaveGenres();
        return "Genres fetched and saved successfully";
    }

    // 저장된 장르 리스트 반환
    @GetMapping("/genresList")
    public List<Genre> getGenres() {
        return genreRepository.findAll();
    }
}
