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
import { CheckIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { CustomInput } from "./Index";
const ChangePw = () => {
  return (
    <BackGroundDiv>
      <Flex>
        <Box m={"0 auto"} bg="rgba(24, 24, 27, 0.8)" h="70vh" w="40vw">
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
                  to="/signup"
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
  );
};

export default ChangePw;
