package com.ucamp.movieus.service;

import com.ucamp.movieus.dto.DailyBoxOfficeDTO;
import com.ucamp.movieus.dto.DailyBoxOfficeResponse;
import com.ucamp.movieus.dto.MovieDTO;
import com.ucamp.movieus.dto.TMDBResponse;
import com.ucamp.movieus.entity.DailyBoxOffice;
import com.ucamp.movieus.entity.Genre;
import com.ucamp.movieus.entity.Movie;
import com.ucamp.movieus.repository.DailyBoxOfficeRepository;
import com.ucamp.movieus.repository.GenreRepository;
import com.ucamp.movieus.repository.MovieRepository;
import com.ucamp.movieus.repository.ReviewRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;
    private final String API_KEY = "40405429a36ddf7b1d4337a022992fbc";
    private final String BASE_URL = "https://api.themoviedb.org/3/movie/";
    private final DailyBoxOfficeRepository dailyBoxOfficeRepository;
    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);


    @Value("${kofic.api.key}")
    private String apiKey;
    @PostConstruct
    public void init() {
        fetchAndSaveNowPlayingMovies(); // 애플리케이션 시작 시 데이터 로딩
        String targetDate = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 어제 날짜
        fetchAndSaveDailyBoxOffice(apiKey, targetDate);
    }

    public void fetchAndSaveNowPlayingMovies() {
        List<Movie> movies = fetchMoviesFromApi();
        List<Movie> existingMovies = movieRepository.findAll();

        Map<Long, Movie> existingMovieMap = existingMovies.stream()
                .collect(Collectors.toMap(Movie::getTmdbId, Function.identity()));

        Set<Long> currentTmdbIds = new HashSet<>();

        // 랭킹 설정
        int rank = 1; // 랭킹은 1부터 시작

        for (Movie movie : movies) {
            currentTmdbIds.add(movie.getTmdbId());
            movie.setRanking(rank++); // 랭킹 설정

            if (existingMovieMap.containsKey(movie.getTmdbId())) {
                Movie existingMovie = existingMovieMap.get(movie.getTmdbId());
                updateMovie(existingMovie, movie);
            } else {
                movieRepository.save(movie);
            }
        }

        // 상영 종료된 영화 처리 (예: 상태 변경 또는 삭제)
        List<Movie> moviesToDelete = existingMovies.stream()
                .filter(movie -> !currentTmdbIds.contains(movie.getTmdbId()))
                .collect(Collectors.toList());
        movieRepository.deleteAll(moviesToDelete);
    }

    private List<Movie> fetchMoviesFromApi() {
        TMDBResponse response;
        int page = 1;
        List<Movie> allMovies = new ArrayList<>();

        do {
            String url = String.format(
                    "%snow_playing?api_key=%s&region=KR&language=ko&sort_by=popularity.desc&page=%d",
                    BASE_URL, API_KEY, page);
            response = restTemplate.getForObject(url, TMDBResponse.class);

            if (response != null && response.getResults() != null) {
                List<Movie> movies = response.toMovies(genreRepository); // GenreRepository를 사용하여 Movie로 변환
                allMovies.addAll(movies);
                page++;
            }
        } while (response != null && page <= response.getTotalPages());

        return allMovies;
    }

    // 기존 Movie 객체 업데이트
    private void updateMovie(Movie existingMovie, Movie newMovie) {
        existingMovie.setTitle(newMovie.getTitle());
        existingMovie.setOriginalTitle(newMovie.getOriginalTitle());
        existingMovie.setOverview(newMovie.getOverview());
        existingMovie.setPosterPath(newMovie.getPosterPath());
        existingMovie.setBackdropPath(newMovie.getBackdropPath());
        existingMovie.setPopularity(newMovie.getPopularity());
        existingMovie.setVoteAverage(newMovie.getVoteAverage());
        existingMovie.setVoteCount(newMovie.getVoteCount());
        existingMovie.setReleaseDate(newMovie.getReleaseDate());
        existingMovie.setGenres(newMovie.getGenres());
    }

    public Movie getMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with ID: " + id));
    }

    public List<Movie> getMoviesByGenreName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }

    public Object getMovieCredits(Long movieId) {
        String url = BASE_URL + movieId + "/credits?api_key=" + API_KEY + "&language=ko-KR";
        return restTemplate.getForObject(url, Object.class);
    }

    public Object getMovieDetail(Long movieId) {
        String url = BASE_URL + movieId + "?api_key=" + API_KEY + "&language=ko-KR";
        return restTemplate.getForObject(url, Object.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPopularMovies() {
        List<Map<String, Object>> moviesWithDbInfo = new ArrayList<>();

        // DB에 저장된 영화의 TMDB ID 목록 가져오기
        List<Integer> dbMovieIds = movieRepository.findAllTmdbIds();
        Set<Integer> dbMovieIdSet = new HashSet<>(dbMovieIds);

        // TMDB API에서 인기 영화 목록 가져오기
        String url = BASE_URL + "popular?api_key=" + API_KEY + "&language=ko-KR&region=KR";

        // TMDB API 요청
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");

        // API에서 가져온 영화 목록에 DB 존재 여부 표시
        for (Map<String, Object> movie : movies) {
            Integer tmdbId = (Integer) movie.get("id");
            boolean existsInDb = dbMovieIdSet.contains(tmdbId);

            // exists_in_db 필드 추가
            movie.put("exists_in_db", existsInDb);
            moviesWithDbInfo.add(movie);
        }

        return moviesWithDbInfo;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAllPopularMovies() {
        List<Map<String, Object>> moviesWithDbInfo = new ArrayList<>();

        // DB에 저장된 영화의 TMDB ID 목록 가져오기
        List<Integer> dbMovieIds = movieRepository.findAllTmdbIds();
        Set<Integer> dbMovieIdSet = new HashSet<>(dbMovieIds);

        // 1페이지부터 5페이지까지 TMDB API에서 인기 영화 목록 가져오기
        for (int page = 1; page <= 10; page++) {
            String url = BASE_URL + "popular?api_key=" + API_KEY + "&language=ko-KR&region=KR&page=" + page;

            // TMDB API 요청
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");

            // API에서 가져온 영화 목록에 DB 존재 여부 표시
            for (Map<String, Object> movie : movies) {
                Integer tmdbId = (Integer) movie.get("id");
                boolean existsInDb = dbMovieIdSet.contains(tmdbId);

                // exists_in_db 필드 추가
                movie.put("exists_in_db", existsInDb);
                if (!existsInDb) {
                    moviesWithDbInfo.add(movie);
                }
            }
        }

        return moviesWithDbInfo;
    }

    public List<Map<String, Object>> getPopularMoviesByGenre(String genreName) {
        List<Map<String, Object>> moviesWithDbInfo = new ArrayList<>();

        // DB에서 TMDB ID 목록 가져오기
        List<Integer> dbMovieIds = movieRepository.findAllTmdbIds();
        Set<Integer> dbMovieIdSet = new HashSet<>(dbMovieIds);

        // DB에서 장르명으로 TMDB 장르 ID 조회
        Integer genreId = genreRepository.findIdByName(genreName);
        if (genreId == null) {
            throw new IllegalArgumentException("해당 장르를 찾을 수 없습니다: " + genreName);
        }

        // TMDB API 요청 (1~5페이지)
        for (int page = 1; page <= 5; page++) {
            String url = "https://api.themoviedb.org/3/discover/movie"
                    + "?api_key=" + API_KEY
                    + "&language=ko-KR"
                    + "&region=KR"
                    + "&with_genres=" + genreId
                    + "&page=" + page;

            // TMDB API 요청
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");

            // API에서 가져온 영화 목록에 DB 존재 여부 표시
            for (Map<String, Object> movie : movies) {
                Integer tmdbId = (Integer) movie.get("id");
                boolean existsInDb = dbMovieIdSet.contains(tmdbId);

                // exists_in_db 필드 추가
                movie.put("exists_in_db", existsInDb);
                if(!existsInDb){
                    moviesWithDbInfo.add(movie);
                }
            }
        }

        return moviesWithDbInfo;
    }

    public void fetchAndSaveDailyBoxOffice(String apiKey, String targetDate) {
        String url = "https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=" + apiKey + "&targetDt=" + targetDate;
        DailyBoxOfficeResponse response = restTemplate.getForObject(url, DailyBoxOfficeResponse.class);

        if (response != null && response.getBoxOfficeResult() != null) {
            List<DailyBoxOffice> boxOfficeList = response.getBoxOfficeResult().getDailyBoxOfficeList().stream()
                    .map(this::convertToEntity)
                    .collect(Collectors.toList());

            // 포스터 경로 설정
            setPosterPathsForBoxOffice(boxOfficeList);

            dailyBoxOfficeRepository.saveAll(boxOfficeList);
        }
    }

    private void setPosterPathsForBoxOffice(List<DailyBoxOffice> boxOfficeList) {
        String baseImageUrl = "https://image.tmdb.org/t/p/w500"; // TMDB 기본 이미지 URL

        for (DailyBoxOffice boxOffice : boxOfficeList) {
            Optional<String> optionalPosterPath = movieRepository.findPosterPathByTitleIgnoreCase(boxOffice.getMovieNm());

            if (optionalPosterPath.isPresent()) {
                String fullPosterPath = baseImageUrl + optionalPosterPath.get();
                boxOffice.setPosterPath(fullPosterPath);
                logger.info("포스터 URL 설정됨: " + boxOffice.getMovieNm() + " -> " + fullPosterPath);
            } else {
                logger.warn("포스터 URL이 설정되지 않음: " + boxOffice.getMovieNm());
            }
        }
        dailyBoxOfficeRepository.saveAll(boxOfficeList);
    }


    public List<DailyBoxOffice> getAllOrderedByRank() {
        return dailyBoxOfficeRepository.findAll(Sort.by(Sort.Order.asc("rank"))); // rank로 오름차순 정렬
    }

    private DailyBoxOffice convertToEntity(DailyBoxOfficeDTO dto) {
        DailyBoxOffice entity = new DailyBoxOffice();
        entity.setRank(dto.getRank()); // DTO에서 rank를 int로 변환하여 설정
        entity.setMovieCd(dto.getMovieCd());
        entity.setMovieNm(dto.getMovieNm());
        entity.setOpenDt(dto.getOpenDt());
        entity.setScrnCnt(dto.getScrnCnt());
        entity.setAudiAcc(dto.getAudiAcc());
        return entity;
    }

    public List<DailyBoxOfficeDTO> getAllOrderedByRankAsDTO() {
        return dailyBoxOfficeRepository.findAll(Sort.by(Sort.Order.asc("rank")))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DailyBoxOfficeDTO convertToDTO(DailyBoxOffice boxOffice) {
        DailyBoxOfficeDTO dto = new DailyBoxOfficeDTO();
        dto.setMovieCd(boxOffice.getMovieCd());
        dto.setRank(boxOffice.getRank());
        dto.setMovieNm(boxOffice.getMovieNm());
        dto.setOpenDt(boxOffice.getOpenDt());
        dto.setScrnCnt(boxOffice.getScrnCnt());
        dto.setAudiAcc(boxOffice.getAudiAcc());
        dto.setPosterPath(boxOffice.getPosterPath()); // 포스터 경로 설정
        return dto;
    }
    public List<Map<String, Object>> searchMoviesByTitle(String searchQuery) {
        System.out.println("Search query: " + searchQuery); // 검색어 확인

        // API에서 인기 영화 데이터 가져오기
        List<Map<String, Object>> apiMovies = getAllPopularMovies();
        List<Map<String, Object>> allMovies = new ArrayList<>();

        // exists_in_db가 false인 영화만 allMovies에 추가
        for (Map<String, Object> movie : apiMovies) {
            Boolean existsInDb = (Boolean) movie.get("exists_in_db"); // exists_in_db 값 가져오기
            if (existsInDb != null && !existsInDb) { // exists_in_db가 false인 경우
                allMovies.add(movie);
            }
        }

        // DB에서 모든 영화 데이터 가져오기 (MovieRepository 호출)
        List<Movie> dbMovies = movieRepository.findAll();
        for (Movie dbMovie : dbMovies) {
            // DB 데이터를 Map 형태로 변환 후 allMovies에 추가
            Map<String, Object> movieMap = new HashMap<>();
            movieMap.put("id", dbMovie.getId());
            movieMap.put("title", dbMovie.getTitle());
            movieMap.put("original_title", dbMovie.getOriginalTitle());
            movieMap.put("poster_path", dbMovie.getPosterPath());
            movieMap.put("exists_in_db", true); // DB에 있는 영화는 exists_in_db를 true로 설정
            allMovies.add(movieMap);
        }

        // 검색어에서 공백 제거
        String cleanedSearchQuery = searchQuery.replaceAll("\\s+", "").toLowerCase(); // 공백 제거 후 소문자 처리
        List<Map<String, Object>> filteredMovies = new ArrayList<>();

        // 이름으로 검색 (대소문자 구분 없이)
        for (Map<String, Object> movie : allMovies) {
            String title = (String) movie.get("title");
            String originalTitle = (String) movie.get("original_title");

            // 각 영화 제목과 original_title 확인
            System.out.println("Checking movie: " + title + " / " + originalTitle);

            // title 또는 original_title에서 공백을 제거한 후 검색어와 비교
            if ((title != null && title.replaceAll("\\s+", "").toLowerCase().contains(cleanedSearchQuery)) ||
                    (originalTitle != null && originalTitle.replaceAll("\\s+", "").toLowerCase().contains(cleanedSearchQuery))) {
                filteredMovies.add(movie);
            }
        }

        return filteredMovies;
    }

    public List<Map<String, Object>> getMoviesSortedByReviewCountAndGenre(List<Map<String, Object>> apiMovies, String genreName) {
        System.out.println("Service method invoked");
        List<Map<String, Object>> allMovies = new ArrayList<>();

        // 1. TMDB API에서 영화 목록 가져오기
        System.out.println("API Movies: " + apiMovies);
        if (apiMovies == null || apiMovies.isEmpty()) {
            System.out.println("No movies fetched from TMDB API");
        } else {
            for (Map<String, Object> movie : apiMovies) {
                Object idObject = movie.get("id");
                Long tmdbId;

                // 안전하게 ID를 Long으로 변환
                if (idObject instanceof Integer) {
                    tmdbId = ((Integer) idObject).longValue();
                } else if (idObject instanceof Long) {
                    tmdbId = (Long) idObject;
                } else {
                    throw new IllegalArgumentException("Invalid ID type: " + idObject.getClass().getName());
                }

                Integer reviewCount = getReviewCount(tmdbId); // 리뷰 개수 가져오기
                System.out.println("Review count for TMDB ID " + tmdbId + ": " + reviewCount);
                movie.put("reviewCount", reviewCount); // 리뷰 개수 추가

                // 장르 추가
                movie.put("genres", movie.get("genres")); // API에서 장르 리스트를 그대로 사용

                allMovies.add(movie);
            }
        }

        // 2. DB에서 영화 데이터 가져오기
        List<Movie> dbMovies = movieRepository.findAllByOrderByRankingAsc();
        System.out.println("findAllByOrderByRankingAsc()");
        if (dbMovies != null && !dbMovies.isEmpty()) {
            for (Movie dbMovie : dbMovies) {
                Long tmdbId = dbMovie.getTmdbId();

                if (tmdbId != null) {
                    Map<String, Object> movieMap = new HashMap<>();
                    movieMap.put("id", tmdbId);
                    movieMap.put("title", dbMovie.getTitle());
                    movieMap.put("original_title", dbMovie.getOriginalTitle());
                    movieMap.put("poster_path", dbMovie.getPosterPath());
                    movieMap.put("exists_in_db", true); // DB에서 가져온 데이터임을 표시

                    // DB 영화의 장르 리스트 추가
                    Set<Genre> genres = dbMovie.getGenres(); // DB에서 장르 Set 가져오기
                    movieMap.put("genres", genres);

                    Integer reviewCount = getReviewCount(tmdbId);
                    movieMap.put("reviewCount", reviewCount);

                    allMovies.add(movieMap);
                }
            }
        }

        // 3. 장르 필터링 (genreName이 제공된 경우에만)
        List<Map<String, Object>> filteredMovies;
        if (genreName != null && !genreName.isBlank()) {
            filteredMovies = allMovies.stream()
                    .filter(movie -> {
                        Set<Genre> genres = (Set<Genre>) movie.get("genres");
                        if (genres == null) return false;
                        return genres.stream().anyMatch(genre -> genreName.equalsIgnoreCase(genre.getName()));
                    })
                    .collect(Collectors.toList());
        } else {
            // 장르 필터링 없이 모든 영화 사용
            filteredMovies = allMovies;
        }

        // 4. 리뷰 개수를 기준으로 내림차순 정렬
        List<Map<String, Object>> sortedMovies = filteredMovies.stream()
                .sorted((movie1, movie2) -> {
                    Integer reviewCount1 = (Integer) movie1.get("reviewCount");
                    Integer reviewCount2 = (Integer) movie2.get("reviewCount");
                    return reviewCount2.compareTo(reviewCount1); // 리뷰 수가 많을수록 우선
                })
                .collect(Collectors.toList());

        System.out.println("Sorted and Filtered Movies: " + sortedMovies);
        return sortedMovies;
    }


    // TMDB ID로 해당 영화의 리뷰 개수를 가져오는 메서드
    private Integer getReviewCount(Long tmdbId) {
        System.out.println("getReviewCount: " + tmdbId);

        // countByTmdbId가 null을 반환할 가능성이 있다면 처리
        Integer count = reviewRepository.countByTmdbId(tmdbId);
        return count != null ? count : 0; // null인 경우 0을 반환
    }
    public List<Map<String, Object>> getAllPopularMovies2() {
        List<Map<String, Object>> moviesWithDbInfo = new ArrayList<>();

        // DB에 저장된 영화의 TMDB ID 목록 가져오기
        List<Integer> dbMovieIds = movieRepository.findAllTmdbIds();
        Set<Integer> dbMovieIdSet = new HashSet<>(dbMovieIds);

        // 1페이지부터 5페이지까지 TMDB API에서 인기 영화 목록 가져오기
        for (int page = 1; page <= 5; page++) {
            String url = BASE_URL + "popular?api_key=" + API_KEY + "&language=ko-KR&region=KR&page=" + page;

            // TMDB API 요청
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");

            // API에서 가져온 영화 목록에 DB 존재 여부 표시
            for (Map<String, Object> movie : movies) {
                Integer tmdbId = (Integer) movie.get("id");
                boolean existsInDb = dbMovieIdSet.contains(tmdbId);

                // exists_in_db 필드 추가
                movie.put("exists_in_db", existsInDb);
                if (!existsInDb) {
                    moviesWithDbInfo.add(movie);
                }
            }
        }

        return moviesWithDbInfo;
    }


}