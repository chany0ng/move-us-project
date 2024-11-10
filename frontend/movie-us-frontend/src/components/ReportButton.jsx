import {
  IconButton,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Textarea,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Select
} from "@chakra-ui/react";
import { MdReportProblem } from 'react-icons/md';
import { useRef, useState } from 'react';
import { postData } from "../api/axios";

const ReportButton = ({ reviewId, onReportSubmit, size = "sm" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [reportComment, setReportComment] = useState("");
  const [reportReason, setReportReason] = useState("");

  const handleReportClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const handleConfirm = async () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    if (reportReason === "기타" && !reportComment.trim()) {
      alert("구체적인 신고 사유를 입력해주세요.");
      return;
    }

    try {
      const reportData = {
        reviewId: reviewId,
        reportReason: reportReason,
        reportComment: reportReason === "기타" ? reportComment : reportReason,
      };

      const response = await postData('/api/review/report', reportData);
      
      if (response.status === 201) {
        alert("리뷰 신고가 접수되었습니다.");
        onReportSubmit?.(reportData);
        setReportComment("");
        setReportReason("");
        onClose();
      }
    } catch (error) {
      console.error("신고 처리 중 오류 발생:", error);
      if (error.response?.status === 400) {
        alert(error.response.data || "신고 처리 중 오류가 발생했습니다.");
      } else {
        alert("신고 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <Tooltip label="리뷰 신고하기" placement="top">
        <IconButton
          icon={<MdReportProblem />}
          variant="ghost"
          size={size}
          aria-label="리뷰 신고"
          color="red.400"
          onClick={handleReportClick}
          _hover={{ bg: 'gray.700' }}
        />
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              리뷰 신고
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack spacing={4} align="stretch">
                <Text>이 리뷰를 신고하시겠습니까?</Text>
                <FormControl>
                  <FormLabel color="gray.300">신고 사유:</FormLabel>
                  <Select 
                    value={reportReason} 
                    onChange={(e) => setReportReason(e.target.value)}
                    bg="gray.700"
                    color="white"
                    mb={3}
                    sx={{
                      option: {
                        bg: 'gray.800',
                        color: 'white',
                        _hover: {
                          bg: 'gray.700'
                        }
                      }
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#2D3748', color: 'white' }}>신고 사유를 선택해주세요</option>
                    <option value="부적절한 내용" style={{ backgroundColor: '#2D3748', color: 'white' }}>부적절한 내용</option>
                    <option value="스포일러" style={{ backgroundColor: '#2D3748', color: 'white' }}>스포일러</option>
                    <option value="홍보/광고" style={{ backgroundColor: '#2D3748', color: 'white' }}>홍보/광고</option>
                    <option value="기타" style={{ backgroundColor: '#2D3748', color: 'white' }}>기타</option>
                  </Select>
                  
                  {reportReason === "기타" && (
                    <Textarea
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      placeholder="구체적인 신고 사유를 입력해주세요"
                      bg="gray.700"
                      color="white"
                      minH="100px"
                      mb={3}
                    />
                  )}
                </FormControl>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleConfirm} 
                ml={3}
              >
                신고하기
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ReportButton; 