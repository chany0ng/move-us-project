import { Box, Flex, Heading, SimpleGrid, Text, Divider, Icon, VStack, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { StarIcon } from "@chakra-ui/icons";
import Sidebar from "./../../components/Sidebar";
import { useToast } from "@chakra-ui/react";
import { getData, deleteData } from "../../api/axios";
import ReviewMenu from "../../components/ReviewMenu";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../components/ReviewModal";
import { userStore } from "../../../store";

const UserReviewHistory = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const toast = useToast();
  const navigate = useNavigate();

  const { getState } = userStore;
  const userNum = getState().user.user_num;
  const [reviewHistory, setReviewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviewHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getData(`/api/review/userReview/${userNum}`);
      console.log('사용자 리뷰 데이터:', response.data);
      setReviewHistory(response.data);
    } catch (error) {
      toast({
        title: "리뷰 조회 오류",
        description: "리뷰 내역을 불러올 수 없습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("리뷰 내역 조회 중 오류:", error);
      setReviewHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewHistory();
  }, []);

  const handleDeleteClick = async (reviewId) => {
    try {
      await deleteData(`/api/review/${reviewId}`);
      toast({
        title: "리뷰가 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchReviewHistory(); // 리뷰 목록 새로고침
    } catch (error) {
      toast({
        title: "리뷰 삭제 실패",
        description: "리뷰를 삭제하는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    onOpen();
  };

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>내가 작성한 리뷰</Heading>
          <Divider mb={4} borderColor={borderColor} />
          
          {isLoading ? (
            <Text color="white">리뷰 내역을 불러오는 중...</Text>
          ) : reviewHistory.length === 0 ? (
            <Text color="white">작성한 리뷰가 없습니다.</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {reviewHistory.map((review) => (
                <Box 
                  key={review.reviewId} 
                  bg="gray.700" 
                  borderRadius="md" 
                  overflow="hidden" 
                  p={4} 
                  boxShadow="lg"
                  position="relative"
                >
                  {/* 영화 포스터 - 클릭 이벤트 추가 */}
                  <Box 
                    position="relative" 
                    height="300px"
                    onClick={() => navigate(`/movie-detail/${review.tmdbId}`)}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  >
                    {review.posterPath ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${review.posterPath}`} 
                        alt={`${review.title} 포스터`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          borderRadius: '0.375rem' 
                        }} 
                      />
                    ) : (
                      <Box 
                        height="100%" 
                        bg="gray.600" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        <Text color={textColor}>이미지 없음</Text>
                      </Box>
                    )}
                  </Box>
                  
                  {/* 영화 정보 및 리뷰 */}
                  <VStack align="stretch" mt={3} spacing={2}>
                    <Heading size="md" color={textColor}>
                      {review.title}
                    </Heading>
                    
                    <Flex>
                      {Array(5)
                        .fill("")
                        .map((_, i) => (
                          <Icon 
                            as={StarIcon} 
                            key={i} 
                            color={i < (review.rating / 2) ? "yellow.400" : "gray.500"} 
                          />
                        ))}
                      <Text ml={2} color={textColor}>
                        {review.rating / 2}/5
                      </Text>
                    </Flex>
                    
                    <Text color={textColor} noOfLines={3}>
                      {review.comment}
                    </Text>
                    
                    <Text color="gray.400" fontSize="sm">
                      작성일: {new Date(review.reviewDate).toLocaleDateString()}
                    </Text>
                  </VStack>

                  <Box position="absolute" bottom={2} right={2} zIndex={2}>
                    <ReviewMenu
                      review={review}
                      onEditReview={handleEditReview}
                      onDeleteClick={handleDeleteClick}
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedReview(null);
        }}
        tmdbId={selectedReview?.tmdbId}
        movie={{ title: selectedReview?.title }}
        onReviewSubmitted={fetchReviewHistory}
        userNum={userNum}
        reviewToEdit={selectedReview}
      />
    </Box>
  );
};

export default UserReviewHistory;