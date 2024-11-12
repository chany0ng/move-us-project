// ScreeningTimeDTO.java
package com.ucamp.movieus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ScreeningTimeDTO {
    private Long timeId;          // 추가된 필드
    private LocalTime screeningTime;
    private int reservedSeats;
}