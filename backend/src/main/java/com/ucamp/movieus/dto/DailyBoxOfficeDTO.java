package com.ucamp.movieus.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyBoxOfficeDTO {
    private String movieCd;
    private int rank;
    private String movieNm;
    private String openDt;
    private String scrnCnt;
    private String audiAcc;
    private String posterPath;
}