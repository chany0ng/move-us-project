import { Box, Text, VStack, Button, Divider, Flex, Icon, Badge } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUser, FaCalendar, FaEye, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const allNotices = [
  { id: 1, title: "공지사항 1 - 업데이트 내용", content: "이번 업데이트에서는 새로운 기능이 추가되었습니다. \n 사용자 인터페이스가 개선되었으며, 성능 최적화가 이루어졌습니다.", views: 1523 },
  { id: 2, title: "공지사항 2 - 서비스 점검 안내", content: "서비스 점검이 예정되어 있습니다. \n 점검 시간 동안 서비스 이용에 불편이 없도록 미리 준비해 주시기 바랍니다.", views: 2105 },
  { id: 3, title: "공지사항 3 - 이벤트 안내", content: "다가오는 이벤트에 대한 안내입니다. \n 이벤트 기간 동안 특별 할인 혜택이 제공됩니다. 많은 참여 부탁드립니다.", views: 3210 },
  { id: 4, title: "공지사항 4 - 새로운 기능 출시", content: "새로운 기능이 출시되었습니다. \n 사용자는 더 나은 경험을 위해 업데이트를 권장합니다. 구체적인 기능은 홈페이지에서 확인 가능합니다.", views: 1890 },
  { id: 5, title: "공지사항 5 - 보안 업데이트", content: "이번 보안 업데이트는 시스템의 안전성을 높이기 위해 필요합니다. \n 모든 사용자께서는 업데이트를 즉시 진행해 주시기 바랍니다.", views: 2756 },
  { id: 6, title: "공지사항 6 - 유지 보수 공지", content: "정기적인 유지 보수가 실시됩니다. \n 유지 보수 동안 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.", views: 1678 },
  { id: 7, title: "공지사항 7 - 긴급 공지", content: "긴급한 상황이 발생하여 서비스가 일시 중단됩니다. \n 신속한 복구를 위해 최선을 다하고 있으며, 추후 공지를 통해 안내드리겠습니다.", views: 4532 },
  { id: 8, title: "공지사항 8 - 시스템 업그레이드", content: "시스템 업그레이드가 진행됩니다. \n 새로운 시스템은 더 나은 성능과 안정성을 제공합니다. 사용자 여러분의 협조 부탁드립니다.", views: 2345 },
  { id: 9, title: "공지사항 9 - 기능 개선", content: "기존 기능의 개선 사항을 안내드립니다.  \n 사용자 피드백을 반영하여 더 편리하게 사용할 수 있도록 수정하였습니다.", views: 1987 },
  { id: 10, title: "공지사항 10 - 업데이트 내용", content: "이번 업데이트에서는 여러 가지 버그 수정과 기능 개선이 이루어졌습니다. \n 안정적인 서비스 제공을 위해 지속적으로 노력하겠습니다.", views: 2678 },
];

const NoticeDetail = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      const foundNotice = allNotices.find(n => n.id === parseInt(noticeId));
      setNotice(foundNotice);
    };

    fetchNotice();
  }, [noticeId]);

  const getAdjacentNoticeId = (currentId, direction) => {
    const currentIndex = allNotices.findIndex(notice => notice.id === currentId);
    if (direction === 'next' && currentIndex < allNotices.length - 1) {
      return allNotices[currentIndex + 1].id;
    }
    if (direction === 'prev' && currentIndex > 0) {
      return allNotices[currentIndex - 1].id;
    }
    return null;
  };

  const handleNavigate = (direction) => {
    const adjacentId = getAdjacentNoticeId(parseInt(noticeId), direction);
    if (adjacentId) {
      navigate(`/community/notice/${adjacentId}`);
    }
  };

  if (!notice) return <Text>Loading...</Text>;

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
            <Text>2024-11-06</Text>
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
          colorScheme="blue" 
          variant="outline"
          onClick={() => handleNavigate('prev')}
          isDisabled={!getAdjacentNoticeId(parseInt(noticeId), 'prev')}
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
          colorScheme="blue"
          onClick={() => handleNavigate('next')}
          isDisabled={!getAdjacentNoticeId(parseInt(noticeId), 'next')}
        >
          다음 공지
        </Button>
      </Flex>
    </VStack>
  );
};

export default NoticeDetail;