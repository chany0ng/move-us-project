package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.MovieDTO;
import com.ucamp.movieus.dto.ReviewRequestDTO;
import com.ucamp.movieus.dto.ReviewResponseDTO;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 리스트 0
    @GetMapping("/reviewList")
    public List<ReviewResponseDTO> reviewList() {
        return reviewService.getReviewList();
    }

    // 회원 리뷰 0
    @GetMapping("/userReview/{user}")
    public List<ReviewResponseDTO> userReview(@PathVariable("user") UserEntity user) {
        return reviewService.getUserReview(user);
    }

    // 영화 리뷰 0
    @GetMapping("/movieReview/{tmdbId}")
    public List<ReviewResponseDTO> movieReview(@PathVariable("tmdbId") Long tmdbId) {
        return reviewService.getMovieReview(tmdbId);
    }

    // 리뷰 등록 0
    @PostMapping
    public ResponseEntity<String> createReview(@Valid @RequestBody ReviewRequestDTO reviewRequestDTO) {
        try {
            reviewService.createReview(reviewRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Review has been created successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the review.");
        }
    }


    // 리뷰 수정 0
    @PutMapping("/{tmdbId}")
    public ResponseEntity<String> updateReview(@PathVariable("tmdbId") Long tmdbId, @Valid @RequestBody ReviewRequestDTO reviewRequestDTO) {
        try {
            reviewService.updateReview(tmdbId, reviewRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Review has been updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            // 모든 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the review.");
        }
    }

    // 리뷰 삭제 0
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable("id") Long id) {
        boolean isDeleted = reviewService.deleteReview(id);
        if (isDeleted) {
            // 삭제 성공
            return ResponseEntity.ok("Review with ID " + id + " has been deleted.");
        } else {
            // 삭제 실패 (존재하지 않는 ID)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Review with ID " + id + " not found.");
        }
    }
}
