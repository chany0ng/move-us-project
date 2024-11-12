package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    @Query(value = "SELECT COUNT(notice_id) FROM notice", nativeQuery = true)
    int countNoticeId();

}
