import { Box, Flex, Heading, SimpleGrid, Text, Divider, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import Sidebar from "./../../components/Sidebar";
import { getData } from "../../api/axios"; // API 요청을 위한 함수
import { useToast } from "@chakra-ui/react";
import { deleteData } from "../../api/axios"; // API 요청을 위한 함수
import { useNavigate } from "react-router-dom";  // 추가

const UserLikedMovies = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const userNum = 1; // 임시 유저 번호 설정
  const toast = useToast();
  const navigate = useNavigate();  // 추가

  // 상태 관리: 좋아요 누른 영화 리스트
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 찜한 영화 목록 불러오기
  const fetchLikedMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getData(`/api/favorites/${userNum}`);
      setLikedMovies(response.data || []);
    } catch (error) {
      toast({
        title: "찜한 영화 조회 오류",
        description: error.response?.data?.message || "찜한 영화 목록을 불러오는데 실패했습니다",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching liked movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 찜 목록 불러오기
  useEffect(() => {
    fetchLikedMovies();
  }, []);

  // 찜 해제 기능
  const handleUnlike = async (favoriteId) => {
    try {
      await deleteData(`/api/favorites/${favoriteId}`);
      toast({
        title: "찜 해제 완료",
        description: "영화가 찜 목록에서 제거되었습니다",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // 찜 목록 새로고침
      fetchLikedMovies();
    } catch (error) {
      toast({
        title: "찜 해제 실패",
        description: error.response?.data?.message || "찜 해제에 실패했습니다",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        {/* 오른쪽 메인 콘텐츠 */}
        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>내가 찜한 영화</Heading>
          <Divider mb={4} borderColor={borderColor} />
          {isLoading ? (
            <Text color="white">로딩 중...</Text>
          ) : likedMovies.length === 0 ? (
            <Text color="white">찜한 영화가 없습니다.</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {likedMovies.map((movie) => (
                <Box 
                  key={movie.favoriteId} 
                  bg="gray.700" 
                  borderRadius="md" 
                  overflow="hidden" 
                  position="relative"
                >
                  {/* 영화 포스터 - 클릭 이벤트 추가 */}
                  <Box 
                    onClick={() => navigate(`/movie-detail/${movie.tmdbId}`)}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  >
                    {movie.posterPath ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                        alt={`${movie.title} 포스터`} 
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box 
                        width="100%" 
                        height="300px" 
                        bg="gray.600" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        이미지 없음
                      </Box>
                    )}
                  </Box>
                  
                  {/* 영화 제목과 하트 아이콘을 Flex로 감싸기 */}
                  <Box p={3}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text 
                        fontWeight="bold" 
                        color={textColor} 
                        fontSize="lg"
                        noOfLines={2}
                        flex="1"
                      >
                        {movie.title || '제목 없음'}
                      </Text>
                      <IconButton
                        aria-label="찜 해제"
                        icon={<FaHeart />}
                        color="red.500"
                        variant="unstyled"
                        size="sm"
                        fontSize="1.2rem"
                        onClick={() => handleUnlike(movie.favoriteId)}
                        _hover={{ transform: 'scale(1.1)' }}
                        ml={2}
                      />
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserLikedMovies;