package com.ucamp.movieus.service;

import com.ucamp.movieus.entity.Seat;
import com.ucamp.movieus.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // 특정 time_id에 해당하는 좌석 리스트를 가져오는 메서드
    public List<Seat> getSeatsByTimeId(Integer timeId) {
        return seatRepository.findSeatsByTimeId(timeId);
    }
}
