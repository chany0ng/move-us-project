package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.FavoriteListResponseDTO;
import com.ucamp.movieus.dto.ReviewResponseDTO;
import com.ucamp.movieus.entity.FavoriteList;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.entity.ReviewEntity;
import com.ucamp.movieus.entity.UserEntity;
import com.ucamp.movieus.repository.FavoriteListRepository;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteListService {

    private final FavoriteListRepository favoriteListRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ModelMapper modelMapper;
    private final RestTemplate restTemplate;

        // 찜 목록을 조회하는 메서드
    public List<FavoriteListResponseDTO> getUserFavoriteList(UserEntity user) {
        // 찜 목록을 DB에서 조회
        List<FavoriteList> favoriteList = favoriteListRepository.findAllByUser(user);

        // FavoriteList 객체를 FavoriteListResponseDTO로 변환하여 반환
        return favoriteList.stream()
                .map(favorite -> convertToResponseDTO(favorite))  // convertToResponseDTO 메서드를 호출하여 DTO로 변환
                .collect(Collectors.toList());
    }

    private final String API_KEY = "40405429a36ddf7b1d4337a022992fbc";
    private final String BASE_URL = "https://api.themoviedb.org/3/movie/";

    private FavoriteListResponseDTO convertToResponseDTO(FavoriteList favorite) {
        Movie movie = movieRepository.findByTmdbId(favorite.getTmdbId())
                .orElse(null);  // 없으면 null 반환
        FavoriteListResponseDTO responseDTO = modelMapper.map(favorite, FavoriteListResponseDTO.class);

        if (movie!=null) {
            responseDTO.setTitle(movie.getTitle()); // 타이틀 추가
            responseDTO.setPosterPath(movie.getPosterPath()); // 포스터 경로 추가
        } else {
            System.out.println("movie=null");
            try {
                Map<String, Object> movieDetails = getMovieDetailsFromApi(favorite.getTmdbId());
                responseDTO.setTitle((String) movieDetails.get("title"));
                Map<String, Object> collection = (Map<String, Object>) movieDetails.get("belongs_to_collection");
                if (collection != null) {
                    responseDTO.setTitle((String) collection.get("name"));
                    responseDTO.setPosterPath((String) collection.get("poster_path")); // 포스터 경로 추가
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return responseDTO;
    }

    private Map<String, Object> getMovieDetailsFromApi(Long tmdbId) {
        String url = BASE_URL + tmdbId + "?api_key=" + API_KEY + "&language=ko-KR";
        return restTemplate.getForObject(url, Map.class);
    }

    // 찜 목록에 추가하는 메서드
    public FavoriteList addFavorite(FavoriteList favoriteList) {
        UserEntity user = userRepository.findById(favoriteList.getUser().getUserNum())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
                
        favoriteList.setUser(user);
        return favoriteListRepository.save(favoriteList);
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
