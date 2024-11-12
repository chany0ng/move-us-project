import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        color: "white",
        backgroundColor: "black",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#F7CE46",
        }}
      >
        404 - Page Not Found
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "1.5rem",
        }}
      >
        찾으시는 페이지가 존재하지 않습니다. 주소를 다시 확인해주세요.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.8rem 1.5rem",
          backgroundColor: "#F7CE46",
          color: "#333",
          textDecoration: "none",
          borderRadius: "5px",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFound;
