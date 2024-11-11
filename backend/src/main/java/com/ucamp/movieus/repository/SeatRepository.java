package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.ScreeningTime;
import com.ucamp.movieus.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByScreeningTime(ScreeningTime time);

    @Query("SELECT s FROM Seat s WHERE s.screeningTime.timeId = :timeId")
    List<Seat> findSeatsByTimeId(@Param("timeId") Integer timeId);

    @Modifying
    @Query("UPDATE Seat s SET s.isReserved = true WHERE s.seatId IN :seatIds")
    void reserveSeats(@Param("seatIds") List<Integer> seatIds);

    Optional<Seat> findByScreeningTimeAndSeatId(ScreeningTime screeningTime, Integer seatId);
}