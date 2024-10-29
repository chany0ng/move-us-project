import {
  Box,
  Image,
  Heading,
  IconButton,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useRef } from "react";

// Swiper 스타일 import
import "swiper/css";
import "swiper/css/navigation";

const MovieGrid = ({ movies, title }) => {
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
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieBox position="relative">
                <StyledImage src={"https://image.tmdb.org/t/p/w500" + movie.posterPath} alt={movie.title} />
                      {/* 좌측 하단 순위 표시 */}
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
                  {movie.id}
                </Box>
                <DescriptionBox>
                  <Heading as="h4" size="md" mb={10}>
                    {movie.title}
                  </Heading>
                  <Flex>
                    <Button
                      colorScheme="brand.primary"
                      variant={"outline"}
                      mr={5}
                    >
                      상세정보
                    </Button>
                    <Button colorScheme="teal">예매하기</Button>
                  </Flex>
                </DescriptionBox>
              </MovieBox>
            </SwiperSlide>
          ))}
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
