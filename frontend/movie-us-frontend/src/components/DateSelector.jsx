import { Box, Stack, Button } from "@chakra-ui/react";

const DateSelector = ({ selectedDate, onDateSelect }) => {
  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 이번 달 마지막 날짜

  // 오늘부터 이번 달 말일까지의 날짜 생성
  const dates = Array.from(
    { length: endDate.getDate() - today.getDate() + 1 },
    (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    }
  );

  return (
    <Box flex="1" p={4} maxHeight="100%" overflowY="scroll">
      <Stack spacing={2}>
        {dates.map((date) => {
          const isSelected =
            date.toDateString() === selectedDate?.toDateString();
          const isSaturday = date.getDay() === 6;
          const isSunday = date.getDay() === 0;

          // 오늘부터 7일 이내 날짜만 선택 가능
          const isWithin7Days =
            date <=
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 7
            );

          return (
            <Button
              key={date.toISOString()}
              onClick={() => isWithin7Days && onDateSelect(date)} // 7일 이내 날짜만 선택 가능
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
                bg: isWithin7Days
                  ? isSelected
                    ? "#444444"
                    : "#d5d3c7"
                  : "transparent",
              }}
              isDisabled={!isWithin7Days} // 7일 이후 날짜는 비활성화
              opacity={isWithin7Days ? 1 : 0.4} // 비활성화된 버튼은 흐리게 표시
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
