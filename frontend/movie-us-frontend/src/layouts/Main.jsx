import styled from "styled-components";

const Main = ({ children }) => {
  return <CustomMain>{children}</CustomMain>;
};

const CustomMain = styled.main`
  min-height: 100vh;
  padding: 5%;
  padding-top: 0%;
`;

export default Main;
