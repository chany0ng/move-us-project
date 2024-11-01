import { Box, Text, Link, Stack, HStack, VStack } from "@chakra-ui/react";
import styled from "styled-components";
const Footer = () => {
  return (
    <FooterContainer as="footer">
      <Stack
        direction={["column", "row"]}
        spacing={8}
        justify="space-between"
        maxW="1200px"
        margin="0 auto"
        padding="10px"
      >
        {/* Left Section */}
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
            Movie us
          </Text>
          <Text>© 2024 Movie us All rights reserved.</Text>
          <Text>Project by U-CAMP Team 3</Text>
        </VStack>

        {/* Middle Section (Quick Links) */}
        <VStack align="start">
          <Text fontSize="lg" fontWeight="bold">
            Quick Links
          </Text>
          <Link href="/main" color="#D9D9D9">
            홈 화면
          </Link>
          <Link href="/" color="#D9D9D9">
            로그인
          </Link>
          <Link href="/signup" color="#D9D9D9">
            회원가입
          </Link>
          <Link href="/terms" color="#D9D9D9">
            Terms of Service
          </Link>
        </VStack>

        {/* Right Section (Contact & Social Media) */}
        <VStack align="start">
          <Text fontSize="lg" fontWeight="bold">
            Contact & Development
          </Text>
          <Text>
            <Link
              href="https://github.com/chany0ng/move-us-project"
              target="_blank"
              color="#D9D9D9"
            >
              Github
            </Link>
          </Text>
          <Link
            href="https://developer.themoviedb.org/reference/intro/getting-started"
            target="_blank"
            color="#D9D9D9"
          >
            API Reference
          </Link>
        </VStack>
      </Stack>
    </FooterContainer>
  );
};

const FooterContainer = styled(Box)`
  background-color: #333;
  color: #fff;
  padding: 20px;
`;

export default Footer;
