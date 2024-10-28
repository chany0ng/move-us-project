import styled from "styled-components";
import Navigator from "../components/Navigator";
const Header = () => {
  return (
    <CustomHeader>
      <Navigator />
    </CustomHeader>
  );
};

const CustomHeader = styled.header`
  height: 12vh;
  display: flex;
  border-bottom: 1px solid var(--secondary-color);
`;

export default Header;
