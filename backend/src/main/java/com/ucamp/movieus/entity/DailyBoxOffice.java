package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "daily_box_office")
public class DailyBoxOffice {

    @Id
    private String movieCd;

    @Column(name = "`rank`")
    private int rank;

    private String movieNm;
    private String openDt;
    private String scrnCnt;
    private String audiAcc;
    private String posterPath;

    @ManyToOne
    @JoinColumn(name = "title", referencedColumnName = "title", insertable = false, updatable = false)
    private Movie movie;




}
