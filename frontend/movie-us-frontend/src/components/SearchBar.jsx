import {
  Box,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons"; // Chakra UI에서 제공하는 아이콘
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
    setQuery(""); // 검색 후 입력창 초기화
  };

  return (
    <Box width={"500px"} py={5} alignSelf={"flex-end"}>
      <InputGroup>
        <InputRightElement pointerEvents="none" height="100%">
          <SearchIcon color="gray.200" boxSize={5} mr={3} />
        </InputRightElement>
        <Input
          placeholder="영화제목을 검색해보세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg" // 입력 필드 크기 조정
          variant="outline" // 입력 필드 스타일
          paddingRight="50px" // 아이콘과 텍스트 간의 여백 조정
          lineHeight="1.5" // 입력 필드의 라인 높이 조정
          _focus={{
            border: "0.1px solid #f7ce46 !important",
            boxShadow: "0 0 0 0.5px #f7ce46 !important",
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
