import { Box, SimpleGrid, Image, Heading, Text } from "@chakra-ui/react";

const MovieGrid = ({ movies, title }) => {
  return (
    <Box py={10} bg="rgba(0,0,0,0.7)">
      <Heading 
        fontSize="3xl" 
        m={3}
        color="white"
        textAlign="left"
      >
        {title}
      </Heading>
      <SimpleGrid 
        columns={[1, 2, 3, 4]} 
        spacing={8}
        px={4}
      >
        {movies.map((movie) => (
          <Box 
            key={movie.id}
            bg="gray.800" 
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Image 
              src={movie.posterUrl}
              alt={movie.title}
              width="100%"
              height="400px"
              objectFit="cover"
            />
            <Box p={4}>
              <Heading size="md" color="white">{movie.title}</Heading>
              <Text color="gray.300" mt={2}>평점: {movie.rating}/5.0</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MovieGrid;