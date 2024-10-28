import styled from "styled-components";

const Header = () => {
  return <CustomHeader>Header입니다.</CustomHeader>;
};

const CustomHeader = styled.header`
  height: 20vh;
  border-bottom: 1px solid var(--secondary-color);
`;

export default Header;
