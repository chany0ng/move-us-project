import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    HStack,
    useToast,
  } from "@chakra-ui/react";
  import { StarIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  import { postData } from "../api/axios";
  import { Input } from "@chakra-ui/react";
  
  const ReviewModal = ({ isOpen, onClose, movieId, movie, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async () => {
      if (rating === 0) {
        toast({
          title: "평점을 선택해주세요",
          status: "warning",
          duration: 3000,
        });
        return;
      }
  
      if (!content.trim()) {
        toast({
          title: "리뷰 내용을 입력해주세요",
          status: "warning",
          duration: 3000,
        });
        return;
      }
  
      setIsSubmitting(true);
      try {
        await postData("/reviews", {
          movieId,
          rating,
          content,
        });
  
        toast({
          title: "리뷰가 등록되었습니다",
          status: "success",
          duration: 3000,
        });
  
        onReviewSubmitted?.(); // 리뷰 목록 새로고침
        onClose();
        setRating(0);
        setContent("");
      } catch (error) {
        toast({
          title: "리뷰 등록에 실패했습니다",
          description: error.response?.data?.message || "다시 시도해주세요",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleClose = () => {
      setRating(0);
      setContent("");
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="brand.black">
          <ModalHeader>리뷰 작성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>영화 제목</FormLabel>
            <Input
                value={movie?.title || ''}
                isReadOnly={!!movie?.title}
                bg="gray.900"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>평점</FormLabel>
              <HStack spacing={2}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <StarIcon
                    key={value}
                    color={value <= rating ? "yellow.400" : "gray.200"}
                    cursor="pointer"
                    onClick={() => setRating(value)}
                    w={6}
                    h={6}
                  />
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>리뷰 내용</FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="영화에 대한 리뷰를 작성해주세요"
                rows={6}
              />
            </FormControl>
          </ModalBody>
  
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              등록하기
            </Button>
            <Button 
              backgroundColor="gray.900" 
              color="white" 
              variant="ghost" 
              onClick={handleClose}
              _hover={{
                backgroundColor: 'gray.700'  // hover 시 배경색 변경
              }}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ReviewModal; 