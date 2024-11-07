import { Box, Flex, useToast } from "@chakra-ui/react";
import Carousel from "../components/Carousel";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getData } from "../api/axios";
import { wideMovies } from "../assets/contents/movieData";
import { getNowPlayingMovies, getPopularMovies } from "../api/movieAPI";
const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const fetchNowPlayingMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getNowPlayingMovies();
      const normalizedMovies = response.data.map(normalizeMovieData);
      console.log(response.data, normalizedMovies); // normalizeMovieData로 데이터를 출력합니다
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
      console.log(response.data); // response.data로 데이터를 출력합니다
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
  }, []);

  return (
    <Flex direction={"column"}>
      <SearchBar />
      <Box pb={20}>
        <Carousel movies={wideMovies} />
      </Box>
      <MovieGrid
        title="현재 상영영화 순위"
        movies={movies}
        isLoading={isLoading}
      />
      <MovieGrid
        title="영화 인기순위"
        movies={popularMovies}
        isLoading={isLoading}
      />
    </Flex>
  );
};

export default MainPage;
