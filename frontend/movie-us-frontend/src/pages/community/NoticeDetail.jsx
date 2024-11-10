import { Box, Text, VStack, Button, Divider, Flex, Icon, Badge } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUser, FaCalendar, FaEye, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getData } from "../../api/axios";
import { useToast } from "@chakra-ui/react";

// 날짜 포맷 함수
function formatDate(dateString) {
  if (!dateString) return "날짜 정보 없음";
  
  // 날짜 문자열에서 마이크로초 부분 제거
  const cleanDateString = dateString.split('.')[0]; // "2024-11-07 15:34:22" 형태로 변환
  const date = new Date(cleanDateString.replace(' ', 'T')); // 공백을 'T'로 바꿔 ISO 8601 형식으로 변환
  
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "날짜 정보 없음";
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const NoticeDetail = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [isFirstNotice, setIsFirstNotice] = useState(false);
  const [isLastNotice, setIsLastNotice] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchNotice = async () => {
      if (!noticeId) {
        toast({
          title: "오류",
          description: "공지사항 ID가 유효하지 않습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const response = await getData(`/api/notice/${noticeId}`);
        setNotice({
          id: response.data.notice_id,
          title: response.data.title,
          content: response.data.content,
          date: formatDate(response.data.createdAt),
          views: Math.floor(Math.random() * 5000) + 1000 // 임의의 조회수 추가 (1000 ~ 6000)
        });
        
        // 이전 공지사항 존재 여부 확인
        setIsFirstNotice(parseInt(noticeId) <= 1);

        // 다음 공지사항 존재 여부 확인
        try {
          await getData(`/api/notice/${parseInt(noticeId) + 1}`);
          setIsLastNotice(false);
        } catch (error) {
          setIsLastNotice(true);
        }
      } catch (error) {
        console.error("공지사항 상세 조회 에러:", error.response || error);
        toast({
          title: "공지사항 조회 오류",
          description: `상세 정보를 가져오는데 실패했습니다: ${error.response?.data?.message || error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchNotice();
  }, [noticeId, toast]);

  if (!notice) return <Text>로딩 중...</Text>;

  const buttonStyle = {
    base: {
      colorScheme: "blue",
      variant: "outline",
    },
    disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      _hover: { bg: "initial" }
    }
  };

  return (
    <VStack spacing={4} align="stretch" maxW="1000px" m="auto" pt={8} pb={8} mt={10}>
      <Box p={8} bg="gray.800" borderRadius="lg" boxShadow="xl" minHeight="400px">
        <Badge colorScheme="yellow" fontSize="md" mb={4}>공지사항</Badge>
        <Text fontSize="3xl" fontWeight="bold" color="white" mb={4}>
          {notice.title}
        </Text>
        <Flex color="gray.400" fontSize="sm" mb={6} alignItems="center">
          <Flex alignItems="center" mr={6}>
            <Icon as={FaUser} mr={2} />
            <Text>관리자</Text>
          </Flex>
          <Flex alignItems="center" mr={6}>
            <Icon as={FaCalendar} mr={2} />
            <Text>{notice.date}</Text>
          </Flex>
          <Flex alignItems="center">
            <Icon as={FaEye} mr={2} />
            <Text>{notice.views.toLocaleString()} 조회</Text>
          </Flex>
        </Flex>
        <Divider mb={6} />
        <Text color="gray.200" fontSize="lg" lineHeight="tall" whiteSpace="pre-line">
          {notice.content}
        </Text>
      </Box>

      <Flex justifyContent="space-between" mt={6}>
        <Button 
          leftIcon={<Icon as={FaArrowLeft} />}
          {...buttonStyle.base}
          onClick={() => navigate(`/community/notice/${parseInt(noticeId) - 1}`)}
          isDisabled={isFirstNotice}
          _disabled={buttonStyle.disabled}
        >
          이전 공지
        </Button>
        <Button 
          colorScheme="yellow" 
          onClick={() => navigate("/community/notice")}
        >
          목록으로
        </Button>
        <Button 
          rightIcon={<Icon as={FaArrowRight} />}
          {...buttonStyle.base}
          onClick={() => navigate(`/community/notice/${parseInt(noticeId) + 1}`)}
          isDisabled={isLastNotice}
          _disabled={buttonStyle.disabled}
        >
          다음 공지
        </Button>
      </Flex>
    </VStack>
  );
};

export default NoticeDetail;