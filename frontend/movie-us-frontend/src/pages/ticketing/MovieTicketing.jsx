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
  Skeleton,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getData } from "../../api/axios";
import DateSelector from "../../components/DateSelector";
import { RepeatClockIcon } from "@chakra-ui/icons";
import timeTable from "../../assets/data/timeTable.json";
import TicketSummary from "../../components/TicketSummary";
import { useParams } from "react-router-dom";

const MovieTicketing = () => {
  const { indexId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(parseInt(indexId));
  const [cinemaData, setCinemaData] = useState(null);
  const [allGuArray, setAllGuArray] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedGu, setSelectedGu] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCinemaData();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 두 자리로 포맷
    const day = String(date.getDate()).padStart(2, "0"); // 일을 두 자리로 포맷

    // 요일 배열 (일요일부터 토요일까지)
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[date.getDay()]; // 요일 이름 가져오기

    return `${year}-${month}-${day} (${dayOfWeek})`;
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
  const fetchCinemaData = async () => {
    try {
      setIsLoading(true);
      const response = await getData("/api/v1/cinemas/locations");
      setCinemaData(response.data);
      setAllGuArray(Object.keys(response.data));
      setSelectedGu(Object.keys(response.data)[0]);
    } catch (error) {
      toast({
        title: "영화관 조회 Error",
        description: `Failed to fetch cinema locations / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchScreeningTimeData = async () => {
    try {
      console.log(selectedMovie);
      console.log(selectedTheater);
      console.log(selectedDate.toISOString().split("T")[0]);
      // const response = await getData("/api/v1/screenings/times", {
      //   params: { selectedMovie, selectedTheater },
      // });
      // console.log("상영 시간: ", response.data);
    } catch (error) {
      toast({
        title: "상영시간 조회 Error",
        description: `Failed to fetch screening time / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching Screening time:", error);
    }
  };

  useEffect(() => {
    fetchScreeningTimeData();
  }, [selectedMovie, selectedTheater, selectedDate]);
  const resetHandler = () => {
    setSelectedGu(allGuArray[0]);
    setSelectedDate(null);
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedTime(null);
  };
  return (
    <Flex
      direction="column"
      align="flex-end"
      width="90%"
      margin="0 auto"
      position="relative"
    >
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
              {isLoading ? (
                <VStack align="flex-start" width="100%">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton
                      key={i}
                      height="40px"
                      width="280px"
                      padding="2px"
                      borderRadius="6px"
                      startColor="#d5d3c7"
                      endColor="#f0efea"
                    />
                  ))}
                </VStack>
              ) : (
                <VStack align="flex-start" width="100%">
                  {movies.map((movie) => (
                    <Box
                      key={movie.id}
                      fontWeight="bold"
                      cursor="pointer"
                      p={2}
                      width="280px"
                      bg={
                        selectedMovie === movie.id ? "#333333" : "transparent"
                      }
                      color={selectedMovie === movie.id ? "#d4d3c9" : "black"}
                      onClick={() => {
                        setSelectedMovie(movie.id);
                      }}
                      _hover={{
                        bg: selectedMovie === movie.id ? "#444444" : "#d5d3c7",
                      }}
                      borderRadius={6}
                    >
                      {movie.title}
                    </Box>
                  ))}
                </VStack>
              )}
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
                onChange={(index) => setSelectedGu(allGuArray[index])}
              >
                <TabList>
                  {allGuArray?.map((gu) => (
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
                  {isLoading ? (
                    <VStack align="flex-start">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton
                          key={i}
                          height="40px"
                          width="280px"
                          padding="2px"
                          borderRadius="6px"
                          startColor="#d5d3c7"
                          endColor="#f0efea"
                        />
                      ))}
                    </VStack>
                  ) : (
                    allGuArray?.map((gu) => (
                      <TabPanel key={gu}>
                        <Box>
                          {cinemaData[gu] &&
                            Object.entries(cinemaData[gu]).map(
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
                                        onClick={() =>
                                          setSelectedTheater(theater)
                                        }
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
                    ))
                  )}
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
            <Box flex="1" height="100%">
              <DateSelector
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </Box>
          </Flex>
        </Box>
        {/* 상영시간 박스 */}
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
            p="5px"
            width="300px"
          >
            <Box>
              {!selectedDate || !selectedMovie || !selectedTheater ? (
                // 1. 옵션을 아직 선택하지 않은 경우
                <Text>영화, 극장, 날짜를 모두 선택해주세요</Text>
              ) : !timeTable[formatDate(selectedDate)]?.[selectedTheater]?.[
                  selectedMovie
                ] ? (
                // 2. 옵션은 선택했지만 Data가 없는 경우
                <Text>해당 일자에 상영 일정이 없습니다</Text>
              ) : (
                // 3. 옵션을 모두 선택하고 Data가 있는 경우
                <VStack align="flex-start">
                  <Grid
                    templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
                    gap={1}
                    width="100%"
                  >
                    {timeTable[formatDate(selectedDate)][selectedTheater][
                      selectedMovie
                    ].map((session, index) => (
                      <GridItem key={index}>
                        <Flex
                          p={1}
                          align="center"
                          borderWidth="1px"
                          borderRadius="md"
                          width="100%"
                          justify="space-evenly"
                        >
                          <Button
                            size="sm"
                            backgroundColor={
                              selectedTime === session.time
                                ? "#333333"
                                : "brand.primary"
                            }
                            color={
                              selectedTime === session.time
                                ? "#d4d3c9"
                                : "black"
                            }
                            onClick={() => setSelectedTime(session.time)}
                          >
                            {session.time}
                          </Button>
                          <Text>{session.availableSeats}석</Text>
                        </Flex>
                      </GridItem>
                    ))}
                  </Grid>
                </VStack>
              )}
            </Box>
          </Flex>
        </Box>
      </Flex>
      {selectedMovie && selectedTheater && selectedDate && selectedTime && (
        <TicketSummary
          selectedMovie={selectedMovie}
          selectedTheater={selectedTheater}
          selectedDate={formatDate(selectedDate)}
          selectedTime={selectedTime}
        />
      )}
    </Flex>
  );
};

export default MovieTicketing;
