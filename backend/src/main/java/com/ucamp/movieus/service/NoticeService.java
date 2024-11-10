package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.NoticeResponseDTO;
import com.ucamp.movieus.entity.Notice;
import com.ucamp.movieus.exception.BusinessException;
import com.ucamp.movieus.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final ModelMapper modelMapper;

    public List<NoticeResponseDTO> getNotices() {
        List<Notice> notices = noticeRepository.findAll();
        // List<Notice>를 List<NoticeResponseDTO>로 변환
        return notices.stream()
                .map(entity -> modelMapper.map(entity, NoticeResponseDTO.class))
                .toList();
    }

    public NoticeResponseDTO getNoticeById(Integer noticeId) {
        return noticeRepository.findById(noticeId)
                .map(entity -> modelMapper.map(entity, NoticeResponseDTO.class))
                .orElseThrow(() -> new BusinessException("Notice not found with id " + noticeId));
    }

}
