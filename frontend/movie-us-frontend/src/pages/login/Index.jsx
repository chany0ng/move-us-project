import styled from "styled-components";
import backgroundImage from "../../assets/images/backgroundImage.png";
import kakaoLargeLogin from "../../assets/images/kakao_login_large_wide.png";
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
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, CheckIcon, EmailIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getData, postData } from "../../api/axios";
import { userStore } from "../../../store";

//todo 로그인창으로 오기전 path를 기억해내서 로그인 후 redirect 시켜야 한다
//todo location.state.from.pathname || "/main" -> navigate(from, {replace: true})
const Index = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isExist, setIsExist] = useState(true);
  const [isError, setIsError] = useState(false);

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    if (e.target.value?.length < 8) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };
  const changePasswordHandler = async (e) => {
    //todo email을 db에 user찾기를 한다
    if (email.trim().length === 0) {
      toast({
        title: "이메일을 먼저 입력해주세요",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const response = await getData(`/api/movies/check-email/${email}`);
      if (response.data.isDuplicated) {
        alert("해당 이메일에 비밀번호 변경 링크를 발송했습니다!");
        setIsExist(true);
      } else {
        toast({
          title: "존재하지 않는 이메일입니다.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setIsExist(false);
      }
    } catch (error) {
      console.error("Error checking email duplication:", error);
    }
  };
  const kakaoLoginHandler = () => {
    console.log("hi");
    window.location.href = "http://localhost:8080/kakao/login";
  };
  const handleSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "이메일과 비밀번호를 모두 입력해주세요",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    // 로그인 API 호출
    try {
      const response = await postData("/api/movies/login", {
        userEmail: email,
        userPw: password,
      });
      console.log(response);
      // API 호출 성공 후 사용자 정보 zustand store에 저장 및 /main 이동
      if (response.data) {
        userStore.getState().setUser(response.data.user); // 사용자 정보 저장
        navigate("/main");
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error.status === 404) {
        toast({
          title: "존재하지 않는 계정입니다",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } else {
        alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
      console.error("로그인 오류:", error.status);
    }
  };
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
                onClick={() => navigate("/main")}
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
                로그인
              </Heading>
              <img
                src={kakaoLargeLogin}
                onClick={kakaoLoginHandler}
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
              <form onSubmit={handleSubmitHandler} style={{ width: "100%" }}>
                <FormControl sx={{ mb: "15px" }} isInvalid={!isExist}>
                  <FormLabel fontSize="15px" color="gainsboro">
                    이메일
                  </FormLabel>
                  <CustomInput
                    type="email"
                    size={"lg"}
                    fontSize={"md"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!isExist && (
                    <FormErrorMessage>
                      비밀번호 찾기를 원하는 계정 이메일을 입력해주세요
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isInvalid={isError}>
                  <FormLabel fontSize="15px" color="gainsboro">
                    비밀번호
                  </FormLabel>
                  <CustomInput
                    type="password"
                    size={"lg"}
                    fontSize={"md"}
                    value={password}
                    onChange={passwordChangeHandler}
                  />
                  {isError && (
                    <FormErrorMessage>
                      비밀번호는 8자리 이상입니다.
                    </FormErrorMessage>
                  )}
                  <Flex justify="flex-end" mt={2} align={"center"}>
                    <EmailIcon boxSize={4} mr={1} />
                    <ChakraLink
                      textDecoration="underline"
                      fontWeight="thin"
                      fontSize="13px"
                      color="gainsboro"
                      onClick={changePasswordHandler}
                    >
                      비밀번호 찾기
                    </ChakraLink>
                  </Flex>
                </FormControl>
                <Button
                  mt="24px"
                  p={6}
                  fontSize="24px"
                  fontWeight={"thin"}
                  borderRadius={"8px"}
                  width="100%"
                  type="submit"
                  // isLoading
                >
                  Sign in &nbsp;
                  <CheckIcon boxSize={5} />
                </Button>
              </form>
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
  min-height: 100%;
`;

export const CustomInput = styled(Input)`
  border: 1px solid gray !important;
  &:focus {
    border: 0.1px solid #f7ce46 !important;
    box-shadow: 0 0 0 0.5px #f7ce46 !important;
  }
`;

export default Index;
