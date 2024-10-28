// import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Box, Image } from '@chakra-ui/react';


// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Carousel = ({ movies }) => {
  return (
    <Box w="100%" h="600px"> {/* 전체 컨테이너 크기 조정 */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1} // 한 번에 보이는 슬라이드 수 조정
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              h="100%"
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width="100%"
                height="600px"
                objectFit="cover"
                objectPosition="center 20%" // 이미지 중앙 상단 부분에 초점
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

Carousel.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      posterUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Carousel;
