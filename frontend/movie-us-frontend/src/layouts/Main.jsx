import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTop";

const Main = ({ children }) => {
  return (
    <CustomMain>
      {children} <ScrollToTop />
    </CustomMain>
  );
};

const CustomMain = styled.main`
  min-height: 100vh;
  padding: 5%;
  padding-top: 0%;
`;

export default Main;
