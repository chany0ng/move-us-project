import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTopButton";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <CustomMain>
      <Outlet /> <ScrollToTop />
    </CustomMain>
  );
};

const CustomMain = styled.main`
  min-height: 100vh;
  padding: 10%;
  padding-top: 0%;
  padding-bottom: 500px;
`;

export default Main;
