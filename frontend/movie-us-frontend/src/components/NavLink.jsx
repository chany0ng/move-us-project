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
      _hover={{
        color: "brand.primary",
        textDecoration: "underline",
        textUnderlineOffset: "10px",
        textDecorationThickness: "3px",
      }}
    >
      {children}
    </ChakraLink>
  );
};

export default NavLink;
