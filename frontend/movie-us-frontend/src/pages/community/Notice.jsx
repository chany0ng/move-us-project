import { Box, Text, VStack, Link, Button, Flex, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AiFillFolder } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { getData } from "../../api/axios"; // API 호출을 위한 axios 모듈

const Notice = () => {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/notice");
        setNotices(response.data || []);
      } catch (error) {
        toast({
          title: "공지사항 조회 Error",
          description: `Failed to fetch notices / ${error.toString()}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [toast]);

  const visibleNotices = notices.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(notices.length);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCollapse = () => {
    setVisibleCount(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <Text color="white">로딩 중...</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" maxW="700px" m="auto" pt={50} pb={8}>
      <Box color="white" p={5}>
        <Flex align={"center"} gap={3} p={2} mb={3}>
          <AiFillFolder size={40} />
          <Heading fontSize={"4xl"}>공지사항</Heading>
        </Flex>
        <Flex align={"center"} gap={3} pl={3} color="#cfcfcf">
          <Text fontSize={"lg"} fontWeight={"bold"}>
            총 {notices.length}건의 공지사항이 검색되었습니다
          </Text>
        </Flex>
      </Box>

      {visibleNotices.map((notice, index) => (
        <Box
          key={notice.noticeId}
          p={4}
          bg="gray.700"
          borderRadius="md"
          _hover={{ bg: "gray.600" }}
        >
          <Link as={RouterLink} to={`/community/notice/${notice.noticeId}`} color="yellow.400">
            <Text fontSize="20px">공지사항 {index + 1} - {notice.title}</Text>
          </Link>
        </Box>
      ))}

      {visibleCount < notices.length ? (
        <Button
          mt={4}
          variant="outline"
          colorScheme="yellow"
          onClick={handleLoadMore}
        >
          More Notices
        </Button>
      ) : notices.length > 5 && (
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