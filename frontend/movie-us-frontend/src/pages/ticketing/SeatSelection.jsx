import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../../components/Seat";
import TicketSummary from "../../components/TicketSummary";
import { postData } from '../../api/axios';

const SEAT_PRICE = 10000;
// 좌석 배열 생성
const SEAT_ROWS = "ABCDEFGHIJ".split("");
const SEAT_COLUMNS = Array.from({ length: 10 }, (_, i) => i + 1);

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const searchParams = new URLSearchParams(location.search);

  const selectedMovie = searchParams.get("movie");
  const selectedPoster = searchParams.get("poster");
  const selectedTitle = searchParams.get("title");
  const selectedTheater = searchParams.get("theater");
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");

  // 좌석 선택 관련 State
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState(1);
  // 인원수 선택 함수
  const handlePeopleSelect = (count) => {
    setSelectedPeople(count);
    setSelectedSeats([]);
  };

  // 좌석 선택 함수
  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else if (selectedSeats.length < selectedPeople) {
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      toast({
        title: "좌석 선택 초과",
        description: "선택 인원 수만큼 좌석을 선택할 수 있습니다.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // 최종 예매 및 결제 함수
  const handlePayment = async () => {
    const totalAmount = selectedSeats.length * SEAT_PRICE;
    try {
      // 결제 API 요청 (가상의 API URL)
      const response = await postData("/api/v1/payments/toss", {
        movie: "",
        amout: totalAmount
      });

      if (response.ok) {
        toast({
          title: "결제 성공",
          description: `${selectedSeats.join(", ")} 좌석이 예약되었습니다.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error("결제에 실패했습니다.");
      }
    } catch (error) {
      toast({
        title: "결제 실패",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      align="flex-end"
      margin="0 auto"
      width="60%"
      pt={8}
      height="800px"
      position="relative"
    >
      <Flex align="center" justify="flex-end">
        <Button
          width="fit-content"
          bg="#f2f0e5"
          _hover={{ bg: "#d4d3c9" }}
          onClick={() => navigate("/ticketing")}
        >
          <RepeatClockIcon mr={2} />
          영화 재선택
        </Button>
        <Button width="fit-content" m={5}>
          <RepeatClockIcon mr={2} />
          인원/좌석 초기화
        </Button>
      </Flex>
      <Box
        bg="#f2f0e5"
        position="relative"
        margin="0 auto"
        width="100%"
        height="100%"
        border="1px solid gray"
      >
        <Box
          height="50px"
          bg="#333333"
          color="#d4d3c9"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold">인원 / 좌석</Text>
        </Box>
        <Flex
          direction="column"
          height="calc(100% - 50px)"
          maxHeight="100%"
          color="#333333"
          bg="#d4d3c9"
        >
          <Flex p={5}>
            {selectedPoster && (
              <Box m={2}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${selectedPoster}`}
                  alt={`${selectedTitle} poster`}
                  style={{ width: "120px", height: "auto" }}
                />
              </Box>
            )}
            <Flex direction="column" p={4} borderRight="1px solid gray">
              <Flex direction="column">
                <p>{selectedTheater}</p>
                <p>{selectedTitle}</p>
                <p>
                  남은 좌석{" "}
                  <span style={{ color: " red", fontWeight: "bold" }}>98</span>
                  /100
                </p>
              </Flex>
              <Flex pt={4}>
                <Heading fontSize="2xl" fontFamily="Helvetica Neue">
                  {selectedDate} {selectedTime}
                </Heading>
              </Flex>
            </Flex>
            <Box p={4}>
              <Text fontSize="xl">인원 선택</Text>
              <Text color="red" pb={4}>
                * 인원은 1~8명 선택 가능
              </Text>
              {[...Array(8)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => handlePeopleSelect(i + 1)}
                  border="1px solid #333"
                  color={selectedPeople === i + 1 ? "brand.light" : "#333"}
                  bg={selectedPeople === i + 1 ? "#333" : "transparent"}
                  _hover={{ bg: "#999" }}
                  m={1}
                >
                  {i + 1}명
                </Button>
              ))}
            </Box>
          </Flex>
          <Box bg="#f2f0e5" height="100%" p={5}>
            <Box
              bg="#bdbbb0"
              color="#333"
              fontWeight="bold"
              fontSize="lg"
              textAlign="center"
              margin="0 auto"
              width="80%"
            >
              Screen
            </Box>
            <Grid
              templateColumns="repeat(10, 0fr)"
              gap={1}
              width="fit-content"
              mx="auto"
              mt="10"
            >
              {SEAT_ROWS.map((row) =>
                SEAT_COLUMNS.map((col) => (
                  <Seat
                    key={`${row}${col}`}
                    seatId={`${row}${col}`}
                    isSelected={selectedSeats.includes(`${row}${col}`)}
                    onSeatClick={handleSeatClick}
                  />
                ))
              )}
            </Grid>
          </Box>
        </Flex>
      </Box>
      <TicketSummary
        selectedMovieTmdbId={selectedMovie}
        selectedTheater={selectedTheater}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedSeats={selectedSeats}
        selectedPeople={selectedPeople}
        handlePayment={handlePayment}
      />
    </Flex>
  );
};

export default SeatSelection;
