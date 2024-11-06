import { Box, Image, SimpleGrid, Skeleton} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SimpleMovieGrid = ({ movies, isLoading }) => {
  // 더미 데이터를 위한 랜덤 숫자 생성 함수
  const getRandomPostCount = () => Math.floor(Math.random() * 200) + 1;

  return (
    <SimpleGrid columns={5} spacing={5} px={4}>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height="250px" borderRadius="lg" />
          ))
        : movies.map((movie) => (
            <Link key={movie.id} to={`/movie-detail/${movie.tmdbId}`}>
              <MovieBox>
                <ImageWrapper>
                  <StyledImage
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    borderRadius="lg"
                  />
                  <Overlay>
                    <PostCount>
                      POST
                      <span>{getRandomPostCount()}</span>
                    </PostCount>
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
  
  // POST 텍스트 스타일
  font-size: 1.2rem;
  
  // 숫자 스타일
  span {
    display: block;
    font-size: 2rem;  // 더 큰 폰트 사이즈
    margin-top: 0.2rem;  // POST와 숫자 사이 간격
  }
`;

export default SimpleMovieGrid;