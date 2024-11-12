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
import Pagination from "../../components/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSortedMoviesByPopularity = async (genre, page = 1, size = 30) => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/combinedMovies", {
        params: { genre: genre, page: page, size: size, sort: "popular" }, // 정렬 기준을 popular로 전달
      });
      setTotalElements(response.data.totalElements);
      setMovies(response.data.content);
    } catch (error) {
      toast({
        title: "인기순 정렬 페이징 조회 Error",
        description: `Failed to fetch movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/movies" && !location.search) {
      setGenre("All");
      setSort("popular");
      navigate("?genre=All&sort=popular", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    // 검색 중이라면, useEffect의 데이터 fetching을 중단
    if (searchQuery) return;

    const queryParams = new URLSearchParams({ genre, sort });
    navigate(`?${queryParams.toString()}`, { replace: true });

    if (sort === "popular") {
      console.log("sort가 popular에요");
      fetchSortedMoviesByPopularity(genre, currentPage);
    }
  }, [genre, searchQuery, sort, currentPage]);

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

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);

    if (newSort === "review") {
      fetchSortedMoviesByReview(genre); // 리뷰순 정렬
    } else if (newSort === "popular") {
      fetchSortedMoviesByPopularity(genre, currentPage); // 인기순 정렬
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
            총 {totalElements}건의 영화가 조회되었습니다
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
      <Box flex="1" color="white" p={5}>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalElements / 20)} // 20은 페이지당 항목 수
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Box>
    </Flex>
  );
};

export default Movies;
