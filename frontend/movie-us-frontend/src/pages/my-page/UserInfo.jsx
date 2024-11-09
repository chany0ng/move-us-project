import { 
  Box, 
  Flex, 
  VStack, 
  Heading, 
  Text, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  Avatar,
  Divider,
  InputGroup,
  InputLeftAddon,
  useToast,
  Icon
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { EditIcon } from "@chakra-ui/icons";
import Sidebar from "./../../components/Sidebar";

const UserInfo = () => {
  const bgColor = "gray.900";
  const cardBgColor = "gray.800";
  const textColor = "gray.100";
  const inputBgColor = "gray.700";
  const borderColor = "gray.600";

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("https://pplx-res.cloudinary.com/image/upload/v1730879031/user_uploads/zsvrqmvze/maenggu.jpg"); // 기본 프로필 이미지 URL
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      toast({
        title: "파일 선택됨",
        description: `${file.name}이(가) 선택되었습니다.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
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
              <Avatar size="2xl" name="maenggu" src={previewUrl} />
            </Flex>
            
            <Divider borderColor={borderColor} />

            {/* 이름 입력 */}
            <FormControl>
              <FormLabel htmlFor="userName" color="yellow.400">이름</FormLabel>
              <Input 
                id="userName" 
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
              <FormLabel htmlFor="kakaoEmail" color="yellow.400">카카오 이메일</FormLabel>
              <Input 
                id="kakaoEmail" 
                type="email" 
                placeholder="카카오 이메일을 입력하세요" 
                bg={inputBgColor} 
                borderColor={borderColor} 
                _placeholder={{ color: "gray.500" }}
                _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
              />
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
                  placeholder="전화번호를 입력하세요" 
                  bg={inputBgColor} 
                  borderColor={borderColor} 
                  _placeholder={{ color: "gray.500" }}
                  _focus={{ borderColor: "yellow.400", boxShadow: "0 0 0 1px yellow.400" }}
                />
              </InputGroup>
            </FormControl>

            {/* 프로필 사진 업로드 */}
            <Box>
              <Text mb={2} fontWeight="bold" color="yellow.400">프로필 사진</Text>
              <Flex align="center">
                <Avatar size="lg" name="John Doe" src={previewUrl} mr={4} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <Button 
                  leftIcon={<Icon as={EditIcon} />} 
                  colorScheme="yellow" 
                  variant="outline" 
                  onClick={handleUploadClick}
                  _hover={{ bg: "yellow.400", color: "gray.900" }}
                >
                  사진 변경
                </Button>
                {selectedFile && (
                  <Text ml={4} fontSize="sm" color="gray.400">
                    {selectedFile.name}
                  </Text>
                )}
              </Flex>
            </Box>

            {/* 정보 수정 버튼 */}
            <Button 
              colorScheme="yellow" 
              size="lg" 
              width="full"
              _hover={{ bg: "yellow.500", color: "gray.900" }}
              boxShadow="md"
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