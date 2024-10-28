import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import NavLink from "./NavLink";

const Navigator = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={"brand.black"}
      borderBottom="1px solid white"
    >
      <Flex align="flex-end" justify="center" height={"12vh"} pb={"20px"}>
        {/* 왼쪽 메뉴 아이템들 */}
        <HStack spacing={16} flex="1" justify="flex-end">
          <NavLink to="/movies">영화</NavLink>
          <NavLink to="/ticket">예매</NavLink>
        </HStack>

        {/* 로고 (중앙 배치) */}
        <Box px={32} transform="translateY(-10px)">
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

        {/* 오른쪽 메뉴 아이템들 */}
        <HStack spacing={16} flex="1" justify="flex-start">
          <NavLink to="/community">커뮤니티</NavLink>
          <NavLink to="/mypage">마이페이지</NavLink>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigator;
