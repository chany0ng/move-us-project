package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;

@Entity
@Data
@Table(name = "screening_time")
public class ScreeningTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_id")
    private Long timeId;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private ScreeningSchedule screeningSchedule;

    @Column(nullable = false)
    private LocalTime screeningTime;

    @Column(nullable = false)
    private int reservedSeats = 0;
}

