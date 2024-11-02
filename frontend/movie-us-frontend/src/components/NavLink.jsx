import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NavLink = ({ to, children }) => {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      color="white"
      fontSize={"lg"}
      fontFamily={"Noto Sans KR"}
      fontWeight={"bold"}
      transition="all 0.3s ease-in-out" // 모든 변화에 트랜지션 추가
      _hover={{
        color: "brand.primary",
        textDecoration: "underline",
        textUnderlineOffset: "8px",
        textDecorationThickness: "2px",
      }}
    >
      {children}
    </ChakraLink>
  );
};

export default NavLink;
