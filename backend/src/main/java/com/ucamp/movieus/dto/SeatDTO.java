package com.ucamp.movieus.dto;

import com.ucamp.movieus.entity.Seat;
import lombok.Data;

@Data
public class SeatDTO {
    private int seatId;
    private String seatNumber;
    private boolean isReserved;
    private int price;
    private Long timeId;  // 추가된 필드

    public SeatDTO(int seatId, String seatNumber, Long timeId) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.timeId = timeId;
    }

    public SeatDTO(Seat seat) {
        this.seatId = seat.getSeatId();
        this.seatNumber = seat.getSeatNumber();
        this.isReserved = seat.isReserved();
        this.price = seat.getPrice();
    }

    public SeatDTO(int seatId, String seatNumber, Long timeId, boolean reserved) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.timeId = timeId;
        this.isReserved = reserved;
    }
}