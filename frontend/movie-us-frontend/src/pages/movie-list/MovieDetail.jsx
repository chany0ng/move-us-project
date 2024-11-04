import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { getData } from "../../api/axios";
import netflixLogo from '../../assets/images/ott/Netflix.png';
import tvingLogo from '../../assets/images/ott/Tving.png';
import ReviewModal from '../../components/ReviewModal';
import ReviewList from '../../components/ReviewList.jsx';
import reviewsData from '../../assets/data/reviews.json';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        console.log('Fetching movie ID:', movieId);
        const response = await getData(`/movies/${movieId}`);
        console.log('API Response:', response);
        if (response && response.data) {
          setMovie(response.data);
        } else {
          console.error('No data in response');
        }
      } catch (error) {
        console.error("Error fetching movie details:", error.response || error);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  useEffect(() => {
    // 리뷰 데이터 로드
    const movieReviews = reviewsData.reviews.filter(
      review => review.movieId === parseInt(movieId)
    );
    setReviews(movieReviews);
  }, [movieId]);

  if (!movie) return <div>로딩중...</div>;

  // 모달 닫기 핸들러 추가
  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container maxW="container.xl" flex="1" py={10}>
        <Flex direction={{ base: "column", md: "row" }} gap={8}>

          {/* 영화 정보 */}
          <VStack flex="2" align="start" spacing={4}>
            <Heading size="xl">{movie.title}</Heading>
            <HStack spacing={4}>
              <Text>개봉일: {movie.releaseDate}</Text>
              {/* <Text>장르: {movie.genre}</Text>
              <Text>러닝타임: {movie.runtime}분</Text> */}
            </HStack>
            
            <Divider borderColor="#3F3F3F" />

            {/* OTT 링크 버튼 */}
            <Box width="100%">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                시청 가능한 곳
              </Text>
              <HStack spacing={4}>
                {movie.ottLinks?.netflix || (
                  <Button
                    as="a"
                    // href={movie.ottLinks.netflix}
                    target="_blank"
                    variant="ghost"
                    p={2}
                  >
                    <Image 
                      src={netflixLogo}
                      alt="Netflix" 
                      height="30px"
                    />
                  </Button>
                )}
                {movie.ottLinks?.tving || (
                  <Button
                    as="a"
                    // href={movie.ottLinks.tving}
                    target="_blank"
                    variant="ghost"
                    p={2}
                  >
                    <Image 
                      src={tvingLogo}
                      alt="Tving" 
                      height="30px"
                    />
                  </Button>
                )}
              </HStack>
            </Box>
                
            {/* 줄거리 */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                줄거리
              </Text>
              <Text>{movie.overview}</Text>
            </Box>

            {/* 출연진 */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                출연진
              </Text>
              <Text>{movie.cast}</Text>
            </Box>

            {/* 감독 */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                감독
              </Text>
              <Text>{movie.director}</Text>
            </Box>
          </VStack>
          
          {/* 영화 포스터 */}
          <Box flex="1" maxWidth="280px" mb={4}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              borderRadius="lg"
              objectFit="cover"
              width="100%"
              fallback={<Box>이미지를 불러올 수 없습니다.</Box>}
            />
            <Button
            colorScheme="blue"
            onClick={() => setIsReviewModalOpen(true)}
            mt={4}
            width="100%"
            >
            리뷰 작성하기
            </Button>

          </Box>
        </Flex>

        <Divider borderColor="#3F3F3F" />
        {/* 리뷰 섹션 */}
        <Box mt={10} width="100%">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg">리뷰</Heading>
          </Flex>
          <ReviewList movieId={movieId} reviews={reviews} />
        </Box>

      </Container>

      {/* ReviewModal 컴포넌트 추가 */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={handleCloseModal}
        movieId={movieId}
        movie={movie}
      />
    </div>
  );
};

export default MovieDetail; 