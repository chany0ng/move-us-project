package com.ucamp.movieus.dto;

import lombok.Data;

@Data
public class FavoriteListResponseDTO {
    private Integer favoriteId;
    private Integer userNum;
    private Long tmdbId;
    private String title;
    private String posterPath;
}
