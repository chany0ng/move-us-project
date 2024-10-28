import { BackGroundDiv } from "./Index";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Button,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  // 비밀번호 유효성 검사 조건
  const checks = {
    length: (pwd) => pwd.length >= 8,
    uppercase: (pwd) => /[A-Z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    special: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  };

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "이메일을 입력해주세요";
    }
    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식이 아닙니다";
    }
    return "";
  };

  // 전화번호 유효성 검사
  const validatePhone = (phone) => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; //-는 선택
    if (!phone) {
      return "전화번호를 입력해주세요";
    }
    if (!phoneRegex.test(phone)) {
      return "올바른 전화번호 형식이 아닙니다";
    }
    return "";
  };

  // 입력 필드 변경 핸들러
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    setErrors((prev) => ({
      ...prev,
      phone: validatePhone(value),
    }));
  };

  return (
    <>
      <BackGroundDiv>
        <Flex
          minHeight="100vh"
          width="full"
          align="center"
          justifyContent="center"
        >
          <Box 
            px={8}
            py={8}
            width="fit-content"
            minWidth="400px"
            maxWidth="700px"
            minHeight="fit-content"  // 최소 높이 설정
            height="auto"            // 높이 자동 조절
            borderRadius={20}
            textAlign="center"
            boxShadow="lg"
            bg="black"
            color="white"
            mx="auto"
          >
            <Box p={8}>
              <Heading size="2xl">Create an account</Heading>
              <Text mt={4} fontSize="18px">
                당신만의 특별한 영화 취향을 공유해보세요
                <br />
                Movie-us와 함께라면 더욱 특별한 영화 경험이 시작됩니다
              </Text>

              <VStack p={4} spacing={4} align="stretch">
                <FormControl isInvalid={errors.email !== ""}>
                  <FormLabel fontSize="18px">이메일</FormLabel>
                  <Input
                    type="email"
                    size="lg"
                    fontSize="18px"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.phone !== ""}>
                  <FormLabel fontSize="18px">전화번호</FormLabel>
                  <Input
                    type="tel"
                    size="lg"
                    fontSize="18px"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                  {errors.phone && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.phone}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="18px">비밀번호</FormLabel>
                  <Input
                    type="password"
                    size="lg"
                    fontSize="18px"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Flex mt={2} flexWrap="wrap">
                    <Box flex="1" minW="250px">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        display="flex"
                        alignItems="center"
                      >
                        {checks.length(password) ? (
                          <CheckIcon color="green.500" mr={2} />
                        ) : (
                          <CloseIcon color="red.500" mr={2} />
                        )}
                        8글자 이상
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        display="flex"
                        alignItems="center"
                      >
                        {checks.uppercase(password) ? (
                          <CheckIcon color="green.500" mr={2} />
                        ) : (
                          <CloseIcon color="red.500" mr={2} />
                        )}
                        대문자 포함
                      </Text>
                    </Box>
                    <Box flex="1" minW="250px">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        display="flex"
                        alignItems="center"
                      >
                        {checks.number(password) ? (
                          <CheckIcon color="green.500" mr={2} />
                        ) : (
                          <CloseIcon color="red.500" mr={2} />
                        )}
                        숫자 포함
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        display="flex"
                        alignItems="center"
                      >
                        {checks.special(password) ? (
                          <CheckIcon color="green.500" mr={2} />
                        ) : (
                          <CloseIcon color="red.500" mr={2} />
                        )}
                        특수문자 포함
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
              </VStack>

              <Button width={"90%"} mt="20px" p={6}>
                Sign Up
              </Button>

              <Text mt={4} fontSize="15px">이미 계정이 존재한다면? <Link as={RouterLink} to="/">로그인 하러가기</Link></Text>

            </Box>
          </Box>
        </Flex>
      </BackGroundDiv>
    </>
  );
};

export default SignUp;
