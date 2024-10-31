import { BackGroundDiv } from "./Index";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { CustomInput } from "./Index";
import { useNavigate, useParams } from "react-router-dom";
import { postData } from "../../api/axios";

const ChangePw = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 비밀번호 유효성 검사 조건
  const checks = {
    length: (pwd) => pwd.length >= 8,
    match: (pwd, confirmPwd) => pwd === confirmPwd,
  };

  const handleSubmitHandler = async (e) => {
    e.preventDefault();
    if (password.length < 8 || passwordConfirm.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다!");
      return;
    } else if (password !== passwordConfirm) {
      alert("비밀번호 동일여부를 확인해주세요!");
      return;
    }
    try {
      const response = await postData("/api/movies/passwordReset", {userEmail: email, userPw: password} );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("비밀번호 변경 중 에러가 발생했습니다!");
    }
  };
  return (
    <BackGroundDiv
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex>
        <Box
          m={"0 auto"}
          bg="rgba(24, 24, 27, 0.8)"
          minH="70vh"
          w="35vw"
          borderRadius="20px"
        >
          <Flex
            direction="column"
            align="center"
            justify={"center"}
            gap={5}
            width="70%"
            height="100%"
            margin={"0 auto"}
          >
            <Heading
              mb={15}
              fontWeight="bold"
              fontSize={["xl", "2xl", "3xl", "4xl"]}
            >
              비밀번호 변경
            </Heading>
            <form onSubmit={handleSubmitHandler} style={{ width: "100%" }}>
              <FormControl>
                <FormLabel fontSize="15px" color="gainsboro">
                  새로운 비밀번호
                </FormLabel>
                <CustomInput
                  type="password"
                  size={"lg"}
                  fontSize={"md"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Flex mt={2} flexWrap="nowrap">
                  <Box flex="1" minW="50%">
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
                  </Box>
                </Flex>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="15px" color="gainsboro" mt={5}>
                  새로운 비밀번호 확인
                </FormLabel>
                <CustomInput
                  type="password"
                  size={"lg"}
                  fontSize={"md"}
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <Flex mt={2} flexWrap="nowrap">
                  <Box flex="1" minW="50%">
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      display="flex"
                      alignItems="center"
                    >
                      {checks.length(password) &&
                      checks.match(password, passwordConfirm) ? (
                        <CheckIcon color="green.500" mr={2} />
                      ) : (
                        <CloseIcon color="red.500" mr={2} />
                      )}
                      비밀번호 일치
                    </Text>
                  </Box>
                </Flex>
              </FormControl>
              <Button
                mt="24px"
                p={6}
                fontSize="24px"
                fontWeight={"thin"}
                fontFamily={"Pretendard"}
                borderRadius={"8px"}
                width="100%"
                type="submit"
                // isLoading
              >
                변경하기 &nbsp;
                <CheckIcon boxSize={5} />
              </Button>
            </form>

            <Text color={"gray"} textAlign={"left"} fontSize={"15px"}>
              비밀번호가 생각이 나셨나요? &nbsp;
              <ChakraLink
                as={RouterLink}
                to="/"
                textDecoration="underline"
                color="white"
              >
                로그인
              </ChakraLink>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </BackGroundDiv>
  );
};

export default ChangePw;
