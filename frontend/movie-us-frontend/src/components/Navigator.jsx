import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import { UnlockIcon } from "@chakra-ui/icons";
import { userStore } from "./../../store";

const Navigator = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
      transition="height 0.5s ease-in-out"
    >
      <Flex
        direction={"column"}
        align={"center"}
        position={"absolute"}
        top="10px"
        right="50px"
      >
        <UnlockIcon boxSize={"15px"} />{" "}
        <a href="/" style={{ fontSize: "15px" }}>
          로그아웃
        </a>
      </Flex>
      <Flex align="flex-end" justify="center" height="inherit" pb={"15px"}>
        {/* 왼쪽 메뉴 아이템들 */}
        <HStack spacing={32} flex="1" justify="flex-end">
          <NavLink to="/movies">영화</NavLink>
          <NavLink to="/ticket">예매</NavLink>
        </HStack>

        {!isScrolled ? ( // 스크롤 여부에 따라 로고 표시 여부 결정
          <Box px={32} transform="translateY(-5px)">
            <ChakraLink
              as={RouterLink}
              to="/main"
              _hover={{ textDecoration: "none" }}
            >
              <Heading size="3xl" color="brand.primary">
                Movie us
              </Heading>
            </ChakraLink>
          </Box>
        ) : (
          <Box px={16}></Box>
        )}

        {/* 오른쪽 메뉴 아이템들 */}
        <HStack spacing={32} flex="1" justify="flex-start">
          <NavLink to="/community">리뷰</NavLink>
          <NavLink to="/mypage">MY</NavLink>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigator;
