import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../api/axios";
import { ArrowRightIcon } from "@chakra-ui/icons";
const TicketSummary = ({
  selectedMovie,
  selectedTheater,
  selectedDate,
  selectedTime,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const handleGoToSeatSelection = () => {
    navigate(`/ticketing/seat-selection?movie=${selectedMovie}&theater=${selectedTheater}&date=${formatDate(selectedDate)}&time=${selectedTime}`);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 요일 구하기
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${year}-${month}-${day} (${dayOfWeek})`;
  };

  useEffect(() => {
    fetchMovieData();
  }, [selectedMovie]);

  const fetchMovieData = async () => {
    try {
      const response = await getData(`/movies/${selectedMovie}`);
      console.log(response.data);
      setTitle(response.data.title);
      setPosterPath(response.data.posterPath);
      setReleaseDate(response.data.releaseDate);
    } catch (error) {
      toast({
        title: "영화 상세정보 조회 Error",
        description: `Failed to fetch movie data / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      bg="#333333"
      color="#d4d3c9"
      position="fixed"
      bottom="0"
      right="0"
      width="100%"
      zIndex="10"
      opacity={0.95}
    >
      <Flex justify="space-evenly" pl={64} pr={64} align="center">
        {/* Left section: Movie information */}
        <Box flex="1" p={2}>
          <Flex align="center">
            {posterPath && (
              <Box m={2}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${posterPath}`}
                  alt={`${title} poster`}
                  style={{ width: "100px", height: "auto" }}
                />
              </Box>
            )}
            <Box>
              <Text fontWeight="bold" fontSize="xl" mb={1}>
                영화 정보
              </Text>
              <Text>{title}</Text>
              <Text>개봉일: {releaseDate}</Text>
            </Box>
          </Flex>
        </Box>

        {/* Center section: User's selection */}
        <Box flex="1" p={2}>
          <Text fontWeight="bold" fontSize="xl" mb={1}>
            선택한 옵션
          </Text>
          <Text>극장: {selectedTheater}</Text>
          <Text>
            일시: {formatDate(selectedDate)} {selectedTime}
          </Text>
        </Box>

        {/* Right section: Seat selection button */}
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={handleGoToSeatSelection}
            size="lg"
            display="flex"
            flexDirection="column"
            p={10}
          >
            <ArrowRightIcon size="5xl" />
            좌석 선택
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default TicketSummary;
