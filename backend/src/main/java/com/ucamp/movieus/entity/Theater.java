package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "theater")
public class Theater {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int theaterId;

    @Column(nullable = false)
    private String theaterName;

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private CinemaCompany cinemaCompany;

    private String address;

    @Column(nullable = false)
    private int maxSeats = 100;
}
