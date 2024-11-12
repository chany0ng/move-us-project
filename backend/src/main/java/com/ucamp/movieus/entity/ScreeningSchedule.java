package com.ucamp.movieus.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "screening_schedule")
public class ScreeningSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;

    @OneToMany(mappedBy = "screeningSchedule")
    @ToString.Exclude // 순환 참조 방지
    private List<ScreeningTime> screeningTimes;

    @Column(nullable = false)
    private LocalDate screeningDate;
}
