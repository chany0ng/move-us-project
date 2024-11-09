import { Box, Flex, Heading, SimpleGrid, Text, Divider, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { StarIcon } from "@chakra-ui/icons";
import Sidebar from "./../../components/Sidebar";
import { useToast } from "@chakra-ui/react";
import { getData } from "../../api/axios"; // API 요청을 위한 함수

const UserReviewHistory = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const toast = useToast();

  const [reviewHistory, setReviewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviewHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList");
      
      // 더미 데이터가 포함된 리뷰 배열로 변환
      const reviewsWithDummyData = response.data.map((review) => ({
        ...review,
        rating: 4, // 임시 별점
        reviewText: "정말 멋진 영화였습니다. 다시 보고 싶어요!", // 임시 리뷰 텍스트
      }));
      
      setReviewHistory(reviewsWithDummyData);
    } catch (error) {
      toast({
        title: "리뷰 조회 오류",
        description: `리뷰 데이터를 불러올 수 없습니다 / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("리뷰 데이터 조회 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewHistory();
  }, []);

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>리뷰 내역 조회</Heading>
          <Divider mb={4} borderColor={borderColor} />
          
          {isLoading ? (
            <Text color="white">로딩 중...</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {reviewHistory.map((review) => (
                <Box key={review.id} bg="gray.700" borderRadius="md" overflow="hidden" position="relative" p={4} boxShadow="lg">
                  {/* 영화 포스터 */}
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${review.posterPath}`} 
                    alt={`${review.title} 포스터`} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'md' }} 
                  />
                  
                  {/* 영화 제목과 별점 */}
                  <Box mt={3}>
                    <Heading size="md" color={textColor} mb={2}>{review.title}</Heading>
                    <Flex>
                      {Array(5)
                        .fill("")
                        .map((_, i) => (
                          <Icon as={StarIcon} key={i} color={i < review.rating ? "yellow.400" : "gray.500"} />
                        ))}
                    </Flex>
                  </Box>

                  {/* 리뷰 내용 */}
                  <Text mt={3} color={textColor}>{review.reviewText}</Text>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserReviewHistory;