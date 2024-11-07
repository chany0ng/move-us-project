import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../api/axios";
import { ArrowRightIcon } from "@chakra-ui/icons";

const SEAT_PRICE = 10000;

const TicketSummary = ({
  selectedMovie,
  selectedTheater,
  selectedDate,
  selectedTime,
  selectedSeats,
  selectedPeople,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const handleGoToSeatSelection = () => {
    navigate(
      `/ticketing/seat-selection?movie=${selectedMovie}&poster=${posterPath}&title=${title}&theater=${selectedTheater}&date=${selectedDate}&time=${selectedTime}`
    );
  };
  const isSelectAllSeats = () => {
    if (selectedSeats && selectedPeople === selectedSeats.length) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchMovieData();
  }, [selectedMovie]);

  const fetchMovieData = async () => {
    try {
      const response = await getData(`/movies/${selectedMovie}`);
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
      <Flex justify="space-evenly" pl={32} pr={32} align="center">
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

        <Box flex="1" p={2}>
          <Text fontWeight="bold" fontSize="xl" mb={1}>
            선택한 옵션
          </Text>
          <Text>극장: {selectedTheater}</Text>
          <Text>
            일시: {selectedDate} {selectedTime}
          </Text>
        </Box>

        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box flex="1">
            {selectedSeats ? (
              <Box flex="1" p={2}>
                <Text fontWeight="bold" fontSize="xl" mb={1}>
                  좌석 선택
                </Text>
                <Text>좌석번호 {selectedSeats.join(",")}</Text>
              </Box>
            ) : (
              <Text fontWeight="bold" fontSize="xl" mb={1}>
                <ArrowRightIcon /> 좌석 선택
              </Text>
            )}
          </Box>
        </Box>
        <Box flex="1">
          <Button
            onClick={handleGoToSeatSelection}
            size="lg"
            display="flex"
            flexDirection="column"
            p={10}
            disabled={selectedSeats && !isSelectAllSeats()}
          >
            <ArrowRightIcon size="5xl" />
            {selectedSeats ? <Text>결제 선택</Text> : <Text>좌석 선택</Text>}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default TicketSummary;
