import styled from "styled-components";
import backgroundImage from "../assets/images/backgroundImage.jpg";
import { Button, Flex, Box, Heading, Text } from "@chakra-ui/react";
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
          >
            <Box maxW="32rem" sx={{ margin: "0 auto" }}>
              <Heading mb={4}>Movie us</Heading>
              <Text sx={{ fontSize: "25px" }}>
                영화 예매 시스템을 넘어, <br /> 영화에 대한 모든 정보를
                찾아보세요
              </Text>
              <Button size="lg" colorScheme="green" mt="24px">
                Create a free account
              </Button>
            </Box>
          </Box>

          <Box flex="4" bg="brand.black" h="100vh">
            Right Side
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
