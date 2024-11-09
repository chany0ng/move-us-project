import { Box, Stack, Button } from "@chakra-ui/react";

const DateSelector = ({ selectedDate, onDateSelect }) => {
  const today = new Date();

  // 오늘 날짜부터 7일간의 날짜를 생성
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  return (
    <Box flex="1" p={4}>
      <Stack spacing={2}>
        {dates.map((date) => {
          const isSelected =
            date.toDateString() === selectedDate?.toDateString();
          const isSaturday = date.getDay() === 6;
          const isSunday = date.getDay() === 0;

          return (
            <Button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)} // 부모 컴포넌트의 함수 호출
              variant="outline"
              bg={isSelected ? "#333333" : "transparent"}
              color={
                isSaturday
                  ? "blue.500"
                  : isSunday
                  ? "red.500"
                  : isSelected
                  ? "#d4d3c9"
                  : "black"
              }
              width="full"
              justifyContent="flex-start"
              _hover={{
                bg: isSelected ? "#444444" : "#d5d3c7",
              }}
            >
              {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일{" "}
              {date.toLocaleDateString("ko-KR", { weekday: "long" })}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DateSelector;
