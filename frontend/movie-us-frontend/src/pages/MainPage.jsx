import { Box, Flex, useToast } from "@chakra-ui/react";
import Carousel from "../components/Carousel";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getData } from "../api/axios";
import { testMovies, wideMovies } from "../assets/contents/movieData";
const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const toast = useToast();
  const fetchData = async () => {
    try {
      const response = await getData("/movies/moviesList");
      console.log(response.data); // response.data로 데이터를 출력합니다
      setMovies(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex direction={"column"}>
      <SearchBar />
      <Box pb={20}>
        <Carousel movies={wideMovies} />
      </Box>
      <MovieGrid title="현재 상영영화 순위" movies={movies} />
      <MovieGrid title="최근 5점 평가 영화" movies={movies} />
    </Flex>
  );
};

export default MainPage;
