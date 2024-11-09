package com.ucamp.movieus.controller;

import com.ucamp.movieus.dto.NoticeResponseDTO;
import com.ucamp.movieus.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class NoticeRestController {

    @Autowired
    private NoticeService noticeService;

    // 공지사항 조회
    @GetMapping
    public ResponseEntity<List<NoticeResponseDTO>> getNotices() {
        List<NoticeResponseDTO> notices = noticeService.getNotices();
        return ResponseEntity.ok(notices);
    }


    // 특정 ID의 공지사항 조회
    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeResponseDTO> getNoticeById(@PathVariable Integer noticeId) {
        NoticeResponseDTO notice = noticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(notice);
    }
}
