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
  
  const ReviewModal = ({ isOpen, onClose, tmdbId, movie, onReviewSubmitted, userNum }) => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
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
        await postData("/api/review", {
          userNum: userNum,
          movieId: tmdbId,
          rating: rating * 2,
          comment: content,
        });
  
        toast({
          title: "리뷰가 등록되었습니다",
          status: "success",
          duration: 3000,
        });
  
        onReviewSubmitted?.();
        onClose(true);
        setRating(0);
        setContent("");
      } catch (error) {
        const errorMessage = error.response?.data;
        
        if (errorMessage === "해당 영화에 대한 리뷰가 이미 존재합니다.") {
          toast({
            title: "리뷰 등록 실패",
            description: "이미 이 영화에 대한 리뷰를 작성하셨습니다.",
            status: "error",
            duration: 3000,
          });
        } else {
          toast({
            title: "리뷰 등록 실패",
            description: "리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
            status: "error",
            duration: 3000,
          });
        }
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