import {
  Box,
  Flex,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getData } from "../../api/axios";
import theaterData from "../../assets/data/theater.json";
import DateSelector from "../../components/DateSelector";
import { RepeatClockIcon } from "@chakra-ui/icons";
import timeTable from "../../assets/data/timeTable.json";

const MovieTicketing = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedGu, setSelectedGu] = useState(
    Object.keys(theaterData["서울시"])[0]
  );

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 두 자리로 포맷
    const day = String(date.getDate()).padStart(2, "0"); // 일을 두 자리로 포맷
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList");
      setMovies(response.data);
    } catch (error) {
      toast({
        title: "영화 목록 조회 Error",
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
  useEffect(() => {
    fetchData();
  }, []);
  console.log(timeTable[selectedDate]?.[selectedTheater]?.[selectedMovie]);

  const resetHandler = () => {
    setSelectedGu(Object.keys(theaterData["서울시"])[0]);
    setSelectedDate(null);
    setSelectedMovie(null);
    setSelectedTheater(null);
    alert(
      `${selectedMovie}, ${selectedGu}, ${selectedTheater}, ${formatDate(
        selectedDate
      )}`
    );
  };
  return (
    <Flex direction="column" align="flex-end">
      <Button onClick={resetHandler} width="fit-content" m={5}>
        <RepeatClockIcon mr={2} />
        예매 다시하기
      </Button>
      <Flex m={1} minHeight="inherit" bg="#d4d3c9" maxHeight="800px">
        {/* 영화 박스 */}
        <Box flex={3} bg="#f2f0e5" position="relative" border="1px solid gray">
          <Box
            height="50px"
            bg="#333333"
            color="#d4d3c9"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold">영화</Text>
          </Box>
          <Flex
            direction="column"
            height="calc(100% - 50px)"
            color="#333333"
            p="10px"
          >
            <Box flex="1" overflowY="scroll">
              <VStack align="flex-start">
                {movies.map((movie) => (
                  <Box
                    key={movie.tmdbId}
                    fontWeight="bold"
                    cursor="pointer"
                    p={2}
                    width="90%"
                    bg={
                      selectedMovie === movie.tmdbId ? "#333333" : "transparent"
                    }
                    color={selectedMovie === movie.tmdbId ? "#d4d3c9" : "black"}
                    onClick={() => setSelectedMovie(movie.tmdbId)}
                    _hover={{
                      bg:
                        selectedMovie === movie.tmdbId ? "#444444" : "#d5d3c7",
                    }}
                    borderRadius={6}
                  >
                    {movie.title}
                  </Box>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>

        {/* 극장 박스 */}
        <Box flex={3} bg="#f2f0e5" position="relative" border="1px solid gray">
          <Box
            height="50px"
            bg="#333333"
            color="#d4d3c9"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold">극장</Text>
          </Box>
          <Flex
            direction="column"
            height="calc(100% - 50px)"
            color="#333333"
            p="10px"
          >
            <Box flex="1">
              <Tabs
                variant="unstyled"
                onChange={(index) =>
                  setSelectedGu(Object.keys(theaterData["서울시"])[index])
                }
              >
                <TabList>
                  {Object.keys(theaterData["서울시"]).map((gu) => (
                    <Tab
                      key={gu}
                      borderBottom="2px solid #ddd"
                      bg={selectedGu === gu ? "#333333" : "transparent"}
                      color={selectedGu === gu ? "white" : "#777777"}
                      _focus={{ boxShadow: "none" }}
                    >
                      {gu}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  {Object.keys(theaterData["서울시"]).map((gu) => (
                    <TabPanel key={gu}>
                      <Box>
                        {Object.entries(theaterData["서울시"][gu]).map(
                          ([brand, theaters]) => (
                            <Box key={brand} mt={2}>
                              <Text
                                fontWeight="bold"
                                fontSize="lg"
                                mb={2}
                                fontFamily="Noto Sans KR"
                              >
                                {brand}
                              </Text>
                              <Box pl={3}>
                                {theaters.map((theater) => (
                                  <Text
                                    key={theater}
                                    p={2}
                                    mb={1}
                                    borderRadius={6}
                                    cursor="pointer"
                                    width="90%"
                                    bg={
                                      selectedTheater === theater
                                        ? "#333333"
                                        : "transparent"
                                    }
                                    color={
                                      selectedTheater === theater
                                        ? "#d4d3c9"
                                        : "black"
                                    }
                                    onClick={() => setSelectedTheater(theater)}
                                    _hover={{
                                      bg:
                                        selectedTheater === theater
                                          ? "#444444"
                                          : "#d5d3c7",
                                    }}
                                  >
                                    {theater}
                                  </Text>
                                ))}
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </Box>

        {/* 날짜 박스 */}
        <Box flex={1} bg="#f2f0e5" position="relative" border="1px solid gray">
          <Box
            height="50px"
            bg="#333333"
            color="#d4d3c9"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold">날짜</Text>
          </Box>
          <Flex
            direction="column"
            height="calc(100% - 50px)"
            color="#333333"
            p="10px"
          >
            <Box flex="1">
              <DateSelector
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </Box>
          </Flex>
        </Box>

        <Box flex={3} bg="#f2f0e5" position="relative" border="1px solid gray">
          <Box
            height="50px"
            bg="#333333"
            color="#d4d3c9"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold">시간</Text>
          </Box>
          <Flex
            direction="column"
            height="calc(100% - 50px)"
            color="#333333"
            p="10px"
            width="300px"
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              {selectedDate && selectedMovie && selectedTheater ? (
                <VStack>
                  {timeTable[selectedDate]?.[selectedTheater]?.[
                    selectedMovie
                  ].map((session, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      width="100%"
                    >
                      <Text>시간: {session.time}</Text>
                      <Text>남은 좌석: {session.availableSeats}석</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text>영화, 극장, 날짜를 모두 선택해주세요</Text>
              )}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MovieTicketing;
