import styled from "styled-components";
import ScrollToTop from "../components/ScrollToTopButton";
import { Outlet, useLocation } from "react-router-dom";

const Main = () => {
  const location = useLocation();
  const isTicketingPage = location.pathname.includes("/ticketing")
    ? "true"
    : "false";
  return (
    <CustomMain isticketing={isTicketingPage}>
      <Outlet /> <ScrollToTop />
    </CustomMain>
  );
};

const CustomMain = styled.main`
  min-height: 100vh;
  padding: ${(props) => (props.isticketing === "true" ? "0px" : "10%")};
  padding-top: 0%;
  padding-bottom: 500px;
  width: ${(props) => (props.isticketing === "true" ? "1500px" : "auto")};
  margin: ${(props) => (props.isticketing === "true" ? "0 auto" : "initial")};
`;

export default Main;
