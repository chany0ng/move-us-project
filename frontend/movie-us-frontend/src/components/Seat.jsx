import { Button } from "@chakra-ui/react";

const Seat = ({ seatId, isSelected, onSeatClick }) => (
  <Button
    size="xs"
    width="20px"
    borderRadius="0"
    onClick={() => onSeatClick(seatId)}
    color="white"
    fontWeight="medium"
    bg={isSelected ? "#666666" : "#BBBBBB"}
  >
    {seatId}
  </Button>
);

export default Seat;
