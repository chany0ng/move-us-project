import { BackGroundDiv } from "./Index";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { CustomInput } from "./Index";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleSubmit = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      alert(emailError);
      return;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      alert(phoneError);
      return;
    }

    if (!checks.length(password) || !checks.pattern(password)) {
      alert(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 최소 8자 이상이어야 합니다."
      );
      return;
    }

    if (!checks.match(password, confirmPassword)) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await postData("/api/movies/signup", {
        userName: name,
        userEmail: email,
        userPhone: phone,
        userPw: password,
      });
      console.log(response);
      alert("회원가입 성공!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 비밀번호 유효성 검사 조건
  const checks = {
    length: (pwd) => pwd.length >= 8,
    match: (pwd, confirmPwd) => pwd === confirmPwd,
    pattern: (pwd) => {
      const regex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      return regex.test(pwd);
    },
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
    const phoneRegex = /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/; //-는 선택
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
      <BackGroundDiv
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          px={8}
          py={8}
          w="40vw"
          min-height="100vh"
          textAlign="center"
          boxShadow="lg"
          color="white"
          mx="auto"
        >
          <Box
            p={8}
            my={10}
            height={"fit-content"}
            bg="rgba(24, 24, 27, 0.8)"
            borderRadius={20}
          >
            <Heading size="xl">회원가입</Heading>
            <Text mt={5} fontSize="15px">
              당신만의 특별한 영화 취향을 공유해보세요
              <br />
              Movie-us와 함께라면 더욱 특별한 영화 경험이 시작됩니다
            </Text>

            <VStack p={4} spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontSize="15px">이름</FormLabel>
                <CustomInput
                  type="text"
                  size={"lg"}
                  fontSize={"md"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormControl>

              <FormControl isInvalid={errors.email !== ""}>
                <FormLabel fontSize="15px">이메일</FormLabel>
                <CustomInput
                  type="email"
                  size={"lg"}
                  fontSize={"md"}
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm" mt={1} textAlign={"left"}>
                    {errors.email}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={errors.phone !== ""}>
                <FormLabel fontSize="15px">전화번호</FormLabel>
                <CustomInput
                  type="tel"
                  size={"lg"}
                  fontSize={"md"}
                  value={phone}
                  placeholder="010-1234-5678"
                  onChange={handlePhoneChange}
                />
                {errors.phone && (
                  <Text color="red.500" fontSize="sm" mt={1} textAlign={"left"}>
                    {errors.phone}
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel fontSize="15px">비밀번호</FormLabel>
                <CustomInput
                  type="password"
                  size={"lg"}
                  fontSize={"md"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Flex mt={2} flexWrap="wrap" gap={4}>
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
                    {checks.pattern(password) ? (
                      <CheckIcon color="green.500" mr={2} />
                    ) : (
                      <CloseIcon color="red.500" mr={2} />
                    )}
                    영문, 숫자, 특수문자 포함
                  </Text>
                </Flex>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="15px">비밀번호 확인</FormLabel>
                <CustomInput
                  type="password"
                  size={"lg"}
                  fontSize={"md"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Flex mt={2} flexWrap="wrap">
                  <Box flex="1" minW="250px">
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      display="flex"
                      alignItems="center"
                    >
                      {checks.length(password) &&
                      checks.match(password, confirmPassword) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={2} />
                      )}
                      비밀번호 일치
                    </Text>
                  </Box>
                </Flex>
              </FormControl>
            </VStack>

            <Button width={"90%"} mt="20px" p={6} onClick={handleSubmit}>
              Sign Up
            </Button>

            <Text mt={4} fontSize="15px">
              이미 계정이 존재한다면?{" "}
              <Link as={RouterLink} to="/">
                로그인 하러가기
              </Link>
            </Text>
          </Box>
        </Box>
      </BackGroundDiv>
    </>
  );
};

export default SignUp;
