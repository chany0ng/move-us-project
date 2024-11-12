import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { userStore } from "./../../store";
import { useNavigate } from "react-router-dom";
const MyMenu = () => {
  const { user, clearUser } = userStore();
  const navigate = useNavigate();
  const logoutHandler = () => {
    clearUser();
    localStorage.removeItem("accessToken");
    navigate("/");
  };
  return (
    <>
      {user.user_name ? (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            sx={{
              bg: "brand.primary",
              color: "black",
              _hover: {
                bg: "brand.primaryHover",
              },
              _active: {
                bg: "brand.primary",
              },
            }}
          >
            {user.user_name} 님
          </MenuButton>
          <MenuList sx={{ bg: "#2f2f2f", p: "10px" }}>
            <MenuItem
              sx={{
                bg: "#2f2f2f",
                pt: "10px",
                pb: "10px",
                borderRadius: "8px",
                _hover: {
                  bg: "#464646",
                },
              }}
              onClick={() => navigate("/my-page/user-info")}
            >
              내 정보 조회/수정
            </MenuItem>
            <MenuItem
              sx={{
                bg: "#2f2f2f",
                borderRadius: "8px",
                pt: "10px",
                pb: "10px",
                _hover: {
                  bg: "#464646",
                },
              }}
              onClick={() =>
                navigate("/my-page/activity/user-reservation-history")
              }
            >
              내 예매 내역
            </MenuItem>
            <MenuItem
              sx={{
                bg: "#2f2f2f",
                borderRadius: "8px",
                pt: "10px",
                pb: "10px",
                _hover: {
                  bg: "#464646",
                },
              }}
              onClick={() => navigate("/my-page/activity/user-review-history")}
            >
              내가 작성한 리뷰
            </MenuItem>
            <MenuDivider />
            <MenuItem
              sx={{
                bg: "#2f2f2f",
                borderRadius: "8px",
                pt: "10px",
                pb: "10px",
                _hover: {
                  bg: "#464646",
                },
              }}
              onClick={logoutHandler}
            >
              로그아웃
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            onClick={() => navigate("/")}
            sx={{
              bg: "brand.primary",
              color: "black",
              _hover: {
                bg: "brand.primaryHover",
              },
              _active: {
                bg: "brand.primary",
              },
            }}
          >
            로그인
          </MenuButton>
        </Menu>
      )}
    </>
  );
};

export default MyMenu;
