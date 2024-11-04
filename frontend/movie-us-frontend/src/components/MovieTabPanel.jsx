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
} from "@chakra-ui/react";

const MovieTabPanel = ({ movies, isLoading }) => {
  return movies ? (
    <TabPanel minHeight="inherit">
      {isLoading ? (
        <SimpleGrid columns={[2, 3, 4]} spacing={6} mt={5}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={index}
              height="250px"
              borderRadius="md"
              startColor="#1f1f1f"
              endColor="#6b6b6b"
            />
          ))}
        </SimpleGrid>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {movies.map((movie) => (
            <Box
              key={movie.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image src={movie.posterUrl} alt={movie.title} />
              <Text p={2} fontWeight="bold" textAlign="center">
                {movie.title}
              </Text>
            </Box>
          ))}
        </Grid>
      )}
    </TabPanel>
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
