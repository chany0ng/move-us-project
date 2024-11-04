// import { useState, useEffect } from "react";
import {
  VStack,
  Box,
  Text,
  Flex,
  Avatar,
  Icon,
//   Divider
} from "@chakra-ui/react";
import { StarIcon } from '@chakra-ui/icons';
// import { getData } from "../api/axios";

const ReviewList = ({ reviews }) => {
  if (!reviews) return <Text>리뷰를 불러오는 중...</Text>;

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {reviews.length === 0 ? (
        <Text textAlign="center" color="gray.500">첫 번째 리뷰를 작성해보세요!</Text>
      ) : (
        reviews.map((review) => (
          <Box 
            key={review.id} 
            p={4} 
            borderColor="#3F3F3F"
            borderWidth="1px" 
            borderRadius="lg"
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Avatar size="sm" name={review.username} />
                <Text fontWeight="bold">{review.username}</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Flex>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      as={StarIcon}
                      color={i < review.rating ? "yellow.400" : "gray.300"}
                    />
                  ))}
                </Flex>
                <Text fontSize="sm" color="gray.600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            </Flex>
            <Text>{review.content}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default ReviewList; 