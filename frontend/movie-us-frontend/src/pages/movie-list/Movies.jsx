import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import { Select } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab } from "@chakra-ui/react";
import MovieTabPanel from "../../components/MovieTabPanel";
import { getData } from "../../api/axios";
import { useEffect, useState } from "react";
import Toast from "./../../components/Toast";
import { useToast } from "@chakra-ui/react";
const GENRES = [
  "All",
  "드라마",
  "액션",
  "SF",
  "공포",
  "애니메이션",
  "로맨스",
  "코미디",
];

const Movies = () => {
  const toast = useToast();
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("latest");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const data = await fetchMovies(genre, sort);
      setMovies(data);
    };

    fetchAndSetMovies();
  }, [genre, sort]);

  const fetchMovies = async (genre, sort) => {
    try {
      const response = await getData("/api/movies", {
        params: { genre, sort },
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    }
  };
  return (
    <Flex direction="column" mt="100px" minHeight="inherit" p={5}>
      <Box color="white" p={5}>
        <Flex align={"center"} gap={3} p={2} mb={3}>
          <AiFillFolder size={40} />
          <Heading fontSize={"4xl"}>영화 조회</Heading>
        </Flex>
        <Flex align={"center"} gap={3} pl={3} color="#cfcfcf">
          <Text fontSize={"lg"} fontWeight={"bold"}>
            총 {movies?.length}건의 영화가 검색되었습니다
          </Text>
        </Flex>
      </Box>

      <Box color="black" p={10} position="relative">
        <Select
          bg="brand.primary"
          width="150px"
          position="absolute"
          border="1px solid white"
          fontWeight={"bold"}
          fontFamily={"NanumSquareRound"}
          top={0}
          right={5}
          _focus={{ border: "1px solid white", boxShadow: "none" }}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="lastest">최신순</option>
          <option value="review">리뷰 많은 순</option>
          <option value="like">좋아요 많은 순</option>
        </Select>
      </Box>
      <Box flex="1" border={"1px solid gray"} color="white" p={5}>
        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          size={"md"}
          onChange={(index) => setGenre(GENRES[index])}
        >
          <TabList gap={10} justifyContent={"center"}>
            {GENRES.map((genre) => (
              <Tab key={genre} width="10%">
                {genre}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <MovieTabPanel key={genre} movies={movies} />
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Movies;
