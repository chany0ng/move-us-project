package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.PaymentRequestDTO;
import com.ucamp.movieus.dto.PaymentResponseDTO;
import com.ucamp.movieus.dto.SeatDTO;
import com.ucamp.movieus.entity.*;
import com.ucamp.movieus.repository.*;
import com.ucamp.movieus.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

//@RestController
@Controller
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ScreeningScheduleRepository screeningScheduleRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private  ScreeningTimeRepository screeningTimeRepository;

    public PaymentController(PaymentService paymentService
            ,UserRepository userRepository
            ,ScreeningScheduleRepository screeningScheduleRepository
            ,SeatRepository seatRepository
            ,ScreeningTimeRepository screeningTimeRepository) {
        this.paymentService = paymentService;
        this.userRepository=userRepository;
        this.screeningTimeRepository = screeningTimeRepository;
        this.screeningScheduleRepository=screeningScheduleRepository;
        this.seatRepository = seatRepository;
    }

    @GetMapping("/toss")
    public String showPaymentPage(Model model) {
        UUID paymentId = UUID.randomUUID(); // UUID 생성
        model.addAttribute("amount", 10000); // 테스트 금액
        model.addAttribute("paymentId", paymentId.toString()); // UUID를 문자열로 변환하여 추가
        return "paymentForm"; // paymentForm.html Thymeleaf 템플릿
    }




//    @PostMapping("/toss")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) {
//        Map<String, Object> response = new HashMap<>();
//
//        // 요청에서 필요한 데이터 추출
//        int amount = paymentRequestDTO.getAmount();
//        String orderId = UUID.randomUUID().toString();
//        String orderName = paymentRequestDTO.getOrderName();
//        String paymentMethod = paymentRequestDTO.getPaymentMethod();
//        Long timeId = paymentRequestDTO.getTimeId();
//        int userNum = paymentRequestDTO.getUserNum();
//        LocalDate screeningDate = paymentRequestDTO.getScreeningDate();
//        LocalTime screeningTime = paymentRequestDTO.getScreeningTime();
//
//        // 좌석 ID 리스트 처리
//        List<String> seatIds = paymentRequestDTO.getSeatIds();
//        List<Seat> seats = new ArrayList<>();
//        if (seatIds != null && !seatIds.isEmpty()) {
//            for (String seatId : seatIds) {
//                Seat seatEntity = seatRepository.findById(Integer.parseInt(seatId)).orElse(null);
//                if (seatEntity != null) {
//                    seats.add(seatEntity);
//                }
//            }
//        }
//
//        System.out.println("amount: " + amount);
//        System.out.println("orderId: " + orderId);
//        System.out.println("paymentMethod: " + paymentMethod);
//        System.out.println("timeId: " + timeId);
//        System.out.println("userNum: " + userNum);
//        System.out.println("screeningDate: " + screeningDate);
//        System.out.println("screeningTime: " + screeningTime);
//        System.out.println("seatIds: " + seatIds);
//
//        // 결제 정보를 데이터베이스에 저장
//        Payment payment = new Payment();
//        payment.setPaymentMethod(paymentMethod);
//        payment.setAmount(amount);
//        payment.setStatus("PENDING");
//        payment.setPaymentDate(LocalDateTime.now());
//        payment.setOrderId(orderId);
//
//        // User 설정
//        UserEntity user = userRepository.findById(userNum).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User not found"));
//        }
//        payment.setUser(user);
//
//        // ScreeningTime을 통해 ScreeningSchedule 조회
//        ScreeningTime screeningTimeEntity = screeningTimeRepository.findById(timeId).orElse(null);
//        if (screeningTimeEntity == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening time not found"));
//        }
//        payment.setScreeningTime(screeningTimeEntity);
//
//        // ScreeningSchedule 설정 및 관련 정보 추출
//        ScreeningSchedule screeningSchedule = screeningTimeEntity.getScreeningSchedule();
//        if (screeningSchedule == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening schedule not found"));
//        }
//        payment.setScreeningSchedule(screeningSchedule);
//        Long movieId = screeningSchedule.getMovie().getId();
//        int theaterId = screeningSchedule.getTheater().getTheaterId();
//
//        // 좌석 리스트 설정
//        payment.setSeats(seats);
//
//        // Payment 저장
//        payment = paymentRepository.save(payment);
//
//        // 성공 및 실패 URL 설정
//        String completeUrl = "http://localhost:8080/api/v1/payments/toss/complete";
//        String failUrl = "http://localhost:8080/api/v1/payments/toss/fail";
//
//        // 응답 데이터
//        response.put("paymentMethod", paymentMethod);
//        response.put("amount", amount);
//        response.put("orderId", orderId);
//        response.put("orderName", orderName);
//        response.put("successUrl", completeUrl);
//        response.put("failUrl", failUrl);
//        response.put("paymentId", payment.getPaymentId());
//        response.put("userNum", userNum);
//        response.put("movieId", movieId);
//        response.put("theaterId", theaterId);
//        response.put("screeningDate", screeningDate);
//        response.put("screeningTime", screeningTime);
//        response.put("seatIds", seatIds);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }


    @PostMapping("/toss")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) {
        Map<String, Object> response = new HashMap<>();

        // 요청에서 필요한 데이터 추출
        int amount = paymentRequestDTO.getAmount();
        String orderId = UUID.randomUUID().toString();
        String orderName = paymentRequestDTO.getOrderName();
        String paymentMethod = paymentRequestDTO.getPaymentMethod();
        Long timeId = paymentRequestDTO.getTimeId();
        int userNum = paymentRequestDTO.getUserNum();
        LocalDate screeningDate = paymentRequestDTO.getScreeningDate();
        LocalTime screeningTime = paymentRequestDTO.getScreeningTime();

        // 좌석 번호 리스트 처리
        List<String> seatNumbers = paymentRequestDTO.getSeatNumbers();
        List<Seat> seats = new ArrayList<>();
        if (seatNumbers != null && !seatNumbers.isEmpty()) {
            for (String seatNumber : seatNumbers) {
                Seat seatEntity = seatRepository.findByScreeningTimeAndSeatNumber(timeId, seatNumber).orElse(null);
                if (seatEntity != null) {
                    seats.add(seatEntity);
                } else {
                    System.out.println("Seat with number " + seatNumber + " not found.");
                }
            }
        }

        System.out.println("amount: " + amount);
        System.out.println("orderId: " + orderId);
        System.out.println("paymentMethod: " + paymentMethod);
        System.out.println("timeId: " + timeId);
        System.out.println("userNum: " + userNum);
        System.out.println("screeningDate: " + screeningDate);
        System.out.println("screeningTime: " + screeningTime);
        System.out.println("seatNumbers: " + seatNumbers);

        // 결제 정보를 데이터베이스에 저장
        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(amount);
        payment.setStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setOrderId(orderId);

        // User 설정
        UserEntity user = userRepository.findById(userNum).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User not found"));
        }
        payment.setUser(user);

        // ScreeningTime을 통해 ScreeningSchedule 조회
        ScreeningTime screeningTimeEntity = screeningTimeRepository.findById(timeId).orElse(null);
        if (screeningTimeEntity == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening time not found"));
        }
        payment.setScreeningTime(screeningTimeEntity);

        // ScreeningSchedule 설정 및 관련 정보 추출
        ScreeningSchedule screeningSchedule = screeningTimeEntity.getScreeningSchedule();
        if (screeningSchedule == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening schedule not found"));
        }
        payment.setScreeningSchedule(screeningSchedule);
        Long movieId = screeningSchedule.getMovie().getId();
        int theaterId = screeningSchedule.getTheater().getTheaterId();

        // 좌석 리스트 설정
        payment.setSeats(seats);

        // Payment 저장
        payment = paymentRepository.save(payment);

        // 성공 및 실패 URL 설정
        String completeUrl = "http://localhost:8080/api/v1/payments/toss/complete";
        String failUrl = "http://localhost:8080/api/v1/payments/toss/fail";

        // 응답 데이터
        response.put("paymentMethod", paymentMethod);
        response.put("amount", amount);
        response.put("orderId", orderId);
        response.put("orderName", orderName);
        response.put("successUrl", completeUrl);
        response.put("failUrl", failUrl);
        response.put("paymentId", payment.getPaymentId());
        response.put("userNum", userNum);
        response.put("movieId", movieId);
        response.put("theaterId", theaterId);
        response.put("screeningDate", screeningDate);
        response.put("screeningTime", screeningTime);
        response.put("seatNumbers", seatNumbers);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/toss/complete")
    public ResponseEntity<PaymentResponseDTO> completePaymentGet(@RequestParam Map<String, String> requestParams) {
        System.out.println("Received request parameters: " + requestParams);

        String paymentKey = requestParams.get("paymentKey");
        String orderId = requestParams.get("orderId");
        String amountStr = requestParams.get("amount");

        if (paymentKey == null || orderId == null || amountStr == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        int amount;
        try {
            amount = Integer.parseInt(amountStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        boolean isPaymentSuccessful = paymentService.verifyPayment(paymentKey, orderId, amount);

        if (isPaymentSuccessful) {
            Payment payment = paymentService.findPaymentByOrderId(orderId);

            if (payment == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            payment.setPaymentKey(paymentKey);
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);

            List<Seat> seats = payment.getSeats();
            seats.forEach(seat -> seat.setReserved(true));
            seatRepository.saveAll(seats);

            paymentService.updateReservedSeats(payment.getScreeningTime().getTimeId());

            // PaymentResponseDTO로 응답 데이터 구성
            PaymentResponseDTO responseDTO = new PaymentResponseDTO();
            responseDTO.setPaymentId(payment.getPaymentId());
            responseDTO.setStatus(payment.getStatus());
            responseDTO.setMessage("결제가 성공적으로 완료되었습니다!");
            responseDTO.setAmount(payment.getAmount());
            responseDTO.setOrderId(payment.getOrderId());
            responseDTO.setOrderName(payment.getOrderName());
            responseDTO.setPaymentDate(payment.getPaymentDate());
            responseDTO.setPaymentKey(payment.getPaymentKey());

            if (payment.getScreeningSchedule() != null) {
                responseDTO.setMovieId(payment.getScreeningSchedule().getMovie().getId());
                responseDTO.setTheaterName(payment.getScreeningSchedule().getTheater().getTheaterName()); // 극장 이름 설정
                responseDTO.setScreeningDate(payment.getScreeningSchedule().getScreeningDate());
            }

            if (payment.getUser() != null) {
                responseDTO.setUserNum(payment.getUser().getUserNum());
            }

            if (payment.getScreeningTime() != null) {
                responseDTO.setTimeId(payment.getScreeningTime().getTimeId());
                responseDTO.setScreeningTime(payment.getScreeningTime().getScreeningTime());
            }

            List<SeatDTO> seatDTOs = payment.getSeats().stream()
                    .map(seat -> new SeatDTO(seat.getSeatId(), seat.getSeatNumber(), seat.getScreeningTime().getTimeId(), seat.isReserved()))
                    .collect(Collectors.toList());
            responseDTO.setSeats(seatDTOs);

            return ResponseEntity.ok(responseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }




    @GetMapping("/toss/success")
    public ResponseEntity<?> paymentSuccess(@RequestParam Long paymentId) {
        // 결제 ID로 Payment 정보 조회
        Payment payment = paymentRepository.findByPaymentId(paymentId);

        // Payment 정보가 존재할 경우 처리
        if (payment != null) {
            // 로그 출력으로 각 필드 값 확인
            System.out.println("Payment found: " + payment.getPaymentId());
            System.out.println("ScreeningSchedule: " + payment.getScreeningSchedule());
            System.out.println("User: " + payment.getUser());
            System.out.println("ScreeningTime: " + payment.getScreeningTime());
            System.out.println("Seats: " + payment.getSeats());

            // PaymentResponseDTO 생성 및 데이터 설정
            PaymentResponseDTO responseDTO = new PaymentResponseDTO();
            responseDTO.setPaymentId(payment.getPaymentId());
            responseDTO.setStatus(payment.getStatus());
            responseDTO.setMessage("결제가 성공적으로 완료되었습니다!");
            responseDTO.setAmount(payment.getAmount());
            responseDTO.setOrderId(payment.getOrderId());
            responseDTO.setPaymentDate(payment.getPaymentDate());

            // ScreeningSchedule 정보 설정
            if (payment.getScreeningSchedule() != null) {
                responseDTO.setMovieId(payment.getScreeningSchedule().getMovie().getId());
                responseDTO.setTheaterName(payment.getScreeningSchedule().getTheater().getTheaterName());
                responseDTO.setScreeningDate(payment.getScreeningSchedule().getScreeningDate());
            }

            // User 정보 설정
            if (payment.getUser() != null) {
                responseDTO.setUserNum(payment.getUser().getUserNum());
            }

            // ScreeningTime 정보 설정
            if (payment.getScreeningTime() != null) {
                responseDTO.setTimeId(payment.getScreeningTime().getTimeId());
                responseDTO.setScreeningTime(payment.getScreeningTime().getScreeningTime());
            }

            // 좌석 정보 설정
            List<SeatDTO> seatDTOs = payment.getSeats().stream()
                    .map(seat -> new SeatDTO(seat.getSeatId(), seat.getSeatNumber(), seat.getScreeningTime().getTimeId(), seat.isReserved()))
                    .collect(Collectors.toList());
            responseDTO.setSeats(seatDTOs);

            // ResponseEntity로 JSON 응답 반환
            return ResponseEntity.ok(responseDTO);
        } else {
            // Payment 정보가 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "결제 정보를 찾을 수 없습니다."));
        }
    }

    @GetMapping("/toss/fail")
    @ResponseBody
    public String paymentFail() {
        return "결제에 실패하였습니다. 다시 시도해 주세요.";
    }

    @GetMapping("/toss/cancel")
    public String cancle(){
        return "cancel";
    }



//    @PostMapping("/toss/cancel")
//    @ResponseBody
//    public ResponseEntity<String> cancelPayment(@RequestParam String paymentKey,
//                                                @RequestParam String cancelReason) {
//        boolean isCancelled = paymentService.cancelPayment(paymentKey, cancelReason);
//
//        if (isCancelled) {
//            // 결제 취소 성공 시 상태를 "CANCEL"로 업데이트
//            paymentService.updatePaymentStatusByPaymentKey(paymentKey, "CANCEL");
//            return ResponseEntity.ok("Payment cancelled successfully.");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to cancel payment.");
//        }
//    }

    @PostMapping("/toss/cancel")
    public ResponseEntity<String> cancelPayment(@RequestParam String paymentKey, @RequestParam String cancelReason) {
        // 결제 정보 조회
        Optional<Payment> optionalPayment = paymentRepository.findByPaymentKey(paymentKey);
        if (optionalPayment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found.");
        }

        Payment payment = optionalPayment.get();

        // 결제 취소 처리
        boolean isCancelled = paymentService.cancelPayment(paymentKey, cancelReason);
        if (isCancelled) {
            // 결제 취소 성공 시 payment 상태를 "CANCEL"로 업데이트하고 저장
            payment.setStatus("CANCEL");
            paymentRepository.save(payment);

            // 좌석 예약 상태 초기화
            List<Seat> seats = payment.getSeats();
            for (Seat seat : seats) {
                seat.setReserved(false);  // 좌석 예약 취소
            }
            seatRepository.saveAll(seats);  // 좌석 정보 업데이트

            // ScreeningTime 테이블의 reserved_seats 감소
            paymentService.updateReservedSeats(payment.getScreeningTime().getTimeId());

            return ResponseEntity.ok("Payment and reservation cancelled successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to cancel payment.");
        }
    }



    //예약 좌석 조회
    @GetMapping("/{paymentId}/seats")
    public ResponseEntity<List<SeatDTO>> getReservedSeats(@PathVariable Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        List<SeatDTO> reservedSeats = payment.getSeats().stream()
                .peek(seat -> System.out.println("seatId: " + seat.getSeatId() + ", timeId: " + seat.getScreeningTime().getTimeId()))
                .map(seat -> new SeatDTO(seat.getSeatId(), seat.getSeatNumber(), seat.getScreeningTime().getTimeId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservedSeats);
    }

    // 특정 timeId로 예약된 좌석 조회
    @GetMapping("/time/{timeId}/seats")
    public ResponseEntity<List<SeatDTO>> getReservedSeatsByTimeId(@PathVariable Long timeId) {
        // ScreeningTime 엔티티 가져오기
        ScreeningTime screeningTime = screeningTimeRepository.findById(timeId).orElse(null);
        if (screeningTime == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // 해당 timeId에 속하는 모든 예약된 좌석 조회
        List<SeatDTO> reservedSeats = seatRepository.findByScreeningTime(screeningTime).stream()
                .filter(Seat::isReserved) // 예약된 좌석만 필터링
                .map(seat -> new SeatDTO(seat.getSeatId(), seat.getSeatNumber(), seat.getScreeningTime().getTimeId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(reservedSeats);
    }


    @GetMapping("/payment/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(@PathVariable Long id) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        PaymentResponseDTO responseDTO = new PaymentResponseDTO();
        responseDTO.setPaymentId(payment.getPaymentId());
        responseDTO.setStatus(payment.getStatus());
        responseDTO.setAmount(payment.getAmount());
        responseDTO.setOrderId(payment.getOrderId());
        responseDTO.setPaymentDate(payment.getPaymentDate());

        // 영화, 상영관, 사용자 정보 등 추가 설정
        if (payment.getScreeningSchedule() != null) {
            responseDTO.setMovieId(payment.getScreeningSchedule().getMovie().getId());  // movieId 설정
        }
        responseDTO.setTheaterName(payment.getScreeningSchedule().getTheater().getTheaterName());
        responseDTO.setUserNum(payment.getUser() != null ? payment.getUser().getUserNum() : null);  // userNum 설정
        responseDTO.setScreeningDate(payment.getScreeningTime().getScreeningSchedule().getScreeningDate());
        responseDTO.setScreeningTime(payment.getScreeningTime().getScreeningTime());
        responseDTO.setTimeId(payment.getScreeningTime().getTimeId());

        // 좌석 정보 변환 및 설정
        List<SeatDTO> seatDTOs = payment.getSeats().stream()
                .map(SeatDTO::new)
                .collect(Collectors.toList());
        responseDTO.setSeats(seatDTOs);

        return ResponseEntity.ok(responseDTO);
    }


}

