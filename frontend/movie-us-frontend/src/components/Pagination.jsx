import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const createPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Flex mt={4} justify="center" align="center">
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Previous Page"
        mr={2}
      />
      {createPageNumbers().map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          bg={page === currentPage ? "brand.primary" : "gray.200"}
          color={page === currentPage ? "white" : "black"}
          mx={1}
          _hover={{ bg: "brand.primaryHover" }}
        >
          {page}
        </Button>
      ))}
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        aria-label="Next Page"
        ml={2}
      />
    </Flex>
  );
};

export default Pagination;
