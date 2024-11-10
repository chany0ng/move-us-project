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
import org.modelmapper.ModelMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteListController {
    @Autowired
    private ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final FavoriteListService favoriteListService;

    // 찜 항목 조회
    @GetMapping
    public List<FavoriteList> getUserFavoriteList() {
        UserEntity user = userRepository.findById(1).orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteListService.getUserFavoriteList(user);
    }

    // 찜 항목 추가
    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteList favoriteList) {
        try {
            // 임시로 user 설정 (나중에 인증 구현 후 수정 필요)
            UserEntity user = userRepository.findById(1).orElseThrow(() -> new RuntimeException("User not found"));
            favoriteList.setUser(user);
            
            FavoriteList saved = favoriteListService.addFavorite(favoriteList);
            FavoriteListResponseDTO responseDTO = modelMapper.map(saved, FavoriteListResponseDTO.class);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
