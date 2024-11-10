import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import { Select } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab } from "@chakra-ui/react";
import MovieTabPanel from "../../components/MovieTabPanel";
import { getData } from "../../api/axios";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터에서 초기값 설정
  const initialGenre =
    new URLSearchParams(location.search).get("genre") || "All";
  const initialSort =
    new URLSearchParams(location.search).get("sort") || "latest";

  const [genre, setGenre] = useState(initialGenre);
  const [sort, setSort] = useState(initialSort);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeMovieData = (movie) => {
    return {
      id: movie.tmdbId,
      title: movie.title,
      poster_path: movie.posterPath,
      exists_in_db: movie.exists_in_db || true,
    };
  };
  useEffect(() => {
    // 네비게이션 바에서 영화 조회 탭을 클릭했을 때 URL을 기본 쿼리로 리셋
    if (location.pathname === "/movies" && !location.search) {
      setGenre("All");
      setSort("latest");
      navigate("?genre=All&sort=latest", { replace: true });
    }
  }, [location, navigate]);
  useEffect(() => {
    const queryParams = new URLSearchParams({ genre, sort });
    navigate(`?${queryParams.toString()}`, { replace: true });

    const fetchAndSetMovies = async () => {
      const nowPlayingMovies = await fetchMovies(genre, sort);
      const popularMovies = await fetchPopularMovies(genre, sort);
      const totalMovies = [...nowPlayingMovies, ...popularMovies];
      setMovies(totalMovies || []);
    };

    fetchAndSetMovies();
  }, [genre, sort]);

  const fetchMovies = async (genre, sort) => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList", {
        params: { genre, sort },
      });
      return response.data.map(normalizeMovieData);
    } catch (error) {
      toast({
        title: "현재 상영 영화 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching NowPlaying data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularMovies = async (genre, sort) => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/allPopularMovies", {
        params: { genre, sort },
      });
      return response.data;
    } catch (error) {
      toast({
        title: "인기 영화 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
  };

  const handleTabChange = (index) => {
    const newGenre = GENRES[index];
    setGenre(newGenre);
  };

  return (
    <Flex direction="column" mt="50px" minHeight="inherit" p={5}>
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

      <Box color="black" p={5} position="relative">
        <Select
          bg="brand.primary"
          width="150px"
          position="absolute"
          border="1px solid black"
          fontWeight={"bold"}
          fontFamily={"NanumSquareRound"}
          top={0}
          right={5}
          _focus={{ border: "1px solid black", boxShadow: "none" }}
          onChange={(e) => handleSortChange(e)}
          value={sort}
        >
          <option value="latest">최신순</option>
          <option value="like">오래된 순</option>
          <option value="review">가나다 순</option>
        </Select>
      </Box>

      <Box flex="1" color="white" p={5}>
        <Tabs
          variant="soft-rounded"
          colorScheme="teal"
          size={"md"}
          onChange={(index) => handleTabChange(index)}
          minHeight="50vh"
          index={GENRES.indexOf(genre)} // Tab의 초기 인덱스 설정
        >
          <TabList gap={10} justifyContent={"center"}>
            {GENRES.map((genre) => (
              <Tab
                key={genre}
                width="10%"
                border="1px solid grey"
                color="white"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {genre}
              </Tab>
            ))}
          </TabList>
          <TabPanels minHeight="inherit" p={10}>
            <MovieTabPanel
              key={`${genre}-${sort}`}
              movies={movies}
              isLoading={isLoading}
            />
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Movies;
