import { Box, Image, SimpleGrid, Skeleton} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SimpleMovieGrid = ({ movies, isLoading}) => {
  return (
    <SimpleGrid columns={5} spacing={5} px={4}>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height="250px" borderRadius="lg" />
          ))
        : movies.map((movie) => (
            <Link key={movie.movieId} to={`/movie-detail/${movie.movieId}`}>
              <MovieBox>
                <ImageWrapper>
                  <StyledImage
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={`Movie ${movie.movieId}`}
                    borderRadius="lg"
                  />
                  <Overlay>
                    <PostCount>
                      REVIEWS
                      <span>{movie.reviewCount}</span>
                    </PostCount>
                    <Rating style={{ color: movie.averageRating >= 5 ? '#FFD700' : '#FF0000' }}>
                      ★ {movie.averageRating?.toFixed(1)}
                    </Rating>
                  </Overlay>
                </ImageWrapper>
              </MovieBox>
            </Link>
          ))}
    </SimpleGrid>
  );
};

const MovieBox = styled(Box)`
  width: 100%;
  height: 100%;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageWrapper = styled(Box)`
  position: relative;
`;

const Overlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: lg;
`;

const PostCount = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-align: center;
  
  font-size: 1.2rem;
  
  span {
    display: block;
    font-size: 2rem;
    margin-top: 0.2rem;
  }
`;

const Rating = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 1rem;
  color: white;
  font-weight: bold;
`;

export default SimpleMovieGrid;