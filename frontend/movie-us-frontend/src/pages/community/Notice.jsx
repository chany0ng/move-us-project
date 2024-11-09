import { Box, Text, VStack, Link, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Notice = () => {
  // 전체 공지사항 목록
  const allNotices = [
    { id: 1, title: "공지사항 1 - 업데이트 내용" },
    { id: 2, title: "공지사항 2 - 서비스 점검 안내" },
    { id: 3, title: "공지사항 3 - 이벤트 안내" },
    { id: 4, title: "공지사항 4 - 새로운 기능 출시" },
    { id: 5, title: "공지사항 5 - 보안 업데이트" },
    { id: 6, title: "공지사항 6 - 유지 보수 공지" },
    { id: 7, title: "공지사항 7 - 긴급 공지" },
    { id: 8, title: "공지사항 8 - 시스템 업그레이드" },
    { id: 9, title: "공지사항 9 - 기능 개선" },
    { id: 10, title: "공지사항 10 - 업데이트 내용" },
    // 추가 공지사항 데이터...
  ];

  // 현재 표시할 공지사항 수 상태 (초기값: 5)
  const [visibleCount, setVisibleCount] = useState(5);

  // 현재 표시 중인 공지사항 리스트
  const visibleNotices = allNotices.slice(0, visibleCount);

  // 'More Notices' 버튼 클릭 시 공지사항 더 보기
  const handleLoadMore = () => {
    setVisibleCount(allNotices.length); // 전체 공지사항 표시
    // 스크롤을 아래로 부드럽게 이동
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // '접기' 버튼 클릭 시 초기 상태로 되돌리고, 스크롤을 상단으로 이동
  const handleCollapse = () => {
    setVisibleCount(5); // 다시 처음 다섯 개만 표시
    window.scrollTo({ top: 0, behavior: "smooth" }); // 스크롤을 상단으로 부드럽게 이동
  };

  return (
    <VStack spacing={4} align="stretch" maxW="700px" m="auto" pt={50} pb={8}>
      {visibleNotices.map((notice) => (
        <Box
          key={notice.id}
          p={4}
          bg="gray.700"
          borderRadius="md"
          _hover={{ bg: "gray.600" }}
        >
          <Link as={RouterLink} to={`/community/notice/${notice.id}`} color="yellow.400">
            <Text fontSize="20px">{notice.title}</Text>
          </Link>
        </Box>
      ))}

      {/* More Notices / 접기 버튼 */}
      {visibleCount < allNotices.length ? (
        <Button
          mt={4}
          variant="outline"
          colorScheme="yellow"
          onClick={handleLoadMore}
        >
          More Notices
        </Button>
      ) : (
        <Button
          mt={4}
          variant="outline"
          colorScheme="yellow"
          onClick={handleCollapse}
        >
          접기
        </Button>
      )}
    </VStack>
  );
};

export default Notice;