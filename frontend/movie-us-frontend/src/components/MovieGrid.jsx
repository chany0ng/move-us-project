import { Box, SimpleGrid, Image, Heading, Text } from "@chakra-ui/react";

const MovieGrid = ({ movies, title }) => {
  return (
    <Box mb={5}>
      <Heading fontSize="3xl" mb={5} color="white" textAlign="left">
        {title}
      </Heading>
      <SimpleGrid
        columns={[1, 2, 3, 4]}
        min-width="100vw"
        spacing={5}
        mb={20}
        borderRadius="xl"
      >
        {movies.map((movie) => (
          <Box
            key={movie.id}
            bg="#3f3f42"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            width="245px" // 또는 원하는 너비 설정
            height="342px" // 원하는 높이로 설정
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              // objectFit="cover"
              height="100%" // 원하는 높이로 설정
              width="100%" // 너비를 100%로 설정
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MovieGrid;
