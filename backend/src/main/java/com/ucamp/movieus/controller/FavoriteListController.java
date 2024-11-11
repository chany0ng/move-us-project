package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.FavoriteListResponseDTO;
import com.ucamp.movieus.entity.FavoriteList;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.repository.UserRepository;
import com.ucamp.movieus.service.FavoriteListService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteListController {

    private final UserRepository userRepository;
    private final FavoriteListService favoriteListService;

    // 찜 항목 조회
    @GetMapping("/{userNum}")
    public List<FavoriteListResponseDTO> getUserFavoriteList(@PathVariable("userNum") Integer userNum) {
        UserEntity user = userRepository.findById(userNum).orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteListService.getUserFavoriteList(user);
    }

    // 찜 항목 추가
    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteList favoriteList) {
        boolean isAdded = favoriteListService.addFavorite(favoriteList);
        
        if (isAdded) {
            return ResponseEntity.ok("찜 목록에 추가되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("추가에 실패했습니다.");
        }
    }

    // 찜 항목 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable("id") Integer id) {
        boolean isDeleted = favoriteListService.deleteFavorite(id);
        
        if (isDeleted) {
            return ResponseEntity.ok("찜 목록에서 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제할 찜 항목이 없습니다.");
        }
    }

}
