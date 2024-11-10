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
} from "@chakra-ui/react";
import { MdReportProblem } from 'react-icons/md';
import { useRef } from 'react';

const ReportButton = ({ reviewId, onReportSubmit, size = "sm" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleReportClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const handleConfirm = () => {
    onReportSubmit?.(reviewId);
    alert(`리뷰 ${reviewId}번에 대한 신고가 접수되었습니다.`);
    onClose();
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
          <AlertDialogContent bg="#333">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              리뷰 신고
            </AlertDialogHeader>
            <AlertDialogBody>
              이 리뷰를 신고하시겠습니까?
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
    </>
  );
};

export default ReportButton; 