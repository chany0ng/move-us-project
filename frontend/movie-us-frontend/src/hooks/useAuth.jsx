import { useEffect, useState } from "react";
import { userStore } from "../../store";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = userStore((state) => state.user);
  useEffect(() => {
    const user_name = user.user_name;
    setIsAuthenticated(user_name ? true : false); // accessToken이 있으면 true, 없으면 false
  }, []);

  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken); // 로그인 시 토큰 저장
    setIsAuthenticated(true); // 로그인 상태로 설정
  };

  const logout = () => {
    localStorage.removeItem("accessToken"); // 로그아웃 시 토큰 삭제
    setIsAuthenticated(false); // 로그아웃 상태로 설정
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
