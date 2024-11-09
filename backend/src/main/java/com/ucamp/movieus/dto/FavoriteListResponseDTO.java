package com.ucamp.movieus.dto;

import com.ucamp.movieus.entity.UserEntity;
import lombok.Data;

@Data
public class FavoriteListResponseDTO {
    private Integer favoriteId;
    private UserEntity user;
    private Long tmdbId; // 영화 TMDB ID
    private String title; // 영화 title
    private String posterPath; // 포스터 경로
}
