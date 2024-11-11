import {
  VStack,
  Box,
  Text,
  Flex,
  Avatar,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { StarIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import ReportButton from './ReportButton';
import ReviewMenu from './ReviewMenu';

// 리뷰 목록 컴포넌트
const ReviewList = ({ reviews, currentUserNum, onEditReview, onDeleteReview }) => {
  console.log('Reviews data:', reviews);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [dialogType, setDialogType] = useState('');

  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDialogType('delete');
    onOpen();
  };

  const handleConfirm = () => {
    if (dialogType === 'delete') {
      onDeleteReview(selectedReviewId);
    }
    onClose();
  };

  if (!reviews) return <Text>리뷰를 불러오는 중...</Text>;

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {reviews.length === 0 ? (
        <Text textAlign="center" color="gray.500">첫 번째 리뷰를 작성해보세요!</Text>
      ) : (
        reviews.map((review) => (
          <Box 
            key={review.userNum}
            p={4} 
            borderColor="#3F3F3F"
            borderWidth="1px" 
            borderRadius="lg"
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={4}>
                <Avatar size="sm" name={review.username || `User ${review.userNum}`} />
                <Text fontWeight="bold">{review.username || `User ${review.userNum}`}</Text>
              </Flex>
              <Flex align="center" gap={4}>
                <Text fontSize="sm" color="gray.500">
                  {new Date(review.reviewDate).toLocaleDateString('ko-KR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(/\. /g, '.').replace('시 ', ':').replace('분', '').replace(/(\d{2}:\d{2})/, ' $1')}
                </Text>
                <Flex>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      as={StarIcon}
                      color={i < (review.rating / 2) ? "yellow.400" : "gray.300"}
                    />
                  ))}
                </Flex>
                {currentUserNum === review.userNum ? (
                  <ReviewMenu 
                    review={review}
                    onEditReview={onEditReview}
                    onDeleteClick={handleDeleteClick}
                  />
                ) : (
                  <ReportButton 
                    reviewId={review.reviewId}
                    onReportSubmit={(reportData) => {
                      console.log('신고 데이터:', reportData);
                      // 여기에 신고 API 호출 로직 추가
                    }}
                  />
                )}
              </Flex>
            </Flex>
            <Text>{review.comment}</Text>
          </Box>
        ))
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#333">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              리뷰 삭제
            </AlertDialogHeader>

            <AlertDialogBody>
              이 리뷰를 삭제하시겠습니까?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default ReviewList; 