import { Box, Flex, Heading, SimpleGrid, Text, Divider, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Sidebar from "./../../components/Sidebar";
import { useToast } from "@chakra-ui/react";
import { getData } from "../../api/axios"; // API 요청을 위한 함수

const UserReservationHistory = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const toast = useToast();

  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookingHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList");
      
      // 더미 데이터가 포함된 예매 배열로 변환
      const bookingsWithDummyData = response.data.map((booking) => ({
        ...booking,
        ageRating: "15세 이상 관람가", // 임시 관람등급
        location: "서울 CGV 강남", // 임시 영화관 위치
        date: "2024-11-20", // 임시 날짜
        time: "18:30", // 임시 시간
      }));
      
      setBookingHistory(bookingsWithDummyData);
    } catch (error) {
      toast({
        title: "예매 조회 오류",
        description: `예매 데이터를 불러올 수 없습니다 / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("예매 데이터 조회 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>예매 내역 조회</Heading>
          <Divider mb={4} borderColor={borderColor} />
          
          {isLoading ? (
            <Text color="white">로딩 중...</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {bookingHistory.map((booking) => (
                <Box key={booking.id} bg="gray.700" borderRadius="md" overflow="hidden" position="relative" p={4} boxShadow="lg">
                  {/* 영화 포스터 */}
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${booking.posterPath}`} 
                    alt={`${booking.title} 포스터`} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'md' }} 
                  />
                  
                  {/* 영화 제목과 예매 정보 */}
                  <Box mt={3}>
                    <Heading size="md" color={textColor} mb={2}>{booking.title}</Heading>
                    <Text color="gray.400" fontSize="sm" mb={1}>{booking.ageRating}</Text>
                    <Text color={textColor} fontSize="sm">영화관: {booking.location}</Text>
                    <Text color={textColor} fontSize="sm">{booking.date} ({booking.time})</Text>
                  </Box>

                  {/* 예매 취소 버튼 */}
                  <Button mt={4} colorScheme="red" size="sm">예매 취소</Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserReservationHistory;