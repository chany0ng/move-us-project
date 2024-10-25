import styled from "styled-components";
import backgroundImage from "../assets/images/backgroundImage.jpg";
const Index = () => {
  return (
    <>
      <BackGroundDiv>인덱스 페이지</BackGroundDiv>
    </>
  );
};

const BackGroundDiv = styled.div`
  position: relative;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
`;

export default Index;
