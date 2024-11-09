import { Box, Heading, Divider } from "@chakra-ui/react";
import SimpleMovieGrid from "../../components/SimpleMovieGrid";
import { getData } from "../../api/axios";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import styled from "styled-components";

const MovieReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const processTopMovies = useCallback((reviewsData) => {
    const movieReviewCounts = reviewsData.reduce((acc, review) => {
      const { tmdbId, posterPath } = review;
      if (!acc[tmdbId]) {
        acc[tmdbId] = {
          movieId: tmdbId,
          posterPath,
          reviewCount: 0
        };
      }
      acc[tmdbId].reviewCount += 1;
      return acc;
    }, {});

    const sortedMovies = Object.values(movieReviewCounts)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);

    setTopMovies(sortedMovies);
    setIsLoading(false);
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await getData("/api/review/reviewList");
      setReviews(response.data);
      processTopMovies(response.data);
    } catch (error) {
      toast({
        title: "리뷰 조회 실패",
        description: `Failed to fetch reviews / ${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error fetching reviews:", error);
    }
  }, [toast, processTopMovies]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <Box>
      <Box p={4}>
        <Heading
          fontSize="2xl"
          mt={10}
          mb={6}
          color="white"
          fontFamily={"NanumSquareRound"}
        >
          리뷰 TOP 5
        </Heading>
        <SimpleMovieGrid 
          movies={topMovies} 
          isLoading={isLoading}
          showReviewCount={true}
        />
      </Box> 
      <Divider borderColor="#3F3F3F" />
      
      <Box p={4}>
        <Heading fontSize="2xl" mt={10} mb={6} color="white" fontFamily={"NanumSquareRound"}>
          최신 리뷰
        </Heading>
        <ReviewGrid>
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId}>
              <PosterSection>
                {review.posterPath && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                    alt="Movie poster"
                  />
                )}
              </PosterSection>
              <ReviewContent>
                <h3>영화 : {review.title}</h3>
                <ReviewInfo>
                  <div>User {review.userNum}</div>
                  <div>★ {review.rating?.toFixed(1)}</div>
                </ReviewInfo>
                <p>{review.comment}</p>
                <ReviewDate>
                  {new Date(review.reviewDate).toLocaleDateString()}
                </ReviewDate>
              </ReviewContent>
            </ReviewCard>
          ))}
        </ReviewGrid>
      </Box>
    </Box>
  );
};

const ReviewGrid = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ReviewCard = styled.div`
  width: 100%;
  max-width: 330px;
  background: #2D2D2D;
  border-radius: 8px;
  overflow: hidden;
  color: white;
`;

const PosterSection = styled.div`
  height: 128px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ReviewContent = styled.div`
  padding: 16px;

  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    margin: 12px 0;
  }
`;

const ReviewInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: bold;
`;

const ReviewDate = styled.div`
  font-size: 14px;
  color: #888;
`;

export default MovieReviews;