import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { getData } from "../api/axios";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchSuggestions = async () => {
        setLoading(true);
        try {
          const response = await getData("/movies/search/top5", {
            params: { query },
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      };

      // 일정 시간 후 검색 (디바운싱)
      const delayDebounceFn = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      // Clean up the timeout
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    onSearch(query);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setSuggestions([]);
  };

  return (
    <Box width={"500px"} position="relative">
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

      {/* 추천 검색어 목록 */}
      {query && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="60px"
          width="100%"
          bg="black"
          border="1px solid gray"
          borderRadius="md"
          color="white"
          zIndex={10}
          maxHeight="200px"
          // overflowY="auto"
        >
          {loading ? (
            <Box p={3} textAlign="center">
              <Spinner size="sm" color="gray.500" />
            </Box>
          ) : (
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  p={2}
                  _hover={{ backgroundColor: "gray", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Text>{suggestion.title}</Text>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
