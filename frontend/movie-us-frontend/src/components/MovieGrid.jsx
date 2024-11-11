import {
  Box,
  Image,
  Heading,
  IconButton,
  Button,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { Link } from "react-router-dom";

// Swiper 스타일 import
import "swiper/css";
import "swiper/css/navigation";

const MovieGrid = ({ movies, title, isLoading, likedMovies }) => {
  const swiperRef = useRef(null);

  return (
    <Box mb={5}>
      <Heading
        fontSize="2xl"
        mb={3}
        px="6%"
        color="white"
        fontFamily={"NanumSquareRound"}
      >
        {title}
      </Heading>
      <SwiperContainer>
        <NavigationButton
          icon={<ChevronLeftIcon w={8} h={8} />}
          aria-label="Previous slides"
          position="absolute"
          left="0"
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          color="var(--primary-color)"
        />

        <StyledSwiper
          ref={swiperRef}
          modules={[Navigation]}
          navigation={false} // 기본 네비게이션 비활성화
          slidesPerView={4}
          spaceBetween={"10px"}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            700: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1400: {
              slidesPerView: 4,
              spaceBetween: "10px",
            },
          }}
        >
          {isLoading ? (
            // 로딩 중일 때 Skeleton 표시
            Array.from({ length: 5 }).map((_, index) => (
              <SwiperSlide key={index}>
                <Box
                  key={index}
                  position="relative"
                  width="200px"
                  height="300px"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Skeleton height="100%" />
                </Box>
              </SwiperSlide>
            ))
          ) : movies && movies.length !== 0 ? (
            // 데이터가 있을 때 실제 콘텐츠 표시
            movies.map((movie, index) => (
              <SwiperSlide key={index}>
                <MovieBox position="relative">
                  <StyledImage
                    src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                    alt={movie.title}
                  />
                  <Box
                    position="absolute"
                    bottom="-10px"
                    left="5px"
                    color="white"
                    fontWeight="extrabold"
                    borderRadius="md"
                    fontSize="4rem"
                    fontFamily={"Noto Sans KR"}
                    fontStyle={"italic"}
                  >
                    {index + 1}
                  </Box>
                  <DescriptionBox>
                    <Heading as="h4" size="md" mb={10}>
                      {movie.title}
                    </Heading>
                    {movie.scrn_cnt ? (
                      <Flex direction="column">
                        <Box fontSize="lg">개봉일: {movie.release_date}</Box>
                        <Box fontSize="lg">상영관 수: {movie.scrn_cnt}</Box>
                      </Flex>
                    ) : (
                      <Flex>
                        <Link to={`/movie-detail/${movie.id}`}>
                          <Button
                            colorScheme="brand.primary"
                            variant={"outline"}
                            mr={5}
                            mx={movie.exists_in_db ? "none" : "auto"}
                          >
                            상세정보
                          </Button>
                        </Link>
                        {movie.exists_in_db && (
                          <Link to={`/ticketing/${movie.indexId}`}>
                            <Button colorScheme="teal">예매하기</Button>
                          </Link>
                        )}
                      </Flex>
                    )}
                  </DescriptionBox>
                </MovieBox>
              </SwiperSlide>
            ))
          ) : (
            // 로딩 완료 후 데이터가 없을 때 메시지 표시
            <Flex
              justify={"center"}
              align={"center"}
              direction="column"
              minHeight="inherit"
              gap={5}
            >
              <CloseIcon color="red" />
              {likedMovies ? (
                <Heading fontSize="lg">관심목록이 없습니다</Heading>
              ) : (
                <div>
                  <Heading fontSize="lg" fontWeight={"medium"}>
                    영화가 존재하지 않습니다!
                  </Heading>
                  <Button onClick={() => window.location.reload()}>
                    새로고침
                  </Button>
                </div>
              )}
            </Flex>
          )}
        </StyledSwiper>

        <NavigationButton
          icon={<ChevronRightIcon w={8} h={8} />}
          aria-label="Next slides"
          position="absolute"
          right="0"
          onClick={() => swiperRef.current?.swiper.slideNext()}
          color="var(--primary-color)"
        />
      </SwiperContainer>
    </Box>
  );
};

export default MovieGrid;

// styled-components
const StyledSwiper = styled(Swiper)`
  width: 100%;
`;

const MovieBox = styled(Box)`
  border-radius: 8px;
  overflow: hidden;
  width: 245px;
  height: 352px;
  transition: transform 0.2s;
  position: relative;
  &:hover {
    transform: translateY(-10px);
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const DescriptionBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex; /* flexbox 사용하여 내용 정렬 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  color: white; /* 텍스트 색상 */
  opacity: 0; /* 기본적으로 숨김 */
  transition: opacity 0.2s; /* opacity 변화 애니메이션 */

  ${MovieBox}:hover & {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.7);
  }
`;
const NavigationButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5) !important;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
`;

const SwiperContainer = styled(Box)`
  position: relative;
  padding: 3% 6%;
  margin-bottom: 3%;
`;
