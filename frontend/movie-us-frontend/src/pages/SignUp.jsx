import { BackGroundDiv } from "./Index";
import {Box, Flex, Heading, Text, VStack, Input, FormControl, FormLabel, Button, Link} from "@chakra-ui/react";
import { useState } from 'react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const SignUp = () => {
  const [password, setPassword] = useState('');
  
  // 비밀번호 유효성 검사 조건
  const checks = {
    length: (pwd) => pwd.length >= 8,
    uppercase: (pwd) => /[A-Z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    special: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
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
            borderWidth={1}
            px={6}
            py={8}
            width="fit-content"
            maxWidth="700px"
            borderRadius={20}
            textAlign="center"
            boxShadow="lg"
            bg="white"
            color="brand.black"
          >
            <Box p={8}>       
              <Heading size="2xl">Create an account</Heading>
              <Text mt={4} fontSize="18px">
                당신만의 특별한 영화 취향을 공유해보세요<br/>
                Movie-us와 함께라면 더욱 특별한 영화 경험이 시작됩니다
              </Text>

              <VStack p={4} spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="18px">이메일</FormLabel>
                  <Input 
                    type="email" 
                    size="lg"
                    fontSize="18px"
                    required 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="18px">전화번호</FormLabel>
                  <Input 
                    type="tel" 
                    size="lg"
                    fontSize="18px"
                  />
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
                      <Text fontSize="sm" color="gray.600" display="flex" alignItems="center">
                        {checks.length(password) ? 
                          <CheckIcon color="green.500" mr={2} /> : 
                          <CloseIcon color="red.500" mr={2} />}
                        8글자 이상
                      </Text>
                      <Text fontSize="sm" color="gray.600" display="flex" alignItems="center">
                        {checks.uppercase(password) ? 
                          <CheckIcon color="green.500" mr={2} /> : 
                          <CloseIcon color="red.500" mr={2} />}
                        대문자 포함
                      </Text>
                    </Box>
                    <Box flex="1" minW="250px">
                      <Text fontSize="sm" color="gray.600" display="flex" alignItems="center">
                        {checks.number(password) ? 
                          <CheckIcon color="green.500" mr={2} /> : 
                          <CloseIcon color="red.500" mr={2} />}
                        숫자 포함
                      </Text>
                      <Text fontSize="sm" color="gray.600" display="flex" alignItems="center">
                        {checks.special(password) ? 
                          <CheckIcon color="green.500" mr={2} /> : 
                          <CloseIcon color="red.500" mr={2} />}
                        특수문자 포함
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
              </VStack>

              <Button size="md" mt="20px">
                회원 가입
              </Button>

              <Text mt={4} fontSize="18px">이미 계정이 존재한다면? <Link as={RouterLink} to="/">로그인 하러가기</Link></Text>

            </Box>
          </Box>
        </Flex>
      </BackGroundDiv>
    </>
  )
}

export default SignUp;
