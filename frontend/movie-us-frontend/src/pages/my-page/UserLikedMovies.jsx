// import { Box, Flex, Heading, SimpleGrid, Text, Divider, IconButton } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import { FaHeart } from "react-icons/fa";
// import Sidebar from "./../../components/Sidebar";

// const UserLikedMovies = () => {
//   const bgColor = "gray.900";
//   const cardBgColor = "gray.800";
//   const textColor = "gray.100";
//   const borderColor = "gray.600";

//   // 초기 좋아요 영화 리스트를 상태로 설정
//   const initialMovies = [
//     { id: 1, title: "영화 A", posterUrl: "https://via.placeholder.com/300" },
//     { id: 2, title: "영화 B", posterUrl: "https://via.placeholder.com/300" },
//     { id: 3, title: "영화 C", posterUrl: "https://via.placeholder.com/300" },
//     // 추가 데이터...
//   ];

//   // 상태 관리: 좋아요 누른 영화 리스트
//   const [likedMovies, setLikedMovies] = useState([]);

//   // 로컬 저장소에서 초기 좋아요 리스트 불러오기
//   useEffect(() => {
//     const savedMovies = JSON.parse(localStorage.getItem("likedMovies")) || initialMovies;
//     setLikedMovies(savedMovies);
//   }, []);

//   // 좋아요 해제 기능
//   const toggleLike = (movieId) => {
//     const updatedMovies = likedMovies.filter((movie) => movie.id !== movieId);
//     setLikedMovies(updatedMovies);
//     localStorage.setItem("likedMovies", JSON.stringify(updatedMovies));
//   };

//   return (
//     <Box bg={bgColor} minHeight="100vh" p={5}>
//       <Flex maxWidth="1200px" margin="auto" mt="100px">
//         <Box width="250px" mr={8}>
//           <Sidebar />
//         </Box>

//         {/* 오른쪽 메인 콘텐츠 */}
//         <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
//           <Heading size="lg" color="yellow.400" mb={6}>내가 좋아요 누른 영화</Heading>
//           <Divider mb={4} borderColor={borderColor} />
//           <SimpleGrid columns={[1, 2, 3]} spacing={5}>
//             {likedMovies.map((movie) => (
//               <Box key={movie.id} bg="gray.700" borderRadius="md" overflow="hidden" position="relative">
//                 {/* 좋아요 하트 아이콘 */}
//                 <IconButton
//                   aria-label="좋아요 해제"
//                   icon={<FaHeart />}
//                   color="red.500"
//                   position="absolute"
//                   top={2}
//                   right={2}
//                   variant="unstyled"
//                   size="lg"
//                   onClick={() => toggleLike(movie.id)}
//                 />
                
//                 {/* 영화 포스터 */}
//                 <img src={movie.posterUrl} alt={`${movie.title} 포스터`} style={{ width: '100%', height: 'auto' }} />
                
//                 {/* 영화 제목 */}
//                 <Box p={3}>
//                   <Text fontWeight="bold" color={textColor} fontSize="lg">{movie.title}</Text>
//                 </Box>
//               </Box>
//             ))}
//           </SimpleGrid>
//         </Box>
//       </Flex>
//     </Box>
//   );
// };

// export default UserLikedMovies;


import { Box, Flex, Heading, SimpleGrid, Text, Divider, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import Sidebar from "./../../components/Sidebar";
import { getData } from "../../api/axios"; // API 요청을 위한 함수
import { useToast } from "@chakra-ui/react";

const UserLikedMovies = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const toast = useToast();

  // 상태 관리: 좋아요 누른 영화 리스트
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 영화 데이터를 API로부터 불러오기
  const fetchLikedMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getData("/movies/moviesList"); 
      setLikedMovies(response.data.filter((movie) => movie.posterPath !== null));
    } catch (error) {
      toast({
        title: "영화 조회 오류",
        description: `Failed to fetch liked movies / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching liked movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 로드 시 좋아요 누른 영화 불러오기
  useEffect(() => {
    fetchLikedMovies();
  }, []);

  // 좋아요 해제 기능
  const toggleLike = (movieId) => {
    const updatedMovies = likedMovies.filter((movie) => movie.id !== movieId);
    setLikedMovies(updatedMovies);
  };

  return (
    <Box bg={bgColor} minHeight="100vh" p={5}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        {/* 오른쪽 메인 콘텐츠 */}
        <Box flex="1" bg={cardBgColor} borderRadius="lg" p={8} boxShadow="dark-lg">
          <Heading size="lg" color="yellow.400" mb={6}>내가 좋아요 누른 영화</Heading>
          <Divider mb={4} borderColor={borderColor} />
          {isLoading ? (
            <Text color="white">로딩 중...</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {likedMovies.map((movie) => (
                <Box key={movie.id} bg="gray.700" borderRadius="md" overflow="hidden" position="relative">
                  {/* 좋아요 해제 아이콘 */}
                  <IconButton
                    aria-label="좋아요 해제"
                    icon={<FaHeart />}
                    color="red.500"
                    position="absolute"
                    top={3}
                    right={3}
                    variant="unstyled"
                    size="lg"
                    fontSize="1.8rem" // 아이콘 크기 증가
                    onClick={() => toggleLike(movie.id)}
                  />
                  
                  {/* 영화 포스터 */}
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                    alt={`${movie.title} 포스터`} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }} // 높이와 비율 고정
                  />
                  
                  {/* 영화 제목 */}
                  <Box p={3}>
                    <Text fontWeight="bold" color={textColor} fontSize="lg">{movie.title}</Text>
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