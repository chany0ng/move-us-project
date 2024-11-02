package com.ucamp.movieus.service;

import com.ucamp.movieus.entity.FavoriteList;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.repository.FavoriteListRepository;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteListService {

    private final FavoriteListRepository favoriteListRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    // 찜 목록을 조회하는 메서드
    public List<FavoriteList> getUserFavoriteList(UserEntity user) {
        return favoriteListRepository.findAllByUser(user);
    }

    // 찜 목록에 추가하는 메서드
    public boolean addFavorite(FavoriteList favoriteList) {
        UserEntity user = userRepository.findById(favoriteList.getUser().getUserNum()).orElse(null);
        Movie movie = movieRepository.findById(favoriteList.getMovie().getId()).orElse(null);

        if (user != null && movie != null) {
            favoriteListRepository.save(favoriteList);
            return true;
        }
        return false;
    }

    // 찜 목록에서 삭제하는 메서드
    public boolean deleteFavorite(Integer id) {
        if (favoriteListRepository.existsById(id))  {
            favoriteListRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
