package com.ucamp.movieus.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DailyBoxOfficeResponse {
    private BoxOfficeResult boxOfficeResult;

    @Getter
    @Setter
    public static class BoxOfficeResult {
        private List<DailyBoxOfficeDTO> dailyBoxOfficeList;
    }
}