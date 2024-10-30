package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.GenreResponse;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.repository.GenreRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    private final String API_KEY = "40405429a36ddf7b1d4337a022992fbc";
    private final String GENRE_API_URL = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY + "&region=KR&language=ko";

    @PostConstruct
    public void init() {
        fetchAndSaveGenres(); // 애플리케이션 시작 시 데이터 로딩
    }

    public void fetchAndSaveGenres() {
        RestTemplate restTemplate = new RestTemplate();

        try {
            GenreResponse response = restTemplate.getForObject(GENRE_API_URL, GenreResponse.class);
            List<Genre> genres = response.getGenres();

            // 저장 전에 중복된 장르를 체크하거나 처리할 수 있음
            for (Genre genre : genres) {
                // DB에 존재하는지 체크 후 추가
                if (!genreRepository.existsById(genre.getId())) {
                    genreRepository.save(genre);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


