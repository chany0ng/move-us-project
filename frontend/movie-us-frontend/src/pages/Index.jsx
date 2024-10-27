import styled from "styled-components";
import backgroundImage from "../assets/images/backgroundImage.png";
import { Button, Flex, Box, Heading, Text, Center } from "@chakra-ui/react";
const Index = () => {
  return (
    <>
      <BackGroundDiv>
        <Flex>
          <Box
            flex="6"
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
                fontSize="20px"
                borderRadius={"5px"}
                // isLoading
              >
                Get Started
              </Button>
            </Box>
          </Box>

          <Box flex="4" bg="rgba(24, 24, 27, 0.8)" h="100vh">
            <Heading
              mb={20}
              fontWeight="bold"
              fontSize={["xl", "2xl", "3xl", "4xl"]}
            >
              Log in
            </Heading>
            <Center>
              <Heading
                mb={20}
                fontWeight="bold"
                fontSize={["xl", "2xl", "3xl", "4xl"]}
              >
                Log in
              </Heading>
            </Center>
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

export default Index;
