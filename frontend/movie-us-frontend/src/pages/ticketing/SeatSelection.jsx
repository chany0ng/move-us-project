import { RepeatClockIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const SeatSelection = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const selectedMovie = searchParams.get("movie");
  const selectedTheater = searchParams.get("theater");
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");

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
      <Button width="fit-content" m={5}>
        <RepeatClockIcon mr={2} />
        예매 다시하기
      </Button>
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
          p="10px"
        >
          <Flex>
            <p>영화: {selectedMovie}</p>
            <p>극장: {selectedTheater}</p>
            <p>날짜: {selectedDate}</p>
            <p>시간: {selectedTime}</p>
          </Flex>
          <Box>여기에 좌석넣을거임</Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SeatSelection;
