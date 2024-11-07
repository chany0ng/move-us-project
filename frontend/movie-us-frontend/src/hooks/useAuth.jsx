import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // localStorage에 accessToken이 있는지 확인해서 로그인 상태 설정
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken); // accessToken이 있으면 true, 없으면 false
  }, []);

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken); // 로그인 시 토큰 저장
    setIsAuthenticated(true); // 로그인 상태로 설정
  };

  const logout = () => {
    localStorage.removeItem('accessToken'); // 로그아웃 시 토큰 삭제
    setIsAuthenticated(false); // 로그아웃 상태로 설정
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
