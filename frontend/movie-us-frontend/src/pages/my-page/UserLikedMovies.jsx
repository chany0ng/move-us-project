import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./../../components/Sidebar";
const UserLikedMovies = () => {
  return (
    <Box border="3px solid #2c2c2c" mt="100px" minHeight="inherit" p={5}>
      <Flex>
        <Box mt={16}>
          <Sidebar />
        </Box>

        {/* 오른쪽 메인 콘텐츠 */}
        <Box flex="1" ml="20px">
          여기에 메인 콘텐츠를 넣으세요.
        </Box>
      </Flex>
    </Box>
  );
};

export default UserLikedMovies;
