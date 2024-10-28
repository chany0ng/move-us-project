import styled from "styled-components";
import backgroundImage from "../assets/images/backgroundImage.png";
import kakaoLargeLogin from "../assets/images/kakao_login_large_wide.png";
import {
  Button,
  Flex,
  Box,
  Heading,
  Text,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ChevronRightIcon, CheckIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
const Index = () => {
  return (
    <>
      <BackGroundDiv>
        <Flex>
          <Box
            flex="6.5"
            h="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box width="75%" margin="0 auto">
              <Heading
                mb={20}
                fontWeight="bold"
                fontSize={["2xl", "3xl", "4xl", "8xl"]}
              >
                Movie us
              </Heading>
              <Heading fontSize={["xl", "2xl", "3xl", "45px"]} mb={10}>
                영화 예매 시스템을 넘어, <br /> 영화에 대한 모든 정보를
                찾아보세요
              </Heading>
              <Text fontSize="20px" lineHeight={"1.2"}>
                영화 예고편부터 리뷰까지, 최고의 영화 경험을 제공합니다. <br />
                당신이 좋아하는 영화를 더 쉽고 빠르게 찾아보세요.
              </Text>
              <Button
                mt="24px"
                p={5}
                fontSize="18px"
                borderRadius={"5px"}
                // isLoading
              >
                Get Started <ChevronRightIcon boxSize={6} />
              </Button>
            </Box>
          </Box>

          <Box flex="3.5" bg="rgba(24, 24, 27, 0.8)" h="100vh">
            <Flex
              direction="column"
              align="flex-start"
              justify={"center"}
              gap={5}
              width="70%"
              height="100%"
              margin={"0 auto"}
            >
              <Heading
                mb={15}
                textAlign="left"
                fontWeight="bold"
                fontSize={["xl", "2xl", "3xl", "4xl"]}
              >
                Log in
              </Heading>
              <img
                src={kakaoLargeLogin}
                alt="카카오 로그인"
                style={{ cursor: "pointer" }}
              />
              <Box
                position="relative"
                textAlign="center"
                width={"100%"}
                my={10}
              >
                <Divider
                  orientation="horizontal"
                  position={"absolute"}
                  width="40%"
                  borderColor={"gray"}
                />
                <Text
                  position="absolute"
                  top="-10px"
                  left="50%"
                  transform="translateX(-50%)"
                  color="gainsboro"
                >
                  OR
                </Text>
                <Divider
                  position={"absolute"}
                  left="60%"
                  orientation="horizontal"
                  width="40%"
                  borderColor={"gray"}
                />
              </Box>
              <FormControl /*isInvalid={isError} */>
                <FormLabel fontSize="15px" color="gainsboro">
                  Your Email address
                </FormLabel>
                <CustomInput type="email" size={"lg"} fontSize={"md"} />
                {/* //todo isError시에 메시지 출력하게 설정  <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>

              <FormControl /*isInvalid={isError} */>
                <FormLabel fontSize="15px" color="gainsboro">
                  Your Password
                </FormLabel>
                <CustomInput type="password" size={"lg"} fontSize={"md"} />
                <Flex justify="flex-end" mt={2}>
                  <ChakraLink
                    as={RouterLink}
                    to="/change-pw"
                    textDecoration="underline"
                    fontWeight="thin"
                    fontSize="13px"
                    color="gainsboro"
                  >
                    Forget Your Password
                  </ChakraLink>
                </Flex>
                {/* //todo isError시에 메시지 출력하게 설정  <FormHelperText>We'll never share your password.</FormHelperText> */}
              </FormControl>
              <Button
                mt="24px"
                p={6}
                fontSize="24px"
                fontWeight={"thin"}
                borderRadius={"8px"}
                width="100%"
                // isLoading
              >
                Sign in &nbsp;
                <CheckIcon boxSize={5} />
              </Button>
              <Text color={"gray"} textAlign={"left"} fontSize={"15px"}>
                Movie us 회원이 아닌가요? &nbsp;
                <ChakraLink
                  as={RouterLink}
                  to="/signup"
                  textDecoration="underline"
                  color="white"
                >
                  지금 가입하세요.
                </ChakraLink>
              </Text>
            </Flex>
          </Box>
        </Flex>
      </BackGroundDiv>
    </>
  );
};

export const BackGroundDiv = styled.div`
  position: relative;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
`;

export const CustomInput = styled(Input)`
  border: 1px solid gray !important;
  &:focus {
    border: 0.1px solid #f7ce46 !important;
    box-shadow: 0 0 0 0.5px #f7ce46 !important;
  }
`;

export default Index;
