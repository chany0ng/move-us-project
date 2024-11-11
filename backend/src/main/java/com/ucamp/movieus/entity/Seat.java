package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "seat")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="seat_id")
    private int seatId;

    @ManyToOne
    @JoinColumn(name = "time_id", nullable = false)
    private ScreeningTime screeningTime;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private boolean isReserved = false;

    @Column(nullable = false)
    private int price = 10000;
}
