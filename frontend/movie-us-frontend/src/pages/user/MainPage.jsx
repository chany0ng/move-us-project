import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import Main from "../../layouts/Main";

const MainPage = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: "1" }}>
        <Main>메인에 내용을 넣어보자.</Main>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
