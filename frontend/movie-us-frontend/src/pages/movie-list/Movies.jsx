import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import { Select } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
const Movies = () => {
  return (
    <Flex direction="column" mt="100px" minHeight="inherit" p={5}>
      <Box color="white" p={5}>
        <Flex align={"center"} gap={3} p={2} mb={3}>
          <AiFillFolder size={40} />
          <Heading fontSize={"4xl"}>영화 조회</Heading>
        </Flex>
        <Flex align={"center"} gap={3} pl={3} color="#cfcfcf">
          <Text fontSize={"lg"} fontWeight={"bold"}>
            총 34건의 영화가 검색되었습니다
          </Text>
        </Flex>
      </Box>

      <Box color="black" p={10} position="relative">
        <Select
          bg="brand.primary"
          width="150px"
          position="absolute"
          border="1px solid white"
          fontWeight={"bold"}
          fontFamily={"NanumSquareRound"}
          top={0}
          right={5}
          _focus={{ border: "1px solid white", boxShadow: "none" }}
        >
          <option value="option1">최신순</option>
          <option value="option2">리뷰 많은 순</option>
          <option value="option3">좋아요 많은 순</option>
        </Select>
      </Box>

      <Box flex="1" border={"1px solid gray"} color="white" p={5}>
        {/* <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
      {movies.map((movie) => (
        <Box key={movie.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image src={movie.posterUrl} alt={movie.title} />
          <Text p={2} fontWeight="bold" textAlign="center">{movie.title}</Text>
        </Box>
      ))}
    </Grid> */}
        <Tabs variant="soft-rounded" colorScheme="orange" size={"lg"}>
          <TabList gap={10} justifyContent={"center"}>
            <Tab width="10%">드라마</Tab>
            <Tab width="10%">액션</Tab>
            <Tab width="10%">SF</Tab>
            <Tab width="10%">공포</Tab>
            <Tab width="10%">애니메이션</Tab>
            <Tab width="10%">로맨스</Tab>
            <Tab width="10%">코미디</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Movies;
