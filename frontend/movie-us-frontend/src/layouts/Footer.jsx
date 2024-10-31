import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <CustomFooter>
      <ContentWrapper>
        <MovieusLogo>
          <Link to="/main" style={{ textDecoration: "none" }}>
            <h2>Movie us</h2>
          </Link>
          <p>© 2024 Movie us All rights reserved.</p>
          <p>Project by U-CAMP Team 3</p>
        </MovieusLogo>
        <SocialMediaIcons>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </SocialMediaIcons>
      </ContentWrapper>
    </CustomFooter>
  );
};

const CustomFooter = styled.footer`
  height: 20vh;
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MovieusLogo = styled.div`
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #f7ce46;
    font-weight: bold;
  }
`;

const SocialMediaIcons = styled.div`
  a {
    color: #ffffff;
    margin: 0 10px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Footer;
