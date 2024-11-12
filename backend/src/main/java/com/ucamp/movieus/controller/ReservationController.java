package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.PaymentResponseDTO;
import com.ucamp.movieus.entity.Payment;
import com.ucamp.movieus.entity.Seat;
import com.ucamp.movieus.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final PaymentRepository paymentRepository;

    public ReservationController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/user/{userNum}")
    public ResponseEntity<List<PaymentResponseDTO>> getUserReservations(@PathVariable int userNum) {
        List<Payment> userPayments = paymentRepository.findByUser_UserNum(userNum);

        if (userPayments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // PaymentResponseDTO 리스트 생성
        List<PaymentResponseDTO> reservationList = userPayments.stream()
                .map(payment -> {
                    PaymentResponseDTO responseDTO = new PaymentResponseDTO();
                    responseDTO.setPaymentId(payment.getPaymentId());
                    responseDTO.setStatus(payment.getStatus());
                    responseDTO.setAmount(payment.getAmount());
                    responseDTO.setOrderId(payment.getOrderId());
                    responseDTO.setPaymentDate(payment.getPaymentDate());
                    responseDTO.setPaymentKey(payment.getPaymentKey());

                    if (payment.getScreeningSchedule() != null) {
                        responseDTO.setMovieName(payment.getScreeningSchedule().getMovie().getTitle());
                        responseDTO.setTheaterName(payment.getScreeningSchedule().getTheater().getTheaterName());
                        responseDTO.setScreeningDate(payment.getScreeningSchedule().getScreeningDate());
                    }

                    if (payment.getScreeningTime() != null) {
                        responseDTO.setTimeId(payment.getScreeningTime().getTimeId());
                        responseDTO.setScreeningTime(payment.getScreeningTime().getScreeningTime());
                    }

                    String seatNumbers = payment.getSeats().stream()
                            .map(Seat::getSeatNumber)
                            .collect(Collectors.joining(","));
                    responseDTO.setSeatNumbers(seatNumbers);

                    return responseDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(reservationList);
    }
}