package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.ReviewRequestDTO;
import com.ucamp.movieus.dto.ReviewResponseDTO;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.ReviewRepository;
import com.ucamp.movieus.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
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

    public List<ReviewResponseDTO> getMovieReview(Long tmdbId) {
        Movie movie = movieRepository.findByTmdbId(tmdbId)
                .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));
        List<ReviewEntity> reviews = reviewRepository.findAllByMovieId(movie);
        return reviews.stream()
                .map(this::convertToResponseDTO) // 변환 메서드 호출
                .collect(Collectors.toList());
    }

    public void createReview(ReviewRequestDTO reviewRequestDTO) {
        // Movie와 User를 각각 조회
        Movie movie = movieRepository.findByTmdbId(reviewRequestDTO.getMovieId())
                .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));
        UserEntity user = userRepository.findByUserNum(reviewRequestDTO.getUserNum())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 이미 해당 사용자가 해당 영화에 리뷰를 작성했는지 확인
        Optional<ReviewEntity> existingReview = reviewRepository.findByMovieIdAndUser(movie, user);

        if (existingReview.isPresent()) {
            throw new RuntimeException("해당 영화에 대한 리뷰가 이미 존재합니다.");
        }

        ReviewEntity reviewEntity = modelMapper.map(reviewRequestDTO, ReviewEntity.class);
        reviewEntity.setUser(user);  // User 설정
        reviewEntity.setMovieId(movie);  // Movie 설정
        reviewEntity.setReviewDate(LocalDateTime.now());  // 리뷰 날짜 설정

        // ReviewEntity 저장
        reviewRepository.save(reviewEntity);
    }

    public void updateReview(Long tmdbId, ReviewRequestDTO reviewRequestDTO) {
        // 기존 리뷰 조회
        ReviewEntity existingReview = reviewRepository.findById(reviewRequestDTO.getReviewId())
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        // Movie를 tmdbId로 조회
        Movie movie = movieRepository.findByTmdbId(tmdbId)
                .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));

        // Rating & Comment update
        existingReview.setRating(reviewRequestDTO.getRating());
        existingReview.setComment(reviewRequestDTO.getComment());

        // 리뷰 수정 시 날짜 현재로 업데이트
        existingReview.setReviewDate(LocalDateTime.now());
    }

    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true; // 삭제 성공
        }
        return false; // 삭제 실패 (존재하지 않는 ID)
    }

    private ReviewResponseDTO convertToResponseDTO(ReviewEntity review) {
        Movie movie = review.getMovieId();
        ReviewResponseDTO responseDTO = modelMapper.map(review, ReviewResponseDTO.class);
        if (movie != null) {
            responseDTO.setTmdbId(movie.getTmdbId()); // TMDb ID 추가
            responseDTO.setTitle(movie.getTitle()); // 타이틀 추가
            responseDTO.setPosterPath(movie.getPosterPath()); // 포스터 경로 추가
        }
        return responseDTO;
    }
}
