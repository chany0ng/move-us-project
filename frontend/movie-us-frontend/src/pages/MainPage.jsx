import { Box, Flex } from "@chakra-ui/react";
import Carousel from "../components/Carousel";
import MovieGrid from "../components/MovieGrid";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import Main from "../layouts/Main";
import { testMovies, wideMovies } from "../assets/contents/movieData";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { getData } from "../api/axios";

const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const fetchData = async () => {
    try {
      const response = await getData("/movies/moviesList");
      console.log(response.data); // response.data로 데이터를 출력합니다
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: "1" }}>
        <Main>
          <Flex direction={"column"}>
            <SearchBar />
            <Box pb={20}>
              <Carousel movies={wideMovies} />
            </Box>
            <MovieGrid title="현재 상영영화 순위" movies={movies} />
            <MovieGrid title="최근 5점 평가 영화" movies={movies} />
          </Flex>
        </Main>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
