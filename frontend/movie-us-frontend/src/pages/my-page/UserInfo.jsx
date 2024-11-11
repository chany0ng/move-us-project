import { 
  Box, 
  Flex, 
  VStack, 
  Heading, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  Avatar,
  Divider,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Sidebar from "./../../components/Sidebar";
import { getData, putData } from "../../api/axios";
import { userStore } from "../../../store";

const UserInfo = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const inputBgColor = "gray.700";
  const borderColor = "gray.600";

  const { getState } = userStore;
  const userNum = getState().user.user_num;

  const toast = useToast();

  const [userInfo, setUserInfo] = useState({
    userName: '',
    userEmail: '',
    kakaoEmail: '',
    userPhone: '',
    profileImage: ''
  });

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('마이페이지 정보 요청 userNum:', userNum);
        const response = await getData(`/api/movies/mypage/user/${userNum}`);
        
        if (!response.data) {
          throw new Error('사용자 정보가 없습니다');
        }
        
        console.log('마이페이지 정보 응답:', response.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error('회원정보 조회 실패:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "서버 오류가 발생했습니다";
        
        toast({
          title: "회원정보 조회 실패",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserInfo();
  }, [toast]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 정보 수정 처리
  const handleSubmit = async () => {
    try {
      const response = await putData(`/api/movies/mypage/user/${userNum}`, userInfo);
      console.log('수정된 정보:', response.data);
      
      toast({
        title: "회원정보가 수정되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      toast({
        title: "회원정보 수정 실패",
        description: error.response?.data?.message || "서버 오류가 발생했습니다",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={bgColor} minHeight="100vh" p={5} color={textColor}>
      <Flex maxWidth="1200px" margin="auto" mt="100px">
        <Box width="250px" mr={8}>
          <Sidebar />
        </Box>

        {/* 오른쪽 메인 콘텐츠 */}
        <Box flex="1" bg={cardBgColor} borderRadius="lg" boxShadow="dark-lg" p={8}>
          <VStack spacing={8} align="stretch">
            {/* 헤더 섹션 */}
            <Flex justify="space-between" align="center">
              <Heading size="xl" color="yellow.400">내 정보 수정</Heading>
              <Avatar 
                size="2xl" 
                name={userInfo.userName || "User"} 
                src={userInfo.profileImage}
              />
            </Flex>
            
            <Divider borderColor={borderColor} />

            {/* 이름 입력 */}
            <FormControl>
              <FormLabel htmlFor="userName" color="yellow.400">이름</FormLabel>
              <Input 
                id="userName" 
                value={userInfo.userName}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요" 
                bg={inputBgColor} 
                borderColor={borderColor} 
                _placeholder={{ color: "gray.500" }}
                _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
              />
            </FormControl>

            {/* 이메일 입력 */}
            <FormControl>
              <FormLabel htmlFor="userEmail" color="yellow.400">이메일</FormLabel>
              <Input 
                id="userEmail" 
                value={userInfo.userEmail}
                onChange={handleInputChange}
                type="email" 
                placeholder="이메일을 입력하세요" 
                bg={inputBgColor} 
                borderColor={borderColor} 
                _placeholder={{ color: "gray.500" }}
                _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
              />
            </FormControl>

            {/* 카카오 이메일 입력 */}
            <FormControl>
              <FormLabel htmlFor="kakaoEmail" color="yellow.400">
                카카오 이메일
              </FormLabel>
              <InputGroup>
                <Input 
                  id="kakaoEmail" 
                  value={userInfo.kakaoEmail || '카카오 계정이 연동되어 있지 않습니다'}
                  onChange={handleInputChange}
                  type="email" 
                  isDisabled={!userInfo.kakaoEmail}
                  bg={inputBgColor} 
                  borderColor={borderColor} 
                  _placeholder={{ color: "gray.500" }}
                  _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
                />
              </InputGroup>
            </FormControl>

            {/* 전화번호 입력 */}
            <FormControl>
              <FormLabel htmlFor="userPhone" color="yellow.400">전화번호</FormLabel>
              <InputGroup>
                <InputLeftAddon bg={inputBgColor} color={textColor} borderColor={borderColor}>
                  +82
                </InputLeftAddon>
                <Input 
                  id="userPhone" 
                  type="tel" 
                  value={userInfo.userPhone}
                  onChange={handleInputChange}
                  placeholder="전화번호를 입력하세요" 
                  bg={inputBgColor} 
                  borderColor={borderColor} 
                  _placeholder={{ color: "gray.500" }}
                  _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
                />
              </InputGroup>
            </FormControl>

            {/* 정보 수정 버튼 */}
            <Button 
              colorScheme="yellow" 
              size="lg" 
              width="full"
              _hover={{ bg: "yellow.500", color: "gray.900" }}
              boxShadow="md"
              onClick={handleSubmit}
            >
              정보 수정 완료
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserInfo;