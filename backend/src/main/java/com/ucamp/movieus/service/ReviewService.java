package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.ReviewRequestDTO;
import com.ucamp.movieus.dto.ReviewResponseDTO;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieService movieService;
    private final ModelMapper modelMapper;

    public List<ReviewResponseDTO> getReviewList() {
        Sort sort = Sort.by(Sort.Direction.ASC, "reviewId");
        List<ReviewEntity> reviews = reviewRepository.findAll(sort);
        return reviews.stream()
                .map(this::convertToResponseDTO) // 변환 메서드 호출
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getUserReview(UserEntity user) {
        List<ReviewEntity> reviews = reviewRepository.findAllByUser(user);
        return reviews.stream()
                .map(this::convertToResponseDTO) // 변환 메서드 호출
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getMovieReview(Long id) {
        List<ReviewEntity> reviews = reviewRepository.findAllByMovieId(movieService.getMovie(id));
        return reviews.stream()
                .map(this::convertToResponseDTO) // 변환 메서드 호출
                .collect(Collectors.toList());
    }

    public void createReview(ReviewRequestDTO reviewRequestDTO) {
        ReviewEntity reviewEntity = modelMapper.map(reviewRequestDTO, ReviewEntity.class); // ModelMapper 사용
        reviewEntity.setReviewDate(LocalDateTime.now()); // 현재 시간으로 리뷰 날짜 설정
        reviewRepository.save(reviewEntity);
    }

    public void updateReview(ReviewRequestDTO reviewRequestDTO) {
        // 기존 리뷰 조회
        ReviewEntity existingReview = reviewRepository.findById(reviewRequestDTO.getReviewId())
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        // ModelMapper를 사용하여 DTO의 값들을 기존 리뷰에 설정
        modelMapper.map(reviewRequestDTO, existingReview);
        existingReview.setReviewDate(LocalDateTime.now()); // 리뷰 수정 시 날짜도 현재로 업데이트
    }


    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true; // 삭제 성공
        }
        return false; // 삭제 실패 (존재하지 않는 ID)
    }

    private ReviewResponseDTO convertToResponseDTO(ReviewEntity review) {
        ReviewResponseDTO responseDTO = modelMapper.map(review, ReviewResponseDTO.class); // ModelMapper 사용
        responseDTO.setPosterPath(review.getMovieId().getPosterPath()); // 포스터 경로 추가
        return responseDTO;
    }
}