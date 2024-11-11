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
                            , UserRepository userRepository
                            , ScreeningScheduleRepository screeningScheduleRepository
                            , SeatRepository seatRepository
                            , ScreeningTimeRepository screeningTimeRepository) {
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
//        String orderId = UUID.randomUUID().toString(); // 고유한 orderId 생성
//        String orderName = paymentRequestDTO.getOrderName();
//
//        // 결제 정보를 데이터베이스에 저장
//        Payment payment = new Payment();
//        payment.setPaymentMethod("카드");
//        payment.setAmount(amount);
//        payment.setStatus("PENDING");
//        payment.setPaymentDate(LocalDateTime.now());
//        payment.setOrderId(orderId); // orderId 설정
//
//        payment = paymentRepository.save(payment);
//
//        // 성공 및 실패 URL 설정
//        String completeUrl = "http://localhost:8080/api/v1/payments/toss/complete"; // complete URL
//        String failUrl = "http://localhost:8080/api/v1/payments/toss/fail";
//
//        // 응답 데이터
//        response.put("paymentMethod", "카드");
//        response.put("amount", amount);
//        response.put("orderId", orderId);
//        response.put("orderName", orderName);
//        response.put("successUrl", completeUrl); // complete URL을 사용
//        response.put("failUrl", failUrl);
//        response.put("paymentId", payment.getPaymentId());
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
@PostMapping("/toss")
@ResponseBody
public ResponseEntity<Map<String, Object>> createPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) {
    Map<String, Object> response = new HashMap<>();

    // 요청에서 필요한 데이터 추출
    int amount = paymentRequestDTO.getAmount();
    String orderId = UUID.randomUUID().toString(); // 고유한 orderId 생성
    String orderName = paymentRequestDTO.getOrderName();
    String paymentMethod = paymentRequestDTO.getPaymentMethod();
    Long movieId = paymentRequestDTO.getMovieId();
    int theaterId = paymentRequestDTO.getTheaterId();
    Long timeId = paymentRequestDTO.getTimeId();
    int userNum = paymentRequestDTO.getUserNum();
    Long screeningScheduleId = paymentRequestDTO.getScreeningScheduleId();
    LocalDate screeningDate = paymentRequestDTO.getScreeningDate();
    LocalTime screeningTime = paymentRequestDTO.getScreeningTime();

    // 좌석 ID 리스트 처리
    List<String> seatIds = paymentRequestDTO.getSeatIds();
    List<Seat> seats = new ArrayList<>();

    if (seatIds == null || seatIds.isEmpty()) {
        System.out.println("seatIds 리스트가 비어 있습니다.");
    } else {
        for (String seatId : seatIds) {
            if (seatId != null && !seatId.isEmpty()) {
                try {
                    Seat seatEntity = seatRepository.findById(Integer.parseInt(seatId)).orElse(null);
                    if (seatEntity != null) {
                        seats.add(seatEntity);
                    } else {
                        System.out.println("Seat with ID " + seatId + " not found.");
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid seatId format: " + seatId);
                }
            } else {
                System.out.println("seatId가 null이거나 빈 문자열입니다.");
            }
        }
    }
    System.out.println("amount: " + amount);
    System.out.println("orderId: " + orderId);
    System.out.println("orderName: " + orderName);
    System.out.println("paymentMethod: " + paymentMethod);
    System.out.println("movieId: " + movieId);
    System.out.println("theaterId: " + theaterId);
    System.out.println("timeId: " + timeId);
    System.out.println("userNum: " + userNum);
    System.out.println("screeningDate: " + screeningDate);
    System.out.println("screeningTime: " + screeningTime);
    System.out.println("seatIds: " + seatIds);

    System.out.println("Received screeningScheduleId: " + screeningScheduleId);

    // 결제 정보를 데이터베이스에 저장
    Payment payment = new Payment();
    payment.setPaymentMethod(paymentMethod);
    payment.setAmount(amount);
    payment.setStatus("PENDING");
    payment.setPaymentDate(LocalDateTime.now());
    payment.setOrderId(orderId);

    // UserEntity 설정
    UserEntity user = userRepository.findById(userNum).orElse(null);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User not found"));
    }
    payment.setUser(user);

    // ScreeningSchedule 설정
    ScreeningSchedule screeningSchedule = screeningScheduleRepository.findById(screeningScheduleId).orElse(null);
    if (screeningSchedule == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening schedule not found"));
    }
    payment.setScreeningSchedule(screeningSchedule);

    System.out.println("Set ScreeningSchedule with ID: " + screeningSchedule.getScheduleId());

    // ScreeningTime 설정
    ScreeningTime screeningTimeEntity = screeningTimeRepository.findById(timeId).orElse(null);
    if (screeningTimeEntity == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Screening time not found"));
    }
    payment.setScreeningTime(screeningTimeEntity);

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
    response.put("seatIds", seatIds);
    response.put("screeningScheduleId", screeningScheduleId);

    return new ResponseEntity<>(response, HttpStatus.OK);
}


    @GetMapping("/toss/complete")
    public ResponseEntity<String> completePaymentGet(@RequestParam Map<String, String> requestParams) {
        System.out.println("Received request parameters: " + requestParams);

        String paymentKey = requestParams.get("paymentKey");
        String orderId = requestParams.get("orderId");
        String amountStr = requestParams.get("amount");

        if (paymentKey == null || orderId == null || amountStr == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Required parameters are missing");
        }

        int amount;
        try {
            amount = Integer.parseInt(amountStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Amount is not a valid integer");
        }

        // 결제 검증 호출
        boolean isPaymentSuccessful = paymentService.verifyPayment(paymentKey, orderId, amount);

        if (isPaymentSuccessful) {
            Payment payment = paymentService.findPaymentByOrderId(orderId);

            if (payment == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not found.");
            }

            // 결제 성공 시 paymentKey와 상태를 업데이트하고 저장
            payment.setPaymentKey(paymentKey);
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);  // paymentRepository.save(payment); 호출로 데이터베이스에 저장

            // 결제 성공 시 예약된 좌석 상태를 is_reserved = true로 변경
            List<Seat> seats = payment.getSeats();
            for (Seat seat : seats) {
                seat.setReserved(true);  // 좌석 예약 상태 업데이트
            }
            seatRepository.saveAll(seats);  // 좌석 정보 업데이트

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", "/api/v1/payments/toss/success?paymentId=" + payment.getPaymentId() + "&orderId=" + orderId)
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed.");
        }
    }

////잠시
////    @GetMapping("/toss/complete")
////    public ResponseEntity<String> completePaymentGet(@RequestParam Map<String, String> requestParams) {
////        String paymentKey = requestParams.get("paymentKey");
////        String orderId = requestParams.get("orderId");
////        int amount = Integer.parseInt(requestParams.get("amount"));
////
////        // 결제 검증 호출
////        boolean isPaymentSuccessful = paymentService.verifyPayment(paymentKey, orderId, amount);
////
////        if (isPaymentSuccessful) {
////            Payment payment = paymentService.findPaymentByOrderId(orderId);
////
////            if (payment == null) {
////                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not found.");
////            }
////
////            paymentService.updatePaymentStatus(orderId, "SUCCESS");
////            return ResponseEntity.status(HttpStatus.FOUND)
////                    .header("Location", "/api/v1/payments/toss/success?paymentId=" + payment.getPaymentId() + "&orderId=" + orderId)
////                    .build();
////        } else {
////            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed.");
////        }
////    }

    // 결제 성공 페이지
//    @GetMapping("/toss/success")
//    public String paymentSuccess(@RequestParam Long paymentId, Model model) {
//        Payment payment = paymentRepository.findByPaymentId(paymentId);
//        if (payment != null) {
//            PaymentResponseDTO responseDTO = new PaymentResponseDTO();
//            responseDTO.setPaymentId(payment.getPaymentId());
//            responseDTO.setStatus(payment.getStatus());
//            responseDTO.setMessage("결제가 성공적으로 완료되었습니다!");
//            responseDTO.setAmount(payment.getAmount());
//            responseDTO.setOrderId(payment.getOrderId());
//            responseDTO.setPaymentDate(payment.getPaymentDate());
//
//            model.addAttribute("paymentResponse", responseDTO);
//        } else {
//            model.addAttribute("error", "결제 정보를 찾을 수 없습니다.");
//        }
//        return "success"; // success.html로 리턴
//    }

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
                responseDTO.setTheaterId(payment.getScreeningSchedule().getTheater().getTheaterId());
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



    @PostMapping("/toss/cancel")
    @ResponseBody
    public ResponseEntity<String> cancelPayment(@RequestParam String paymentKey,
                                                @RequestParam String cancelReason) {
        boolean isCancelled = paymentService.cancelPayment(paymentKey, cancelReason);

        if (isCancelled) {
            // 결제 취소 성공 시 상태를 "CANCEL"로 업데이트
            paymentService.updatePaymentStatusByPaymentKey(paymentKey, "CANCEL");
            return ResponseEntity.ok("Payment cancelled successfully.");
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



}

