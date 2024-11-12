import { Box, Flex, Heading, SimpleGrid, Text, Divider, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Sidebar from "./../../components/Sidebar";
import { useToast } from "@chakra-ui/react";
import { getData } from "../../api/axios"; // API 요청을 위한 함수
import { useLocation } from 'react-router-dom';
import { userStore } from "../../../store.js";

const UserReservationHistory = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";

  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const toast = useToast();

  const { getState } = userStore;
  const userNum = getState().user.user_num;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/reservations/user/${userNum}`);
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => 
            new Date(b.paymentDate) - new Date(a.paymentDate)
          );
          setReservations(sortedData);
        } else {
          toast({
            title: "조회 실패",
            description: "예매 내역을 불러오는데 실패했습니다.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast({
          title: "오류 발생",
          description: "서버와의 통신 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (userNum) {
      fetchReservations();
    }
  }, [userNum]);

  const handleCancelReservation = async (paymentKey) => {
    console.log("Attempting to cancel payment with key:", paymentKey);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/payments/toss/cancel?paymentKey=${paymentKey}&cancelReason=${encodeURIComponent("사용자 요청으로 인한 취소")}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response data:", responseData);

      if (response.ok) {
        toast({
          title: "취소 완료",
          description: "예매가 성공적으로 취소되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        window.location.href = '/my-page/activity/user-reservation-history';
      } else {
        toast({
          title: "취소 실패",
          description: `결제 취소 중 오류가 발생했습니다. (Status: ${response.status})`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "취소 실패",
        description: "결제 취소 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>예매 내역 조회</Heading>
          <Divider mb={4} borderColor={borderColor} />
          
          {reservations.length > 0 ? (
            <SimpleGrid columns={1} spacing={6}>
              {reservations.map((reservation) => (
                <Box 
                  key={reservation.paymentId} 
                  bg={reservation.status === 'CANCEL' ? 'gray.800' : 'gray.700'} 
                  borderRadius="md" 
                  p={6} 
                  boxShadow="lg"
                  opacity={reservation.status === 'CANCEL' ? 0.7 : 1}
                  filter={reservation.status === 'CANCEL' ? 'brightness(0.8)' : 'none'}
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading  size="md" 
                        fontSize="1.3rem" 
                      color={textColor}
                    >
                      {reservation.movieName}
                    </Heading>
                    <Text 
                      color={reservation.status === 'CANCEL' ? 'red.400' : 'green.400'}
                      fontWeight="bold"
                    >
                      {reservation.status === 'CANCEL' ? '취소됨' : '예매완료'}
                    </Text>
                  </Flex>
                  <SimpleGrid columns={2} spacing={4}>
                    <Text color={textColor}>상영관: {reservation.theaterName}</Text>
                    <Text color={textColor}>결제 금액: {reservation.amount.toLocaleString()}원</Text>
                    <Text color={textColor}>상영 날짜: {reservation.screeningDate}</Text>
                    <Text color={textColor}>상영 시간: {reservation.screeningTime.substring(0, 5)}</Text>
                    <Text color={textColor}>좌석 번호: {reservation.seatNumbers}</Text>
                    <Text color={textColor}>결제 일시: {new Date(reservation.paymentDate).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}</Text>
                    <Text color={textColor}>주문 번호: {reservation.orderId}</Text>
                    
                  </SimpleGrid>
                  {reservation.status !== 'CANCEL' && (
                    <Button 
                      mt={6} 
                      colorScheme="red" 
                      size="md"
                      onClick={() => handleCancelReservation(reservation.paymentKey)}
                    >
                      예매 취소
                    </Button>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text color={textColor} textAlign="center">예매 내역이 없습니다.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserReservationHistory;