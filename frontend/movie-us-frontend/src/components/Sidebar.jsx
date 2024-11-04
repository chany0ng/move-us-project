import { Box, VStack, Heading, Link } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom"; // 페이지 간 이동 시 사용
const Sidebar = () => {
  const location = useLocation();
  const basicStyle = { bg: "brand.primary", color: "black" };
  const targetStyle = { bg: "none", color: "white" };
  return (
    <Box as="nav" color="white" p="3">
      <VStack align="start" spacing="10">
        <Box>
          <Heading
            size="md"
            p={2}
            mb="3"
            bg="brand.primary"
            sx={
              location.pathname.includes("user-info") ? basicStyle : targetStyle
            }
            _hover={{ bg: "brand.primary", color: "black" }}
          >
            <Link as={NavLink} to="/my-page/user-info">
              회원정보
            </Link>
          </Heading>
          <VStack align="start" spacing="2" pl="5">
            <Link
              as={NavLink}
              color={
                location.pathname.includes("user-info")
                  ? "brand.primary"
                  : "brand.light"
              }
              to="/my-page/user-info"
              fontSize="lg"
              _hover={{ color: "yellow.400" }}
            >
              회원정보 조회
            </Link>
            {/* <Link
              as={NavLink}
              color={
                location.pathname.includes("user-info")
                  ? "brand.primary"
                  : "brand.light"
              }
              to="/my-page/user-info"
              _hover={{ color: "yellow.400" }}
            >
              회원정보 수정
            </Link> */}
          </VStack>
        </Box>

        <Box>
          <Heading
            size="md"
            p={2}
            mb="3"
            cursor="pointer"
            sx={
              location.pathname.includes("user-reservation-history") ||
              location.pathname.includes("user-review-history") ||
              location.pathname.includes("user-liked-movies")
                ? basicStyle
                : targetStyle
            }
            _hover={{ bg: "brand.primary", color: "black" }}
          >
            <Link as={NavLink} to="/my-page/activity/user-reservation-history">
              활동내역
            </Link>
          </Heading>
          <VStack align="start" spacing="2" pl="5">
            <Link
              as={NavLink}
              color={
                location.pathname.includes("user-reservation-history")
                  ? "brand.primary"
                  : "brand.light"
              }
              to="/my-page/activity/user-reservation-history"
              fontSize="lg"
              _hover={{ color: "yellow.400" }}
            >
              예매 내역 조회
            </Link>
            <Link
              as={NavLink}
              color={
                location.pathname.includes("user-review-history")
                  ? "brand.primary"
                  : "brand.light"
              }
              to="/my-page/activity/user-review-history"
              fontSize="lg"
              _hover={{ color: "yellow.400" }}
            >
              리뷰 내역 조회
            </Link>
            <Link
              as={NavLink}
              color={
                location.pathname.includes("user-liked-movies")
                  ? "brand.primary"
                  : "brand.light"
              }
              to="/my-page/activity/user-liked-movies"
              fontSize="lg"
              _hover={{ color: "yellow.400" }}
            >
              내가 좋아요 누른 영화
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
