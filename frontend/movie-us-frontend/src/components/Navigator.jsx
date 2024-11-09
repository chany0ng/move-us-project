import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import MyMenu from "./MyMenu";

const Navigator = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCommunityHover, setIsCommunityHover] = useState(false);
  const [isMyPageHover, setIsMyPageHover] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // 스크롤 위치에 따라 상태 변경
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={"brand.black"}
      borderBottom="1px solid white"
      height={isScrolled ? "8vh" : "inherit"}
      transition="height 0.6s ease-in-out"
    >
      <Flex
        direction={"column"}
        align={"center"}
        position={"absolute"}
        top="20%"
        right="1%"
      >
        <MyMenu />
      </Flex>
      <Flex align="flex-end" justify="center" height="inherit" pb={"15px"}>
        {/* 왼쪽 메뉴 아이템들 */}
        <HStack spacing={32} flex="1" justify="flex-end">
          <NavLink to="/movies">영화 조회</NavLink>
          <NavLink to="/ticketing">영화 예매</NavLink>
        </HStack>

        {!isScrolled ? ( // 스크롤 여부에 따라 로고 표시 여부 결정
          <Box px={32} transform="translateY(-5px)">
            <ChakraLink
              as={RouterLink}
              to="/main"
              _hover={{ textDecoration: "none" }}
            >
              <Heading
                size="3xl"
                color="brand.primary"
                fontFamily="Georgia, serif"
              >
                Movie us
              </Heading>
            </ChakraLink>
          </Box>
        ) : (
          <Box px={16}>
            <ChakraLink
              as={RouterLink}
              to="/main"
              _hover={{ textDecoration: "none" }}
            >
              <Heading
                size="xl"
                color="brand.primary"
                fontFamily="Georgia, serif"
              >
                Movie us
              </Heading>
            </ChakraLink>
          </Box>
        )}

        {/* 오른쪽 메뉴 아이템들 */}
        <HStack spacing={32} flex="1" justify="flex-start">
          {/* 커뮤니티 NavLink */}
          <Box
            position="relative"
            onMouseEnter={() => setIsCommunityHover(true)}
            onMouseLeave={() => setIsCommunityHover(false)}
          >
            <NavLink to="/community/movie-reviews">커뮤니티</NavLink>
            <Box
              position="absolute"
              top="100%"
              left="50%"
              transform="translateX(-50%)"
              width="200px"
              bg="brand.black"
              borderRadius="5px"
              border="1px solid white"
              display={isCommunityHover ? "block" : "none"}
              boxShadow="md"
            >
              <VStack spacing={2} p={2}>
                <ChakraLink
                  as={RouterLink}
                  to="/community/movie-reviews"
                  color="gainsboro"
                >
                  영화 리뷰
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/community/notice"
                  color="gainsboro"
                >
                  공지사항
                </ChakraLink>
              </VStack>
            </Box>
          </Box>

          {/* 마이페이지 NavLink */}
          <Box
            position="relative"
            onMouseEnter={() => setIsMyPageHover(true)}
            onMouseLeave={() => setIsMyPageHover(false)}
          >
            <NavLink to="/my-page/user-info">마이페이지</NavLink>
            <Box
              position="absolute"
              top="100%"
              left="50%" // 가운데 정렬을 위한 설정
              transform="translateX(-50%)" // 정확히 가운데 위치하도록 이동
              width="200px"
              bg="brand.black"
              borderRadius="5px"
              border="1px solid white"
              display={isMyPageHover ? "block" : "none"}
              boxShadow="md"
            >
              <VStack spacing={2} p={2}>
                <ChakraLink
                  as={RouterLink}
                  to="/my-page/user-info"
                  color="gainsboro"
                >
                  회원정보 조회
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/my-page/activity/user-reservation-history"
                  color="gainsboro"
                >
                  예매 내역 조회
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/my-page/activity/user-review-history"
                  color="gainsboro"
                >
                  리뷰 내역 조회
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/my-page/activity/user-liked-movies"
                  color="gainsboro"
                >
                  내가 좋아요 누른 영화
                </ChakraLink>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigator;
