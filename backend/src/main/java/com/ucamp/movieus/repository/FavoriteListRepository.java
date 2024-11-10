package com.ucamp.movieus.repository;

import com.ucamp.movieus.entity.FavoriteList;
import com.ucamp.movieus.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteListRepository extends JpaRepository<FavoriteList, Integer> {
    List<FavoriteList> findAllByUser(UserEntity user);
    boolean existsByUserAndTmdbId(UserEntity user, Long tmdbId);
}
