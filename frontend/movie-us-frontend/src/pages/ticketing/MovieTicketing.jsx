import { Box, Flex, Heading } from "@chakra-ui/react";

const MovieTicketing = () => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <Flex direction="column" mt="50px" minHeight="inherit" pb={5} bg="#d4d3c9">
      <Flex
        bg="#333333"
        width="100%"
        height="50px"
        alignItems="center"
        justifyContent="center"
      >
        <Heading fontSize="xl">{today}</Heading>
      </Flex>

      <Box color="white" p={5}>
        ㅋㅋ
      </Box>
      <Box color="white" p={5}>
        ㅋㅋ
      </Box>
      <Box flex="1" color="white" p={5}>
        ㅋㅋ
      </Box>
    </Flex>
  );
};

export default MovieTicketing;
