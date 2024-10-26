// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "'Pretendard', sans-serif", // 기본 본문 폰트
    heading: "'Noto Sans KR', sans-serif", // 제목 폰트
  },
  styles: {
    global: {
      body: {
        bg: "brand.black",
        color: "brand.white",
      },
    },
  },
  fontSizes: {
    lg: "2rem",
    md: "1.5rem",
    sm: "1rem",
  },
  colors: {
    brand: {
      primary: "#F7CE46", // 원하는 버튼 색상
      black: "#18181B",
      white: "#FFFFFF",
      light: "#F8E8E1",
      dark: "#A6725C",
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: "brand.primary",
          color: "brand.black",
          _hover: {
            bg: "brand.primary", // hover 효과 색상
          },
        },
      },
    },
  },
});

export default theme;
