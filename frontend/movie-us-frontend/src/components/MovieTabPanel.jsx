import { CloseIcon } from "@chakra-ui/icons";
import {
  TabPanel,
  Grid,
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Skeleton,
  SimpleGrid,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import noImage from "../assets/images/image.jpg";

const MovieTabPanel = ({ movies, isLoading }) => {
  console.log(movies);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <SimpleGrid columns={[2, 3, 4, 5]} spacing={8} mt={5}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            height="250px"
            width="200px"
            borderRadius="md"
            startColor="#1f1f1f"
            endColor="#6b6b6b"
          />
        ))}
      </SimpleGrid>
    );
  }

  return movies && movies.length > 0 ? (
    <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={8}>
      {movies.map((movie, index) => (
        <Box
          key={index}
          borderRadius="lg"
          overflow="hidden"
          cursor="pointer"
          onClick={() => navigate(`/movie-detail/${movie.id}`)}
        >
          <Tooltip label={movie.title} hasArrow placement="top">
            <StyledImage
              src={
                movie.poster_path
                  ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
                  : noImage
              }
              alt="No Poster"
            />
          </Tooltip>
          <Text
            p={2}
            height="2em"
            fontWeight="bold"
            textAlign="center"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {movie.title}
          </Text>
        </Box>
      ))}
    </Grid>
  ) : (
    <Flex
      justify={"center"}
      align={"center"}
      direction="column"
      minHeight="inherit"
      gap={5}
    >
      <CloseIcon color="red" />
      <Heading fontSize="lg" fontWeight={"medium"}>
        영화가 존재하지 않습니다!
      </Heading>
      <Button onClick={() => window.location.reload()}>새로고침</Button>
    </Flex>
  );
};

export default MovieTabPanel;

const StyledImage = styled(Image)`
  width: 100%;
  height: 90%;
  object-fit: cover;
`;
