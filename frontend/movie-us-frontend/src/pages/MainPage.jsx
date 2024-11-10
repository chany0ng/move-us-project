import { Box, Flex, useToast } from "@chakra-ui/react";
import Carousel from "../components/Carousel";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getData } from "../api/axios";
import { wideMovies } from "../assets/contents/movieData";
import { getNowPlayingMovies, getPopularMovies } from "../api/movieAPI";
import { userStore } from "../../store";
const MainPage = () => {
  const { user } = userStore();
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [boxOfficeMovies, setBoxOfficeMovies] = useState([]); // 박스오피스 순위 상태 추가
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const fetchNowPlayingMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getNowPlayingMovies();
      const normalizedMovies = response.data.map(normalizeMovieData);
      setMovies(normalizedMovies);
    } catch (error) {
      toast({
        title: "현재 상영영화 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPopularMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getPopularMovies();
      setPopularMovies(response.data);
    } catch (error) {
      toast({
        title: "인기 영화 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 박스오피스 데이터 가져오는 함수
  const fetchBoxOfficeData = async () => {
    try {
      const response = await getData("/movies/boxoffice");
      setBoxOfficeMovies(
        response.data.map((movie) => {
          return {
            poster_path: movie.posterPath,
            title: movie.movieNm,
            release_date: movie.openDt,
            scrn_cnt: movie.scrnCnt,
          };
        })
      );
    } catch (error) {
      toast({
        title: "박스오피스 데이터 조회 Error",
        description: `Failed to fetch box office movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching box office data:", error);
    }
  };

  // 좋아요 누른 영화 가져오기
  const fetchLikedMovies = async () => {
    try {
      const response = await getData("/movies/moviesList");
      setLikedMovies(response.data);
    } catch (error) {
      toast({
        title: "좋아요 누른 영화 조회 Error",
        description: `Failed to fetch liked movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching liked data:", error);
    }
  };

  const normalizeMovieData = (movie) => {
    return {
      id: movie.tmdbId,
      title: movie.title,
      poster_path: movie.posterPath,
      exists_in_db: movie.exists_in_db || true,
    };
  };

  useEffect(() => {
    fetchNowPlayingMovies();
    fetchPopularMovies();
    fetchBoxOfficeData();
    if (user.user_name) {
      fetchLikedMovies();
    }
  }, []);

  return (
    <Flex direction={"column"}>
      <SearchBar />
      <Box pb={20}>
        <Carousel movies={wideMovies} />
      </Box>
      {likedMovies.length > 0 && (
        <MovieGrid
          title={`${user.user_name}님이 좋아요 누른 영화`}
          movies={likedMovies}
          isLoading={isLoading}
        />
      )}
      <MovieGrid
        title="전세계 상영영화 순위"
        movies={movies}
        isLoading={isLoading}
      />
      <MovieGrid
        title="전체 영화 인기순위"
        movies={popularMovies}
        isLoading={isLoading}
      />
      <MovieGrid
        title="국내 일일 박스오피스 순위"
        movies={boxOfficeMovies}
        isLoading={isLoading}
      />
    </Flex>
  );
};

export default MainPage;
