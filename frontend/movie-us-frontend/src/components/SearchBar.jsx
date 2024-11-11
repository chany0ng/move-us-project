import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Box width={"500px"} position="absolute" top={0} left={10}>
      <InputGroup>
        <InputRightElement
          height="100%"
          cursor={"pointer"}
          onClick={handleSearch}
        >
          <SearchIcon color="gray.200" boxSize={5} mr={3} />
        </InputRightElement>
        <Input
          placeholder="영화 제목으로 검색하기"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
          color="white"
          variant="outline"
          paddingRight="50px"
          lineHeight="1.5"
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
