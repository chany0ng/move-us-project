import { Box, SimpleGrid, Image, Heading, Text } from "@chakra-ui/react";

const MovieGrid = ({ movies, title }) => {
  return (
    <Box p={5} py={10} bg="rgba(0,0,0,0.2)" borderRadius="xl">
      <Heading fontSize="3xl" m={5} mb={10} color="white" textAlign="left">
        {title}
      </Heading>
      <SimpleGrid columns={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} spacing={4} p={3}>
        {movies.map((movie) => (
          <Box
            key={movie.id}
            bg="gray.900"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            width="100%" // 또는 원하는 너비 설정
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              // objectFit="cover"
              height="300px" // 원하는 높이로 설정
              width="100%" // 너비를 100%로 설정
            />
            <Box p={4}>
              <Heading size="md" color="white">
                {movie.title}
              </Heading>
              <Text color="gray.300" mt={2}>
                평점: {movie.rating}/5.0
              </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MovieGrid;
