import {
    Box,
    Flex,
    Heading,
    HStack,
    Container,
    Link as ChakraLink,
  } from "@chakra-ui/react";
  import { Link as RouterLink } from "react-router-dom";
  
  const Navigator = () => {
    return (
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        bg="rgba(24, 24, 27, 0.9)"
        borderBottom="2px solid"
        borderBottomColor="brand.primary"
        zIndex={1000}
      >
        <Container maxW="container.xl">
          <Flex h="70px" align="center" justify="center">
            {/* 왼쪽 메뉴 아이템들 */}
            <HStack spacing={16} flex="1" justify="flex-end">
              <ChakraLink as={RouterLink} to="/movies" color="white" _hover={{ color: 'brand.primary' }}>
                영화
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/ticekt" color="white" _hover={{ color: 'brand.primary' }}>
                예매
              </ChakraLink>
            </HStack>
  
            {/* 로고 (중앙 배치) */}
            <Box px={16}>
              <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                <Heading size="lg" color="brand.primary">Movie us</Heading>
              </ChakraLink>
            </Box>
  
            {/* 오른쪽 메뉴 아이템들 */}
            <HStack spacing={16} flex="1" justify="flex-start">
              <ChakraLink as={RouterLink} to="/community" color="white" _hover={{ color: 'brand.primary' }}>
                커뮤니티
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/mypage" color="white" _hover={{ color: 'brand.primary' }}>
                마이페이지
              </ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  };
  
  export default Navigator;