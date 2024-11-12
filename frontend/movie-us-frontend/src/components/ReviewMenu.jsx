import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from 'react-icons/bs';

const ReviewMenu = ({ review, onEditReview, onDeleteClick }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<BsThreeDotsVertical />}
        variant="ghost"
        size="sm"
        aria-label="리뷰 옵션"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
      />
      <MenuList bg="#2f2f2f" borderColor="#3F3F3F">
        <MenuItem 
          onClick={() => onEditReview(review)} 
          color="white" 
          bg="#2f2f2f" 
          _hover={{ bg: '#464646' }}
        >
          수정하기
        </MenuItem>
        <MenuItem 
          color="red.500" 
          bg="#2f2f2f" 
          onClick={() => onDeleteClick(review.reviewId)} 
          _hover={{ bg: '#464646' }}
        >
          삭제하기
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ReviewMenu; 