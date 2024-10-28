import { Box, Container } from "@chakra-ui/react";
import Carousel from '../components/Carousel.jsx';
import Navigator from '../components/Navigator.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import { testMovies, wideMovies } from '../assets/contents/movieData';

const Main = () => {
  return (
    <Container maxW="container.xl">
      <Navigator />
      <Box bg="brand.black" minH="70vh" py={10}>
        <Container maxW="container.xl" px={0} pt={8}>
          <Box mb={0}>
            <Carousel 
              movies={wideMovies} 
              height="200px" 
              width="100%" 
            />
          </Box>
        </Container>
      </Box>

      <MovieGrid title="추천 영화" movies={testMovies} />
      <MovieGrid title="최근 5점 평가 영화" movies={testMovies} />
    </Container>
  );
};

export default Main;