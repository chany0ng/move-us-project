import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  SimpleGrid,
} from "@chakra-ui/react";
import { getData } from "../../api/axios";
import netflixLogo from "../../assets/images/ott/Netflix.png";
import tvingLogo from "../../assets/images/ott/Tving.png";
import ReviewModal from "../../components/ReviewModal";
import ReviewList from "../../components/ReviewList.jsx";
import reviewsData from "../../assets/data/reviews.json";
import movieCredits from '../../assets/data/movieCredits.json';

const MovieDetail = () => {
  // 영화 ID를 가져오는 파라미터
  const { tmdbId } = useParams();
  // 영화 정보, 리뷰 모달 상태, 리뷰 목록 상태
  const [movie, setMovie] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185"; // 프로필 이미지용 사이즈

  // 영화 정보 가져오기
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        console.log("Fetching movie ID:", tmdbId);
        const response = await getData(`/movies/${tmdbId}`);
        console.log("API Response:", response);
        if (response && response.data) {
          setMovie(response.data);
        } else {
          console.error("No data in response");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error.response || error);
      }
    };

    if (tmdbId) {
      fetchMovieDetail();
    }
  }, [tmdbId]);

  // 리뷰 목록 가져오기
  useEffect(() => {
    const movieReviews = reviewsData.reviews.filter(
      (review) => review.tmdbId === parseInt(tmdbId)
    );
    setReviews(movieReviews);
  }, [tmdbId]);

  // movieCredits에서 현재 영화의 출연진과 감독 정보 가져오기
  const getCastInfo = () => {
    // cast 정보 가져오기 (처음 5명만)
    const castMembers = movieCredits.cast?.slice(0, 5).map(actor => ({
      name: actor.name,
      profilePath: actor.profile_path,
      character: actor.character
    })) || [];
    
    // 감독 정보 가져오기
    const director = movieCredits.crew?.find(member => member.job === "Director");
    
    return { 
      castMembers, 
      director: {
        name: director?.name || "정보 없음",
        profilePath: director?.profile_path
      }
    };
  };

  const { castMembers, director } = getCastInfo();

  // 영화 정보가 없으면 로딩중 표시
  if (!movie) return <div>로딩중...</div>;

  // 리뷰 모달 닫기 
  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container maxW="container.xl" flex="1" py={10}>
        {/* 영화 정보 섹션 */}
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          {/* 왼쪽 영화 상세 정보 */}
          <VStack flex="2" align="start" spacing={4}>
            {/* 영화 제목 */}
            <Heading size="xl">{movie.title}</Heading>
            
            {/* 개봉일 정보 */}
            <HStack spacing={4}>
              <Text>개봉일: {movie.releaseDate}</Text>
            </HStack>

            <Divider borderColor="#3F3F3F" />

            {/* OTT 서비스 링크 섹션 */}
            <Box width="100%">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                시청 가능한 곳
              </Text>
              <HStack spacing={4}>
                {movie.ottLinks?.netflix || (
                  <Button
                    as="a"
                    target="_blank"
                    variant="ghost"
                    p={2}
                    cursor="pointer"
                  >
                    <Image src={netflixLogo} alt="Netflix" height="30px" />
                  </Button>
                )}
                {movie.ottLinks?.tving || (
                  <Button
                    as="a"
                    target="_blank"
                    variant="ghost"
                    p={2}
                    cursor="pointer"
                  >
                    <Image src={tvingLogo} alt="Tving" height="30px" />
                  </Button>
                )}
              </HStack>
            </Box>

            {/* 영화 줄거리 섹션 */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                줄거리
              </Text>
              <Text>{movie.overview}</Text>
            </Box>

            <Divider borderColor="#3F3F3F" />
            
            {/* 감독과 출연진 정보 섹션 */}
            <Flex direction={{ base: "column", md: "row" }} gap={8} width="100%">
              {/* 감독 정보 */}
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  감독
                </Text>
                <VStack align="center" spacing={1}>
                  {director.profilePath ? (
                    <Image
                      src={`${IMAGE_BASE_URL}${director.profilePath}`}
                      alt={director.name}
                      borderRadius="md"
                      width="120px"
                      height="180px"
                      objectFit="cover"
                    />
                  ) : (
                    <Box
                      width="120px"
                      height="180px"
                      bg="gray.200"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      이미지 없음
                    </Box>
                  )}
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    {director.name}
                  </Text>
                </VStack>
              </Box>

              {/* 출연진 정보 */}
              <Box flex="4">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  출연진
                </Text>
                <SimpleGrid columns={[2, 3, 5]} spacing={2}>
                  {castMembers.map((actor) => (
                    <VStack key={actor.name} align="center" spacing={2}>
                      {actor.profilePath ? (
                        <Image
                          src={`${IMAGE_BASE_URL}${actor.profilePath}`}
                          alt={actor.name}
                          borderRadius="md"
                          width="120px"
                          height="180px"
                          objectFit="cover"
                        />
                      ) : (
                        <Box
                          width="120px"
                          height="180px"
                          bg="gray.200"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          이미지 없음
                        </Box>
                      )}
                      <Text fontWeight="bold" textAlign="center">
                        {actor.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {actor.character}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </Box>
            </Flex>
          </VStack>

          {/* 오른쪽 포스터 및 리뷰 버튼 */}
          <Box flex="1" maxWidth="280px" mb={4}>
            {/* 영화 포스터 이미지 */}
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              borderRadius="lg"
              objectFit="cover"
              width="100%"
              fallback={<Box>이미지를 불러올 수 없습니다.</Box>}
            />
            {/* 리뷰 작성 버튼 */}
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

        {/* 리뷰 목록 섹션 */}
        <Divider borderColor="#3F3F3F" />
        <Box mt={10} width="100%">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg">리뷰</Heading>
          </Flex>
          <ReviewList tmdbId={tmdbId} reviews={reviews} />
        </Box>
      </Container>

      {/* 리뷰 작성 모달 */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseModal}
        tmdbId={tmdbId}
        movie={movie}
      />
    </div>
  );
};

export default MovieDetail;