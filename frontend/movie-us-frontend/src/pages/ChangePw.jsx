import { BackGroundDiv } from "./Index";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { CustomInput } from "./Index";
const ChangePw = () => {
  const [password, setPassword] = useState("");

  // 비밀번호 유효성 검사 조건
  const checks = {
    length: (pwd) => pwd.length >= 8,
    uppercase: (pwd) => /[A-Z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    special: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
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
          h="80vh"
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
            <FormControl /*isInvalid={isError} */>
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
              {/* //todo isError시에 메시지 출력하게 설정  <FormHelperText>We'll never share your email.</FormHelperText> */}
            </FormControl>

            <FormControl /*isInvalid={isError} */>
              <FormLabel fontSize="15px" color="gainsboro">
                새로운 비밀번호 확인
              </FormLabel>
              <CustomInput
                type="password"
                size={"lg"}
                fontSize={"md"}
                required
              />
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
              변경하기 &nbsp;
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
  );
};

export default ChangePw;
