import { Button } from "@chakra-ui/react";

const Seat = ({ seatId, isSelected, onSeatClick, isDisabled }) => (
  <Button
    size="xs"
    isDisabled={isDisabled}
    width="20px"
    borderRadius="0"
    onClick={() => onSeatClick(seatId)}
    _hover={!isDisabled ? { bg: "#999" } : {}}
    color="white"
    fontWeight="medium"
    bg={isSelected ? "#666666" : "#BBBBBB"}
  >
    {seatId}
  </Button>
);

export default Seat;
