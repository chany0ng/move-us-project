import { Box, Flex } from "@chakra-ui/react";
import Carousel from "../../components/Carousel";
import MovieGrid from "../../components/MovieGrid";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import Main from "../../layouts/Main";
import { testMovies, wideMovies } from "../../assets/contents/movieData";
import SearchBar from "../../components/SearchBar";

const MainPage = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: "1" }}>
        <Main>
          <Flex direction={"column"}>
            <SearchBar />
            <Box pb={5}>
              <Carousel movies={wideMovies} />
            </Box>
            <MovieGrid title="추천 영화" movies={testMovies} />
            <MovieGrid title="최근 5점 평가 영화" movies={testMovies} />
          </Flex>
        </Main>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
