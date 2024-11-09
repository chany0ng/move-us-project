// 필요한 라이브러리 및 컴포넌트 임포트
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // URL 파라미터를 가져오기 위한 hook
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
} from "@chakra-ui/react";  // UI 컴포넌트 라이브러리
import { AiFillHeart} from "react-icons/ai";  // 하트 아이콘

// API 및 에셋 임포트
import { getData, postData, deleteData } from "../../api/axios";  // API 호출 함수
import netflixLogo from '../../assets/images/ott/Netflix.png';
import tvingLogo from '../../assets/images/ott/Tving.png';
import ReviewModal from "../../components/ReviewModal";  // 리뷰 작성 모달 컴포넌트
import ReviewList from "../../components/ReviewList.jsx";  // 리뷰 목록 컴포넌트

const MovieDetail = () => {
  // URL에서 영화 ID 파라미터 추출
  const { tmdbId } = useParams();
  
  // 상태 관리
  const [movie, setMovie] = useState(null);  // 영화 정보 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);  // 리뷰 모달 표시 여부
  const [isWishlist, setIsWishlist] = useState(false);  // 찜 상태
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [runtime, setRuntime] = useState(null);  // runtime 상태 
  const [movieReviews, setMovieReviews] = useState([]); // 영화 리뷰 상태
  const [favoriteId, setFavoriteId] = useState(null);  // favorite pk값 저장을 위한 state 추가

  // TMDB 이미지 기본 URL (프로필 이미지용)
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

  const userNum = 1; // 임시 유저 번호 설정

  // 모든 영화 관련 데이터 가져오기
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!tmdbId) return;

      try {
        const [
          movieResponse,
          creditsResponse,
          runtimeResponse,
          reviewsResponse,
          favoritesResponse
        ] = await Promise.all([
          getData(`/movies/${tmdbId}`),
          getData(`/movies/${tmdbId}/credits`),
          getData(`/movies/${tmdbId}/runtime`),
          getData(`/api/review/movieReview/${tmdbId}`),
          getData(`/api/favorites`)
        ]);

        // 영화 상세 정보 설정
        if (movieResponse?.data) {
          setMovie(movieResponse.data);
        }

        // 출연진 정보 설정
        if (creditsResponse?.data) {
          setCredits(creditsResponse.data);
        }

        // 상영 시간 설정
        if (runtimeResponse?.data) {
          setRuntime(runtimeResponse.data.runtime);
        }

        // 리뷰 설정
        if (reviewsResponse?.data) {
          setMovieReviews(reviewsResponse.data);
        }

        // 찜하기 상태 설정
        if (favoritesResponse?.data) {
          const favoriteItem = favoritesResponse.data.find(
            item => item.movie.tmdbId === parseInt(tmdbId)
          );
          setIsWishlist(!!favoriteItem);
          setFavoriteId(favoriteItem?.favoriteId || null);
        }

      } catch {
        setMovie(null);
        setCredits({ cast: [], crew: [] });
        setRuntime(null);
        setMovieReviews([]);
        setIsWishlist(false);
        setFavoriteId(null);
      }
    };

    fetchMovieData();
  }, [tmdbId]);

  // 리뷰 목록 새로고침 함수
  const refreshReviews = async () => {
    try {
      const response = await getData(`/api/review/movieReview/${tmdbId}`);
      if (response?.data) {
        setMovieReviews(response.data);
      }
    } catch {
      setMovieReviews([]);
    }
  };

  // 찜하기 토글 함수ㅁ
  const handleWishlist = async () => {
    try {
      setIsWishlist(prev => !prev);

      if (isWishlist) {
        await deleteData(`/api/favorites/${favoriteId}`);
        setFavoriteId(null);
      } else {
        const requestData = {
          user: { userNum },
          movie: { tmdbId: parseInt(tmdbId) }
        };
        await postData('/api/favorites', requestData);
        
        const favoritesResponse = await getData(`/api/favorites`);
        const favoriteItem = favoritesResponse.data.find(
          item => item.movie.tmdbId === parseInt(tmdbId)
        );
        if (favoriteItem) {
          setFavoriteId(favoriteItem.favoriteId);
        }
      }
    } catch {
      setIsWishlist(prev => !prev);
    }
  };

  // 출연진과 감독 정보 추출 함수
  const getCastInfo = () => {
    // 상위 5명의 출연진만 추출
    const castMembers = credits.cast?.slice(0, 5).map(actor => ({
      name: actor.name,
      profilePath: actor.profile_path,
      character: actor.character
    })) || [];
    
    // 감독 정보 찾기
    const director = credits.crew?.find(member => member.job === "Director");
    
    return { 
      castMembers, 
      director: {
        name: director?.name || "정보 없음",
        profilePath: director?.profile_path
      }
    };
  };

  const { castMembers, director } = getCastInfo();

  // 로딩 상태 처리
  if (!movie) return <div>로딩중...</div>;

  // 리뷰 모달 닫기 핸들러 수정
  const handleCloseModal = (isSubmitted = false) => {
    setIsReviewModalOpen(false);
    if (isSubmitted) {
      refreshReviews(); // 리뷰가 제출되었을 때만 리뷰 목록 새로고침
    }
  };

  return (
    <div style={styles.container}>
      <Container maxW="container.xl" flex="1" py={10}>
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          <VStack flex="2" align="start" spacing={4}>
            {/* 영화 제목 */}
            <Flex align="center" gap={4}>
              <Heading size="xl">{movie.title}</Heading>
            </Flex>
            
            {/* 개봉일 정보 */}
            <HStack spacing={4} width="100%" justify="space-between">
              <HStack spacing={4}>
                <Text>개봉일: {movie.releaseDate}</Text>
                {runtime && (
                  <Text ml={10}>런타임 : {Math.floor(runtime / 60)}시간 {runtime % 60}분</Text>
                )}
              </HStack>
              <Button
                onClick={handleWishlist}
                variant="ghost"
                size="md"
                _hover={{ bg: 'transparent' }}
              >
                {/* 찜하기 버튼 */}
                <HStack spacing={1}>
                  {isWishlist ? (
                    <>
                      <AiFillHeart size={24} color="#E53E3E" />
                      <Text color="#E53E3E">찜하기</Text>
                    </>
                  ) : (
                    <>
                      <AiFillHeart size={24} color="#718096" />
                      <Text color="#718096">찜하기</Text>
                    </>
                  )}
                </HStack>
              </Button>
            </HStack>

            <Divider borderColor="#3F3F3F" />

            {/* OTT 서비스 링크 섹션 */}
            <Box sx={styles.ottContainer}>
              <Text sx={styles.ottTitle}>
                시청 가능한 곳
              </Text>
              <HStack spacing={4}>
                <Button
                  as="a"
                  href="https://www.netflix.com/kr/title/81787451"
                  target="_blank"
                  sx={styles.ottButton}
                >
                  <Image 
                    src={netflixLogo} 
                    alt="Netflix" 
                    sx={styles.ottImage} 
                  />
                </Button>
                <Button
                  as="a"
                  href="https://www.tving.com/contents/M000377290"
                  target="_blank"
                  sx={styles.ottButton}
                >
                  <Image 
                    src={tvingLogo} 
                    alt="Tving" 
                    sx={styles.ottImage} 
                  />
                </Button>
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
                      sx={styles.directorImage}
                    />
                  ) : (
                    <Box sx={styles.noImageBox}>
                      이미지 없음
                    </Box>
                  )}
                  <Text sx={styles.directorName}>
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
                          sx={styles.castImage}
                        />
                      ) : (
                        <Box sx={styles.noImageBox}>
                          이미지 없음
                        </Box>
                      )}
                      <Text fontWeight="bold" textAlign="center">
                        {actor.name}
                      </Text>
                      <Text sx={styles.characterText}>
                        {actor.character}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </Box>
            </Flex>
          </VStack>

          <Box sx={styles.posterContainer}>
            <Image
              sx={styles.posterImage}
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              fallback={<Box>이미지를 불러올 수 없습니다.</Box>}
            />
            <Button
              sx={styles.reviewButton}
              colorScheme="blue"
              onClick={() => setIsReviewModalOpen(true)}
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
          <ReviewList reviews={movieReviews} />
        </Box>
      </Container>

      {/* 리뷰 모달 */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseModal}
        tmdbId={tmdbId}
        movie={movie}
        userNum={userNum}
      />
    </div>
  );
};

// 스타일 상수
const styles = {
  // 레이아웃 관련 스타일
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  posterContainer: {
    flex: "1",
    maxWidth: "280px",
    marginBottom: "4"
  },
  ottContainer: {
    width: "100%"
  },

  // 이미지 관련 스타일
  posterImage: {
    borderRadius: "lg",
    objectFit: "cover",
    width: "100%"
  },
  castImage: {
    width: "120px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "md"
  },
  directorImage: {
    width: "120px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "md"
  },
  ottImage: {
    height: "30px"
  },
  noImageBox: {
    width: "120px",
    height: "180px",
    bg: "gray.200",
    borderRadius: "md",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  // 버튼 관련 스타일
  reviewButton: {
    marginTop: "4",
    width: "100%"
  },
  ottButton: {
    variant: "ghost",
    padding: 2,
    cursor: "pointer",
    background: "none",
    _hover: { background: "white" }
  },

  // 텍스트 관련 스타일
  ottTitle: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: 2
  },
  characterText: {
    fontSize: "sm",
    color: "gray.600",
    textAlign: "center"
  },
  directorName: {
    fontSize: "lg",
    fontWeight: "bold",
    textAlign: "center"
  },

  // 구분선 스타일
  divider: {
    borderColor: "#3F3F3F"
  }
};

export default MovieDetail; 