import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import {
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  useToast,
} from "@chakra-ui/react";
import MovieTabPanel from "../../components/MovieTabPanel";
import { getData } from "../../api/axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

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

  const initialGenre =
    new URLSearchParams(location.search).get("genre") || "All";
  const initialSort =
    new URLSearchParams(location.search).get("sort") || "popular";

  const [genre, setGenre] = useState(initialGenre);
  const [sort, setSort] = useState(initialSort);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeMovieData = (movie) => {
    return {
      id: movie.tmdbId,
      title: movie.title,
      poster_path: movie.posterPath,
      exists_in_db: movie.exists_in_db || true,
    };
  };

  useEffect(() => {
    if (location.pathname === "/movies" && !location.search) {
      setGenre("All");
      setSort("popular");
      navigate("?genre=All&sort=popular", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (searchQuery || sort === "review") return;

    const queryParams = new URLSearchParams({ genre, sort });
    navigate(`?${queryParams.toString()}`, { replace: true });

    const fetchAndSetMovies = async () => {
      const nowPlayingMovies = await fetchMovies(genre);
      const popularMovies = await fetchPopularMovies(genre);
      const totalMovies = [...nowPlayingMovies, ...popularMovies];
      setMovies(totalMovies || []);
    };

    fetchAndSetMovies();
  }, [genre, sort, searchQuery]);

  const fetchMovies = async (genre) => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList", {
        params: { genre },
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

  const fetchPopularMovies = async (genre) => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/allPopularMovies", {
        params: { genre },
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
    if (newSort === "review") {
      setSort(newSort);
      fetchSortedMoviesByReview(genre);
    }
  };

  const fetchSortedMoviesByReview = async (genre) => {
    try {
      const response = await getData("/movies/sortedByReviews", {
        params: { genre: genre },
      });
      setMovies(response.data);
    } catch (error) {
      toast({
        title: "리뷰순 정렬 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const handleTabChange = (index) => {
    const newGenre = GENRES[index];
    setGenre(newGenre);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        const response = await getData("/movies/search", {
          params: { query },
        });
        setMovies(response.data);
      } catch (error) {
        toast({
          title: "영화명 검색 Error",
          description: `Failed to search movies / ${error}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.error("Error Search movies:", error);
      } finally {
        setIsLoading(false);
      }
    }
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
            총 {movies?.length}건의 영화가 조회되었습니다
          </Text>
        </Flex>
      </Box>

      <Box color="black" p={10} position="relative">
        <SearchBar onSearch={handleSearch} />
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
          onChange={handleSortChange}
          value={sort}
        >
          <option value="popular">인기순</option>
          <option value="review">리뷰 많은 순</option>
          <option value="latest" disabled>
            최신순
          </option>
        </Select>
      </Box>

      <Box flex="1" color="white" p={5}>
        <Tabs
          variant="soft-rounded"
          colorScheme="teal"
          size={"md"}
          onChange={(index) => handleTabChange(index)}
          minHeight="50vh"
          index={GENRES.indexOf(genre)}
        >
          <TabList gap={10} justifyContent={"center"}>
            {GENRES.map((genre) => (
              <Tab
                key={genre}
                width="10%"
                _hover={{
                  transform: "translateY(-10px)", // 위로 3px 올라감
                  scaleX: "1.1",
                }}
                transition="all 0.3s ease"
                border="1px solid grey"
                color="white"
              >
                {genre}
              </Tab>
            ))}
          </TabList>
          <TabPanels minHeight="inherit" p={10}>
            <MovieTabPanel
              key={`${genre}-${sort}-${searchQuery}`}
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
