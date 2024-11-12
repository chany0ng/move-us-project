import axios from "axios";

// Axios instance 생성
export const customAxios = axios.create({
  // baseURL: "https://api.comission-platform.store", // AWS EC2 API서버의 BASE URL
  baseURL: "http://localhost:8080", // 개발용 로컬서버의 BASE URL
  timeout: 5000,
  // withCredentials: true,
});

//요청 interceptor
customAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 interceptor
customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorStatus = error.response?.status;
    console.log(error);
    // accessToken 만료 시 받는 status를 정해야함.
    if (error.response && errorStatus === 401) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");

      // 토큰을 제거하고 로그인 페이지로 이동
      localStorage.removeItem("accessToken");
      window.location.href = "/"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

// Access Token 재발급 함수
const refreshAccessToken = async () => {
    const response = await postData("/api/reissue", "");
    const newAccessToken = response.headers?.authorization; // 새로운 액세스 토큰 가져오기

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken); // 로컬 스토리지에 저장
      return newAccessToken;
    } else {
      throw new Error("새로운 토큰을 가져올 수 없습니다.");
    }
};

// User이름 -> UserNum 받아오기
export const getUserNum = async (url, userName) => {
  const response = await customAxios.get(url, {
    params: { userName: userName },
  });
  return response;
};

// GET Method
export const getData = async (url, config) => {
  const response = await customAxios.get(url, config);
  return response;
};

// POST Method
export const postData = async (url, data, config) => {
  const response = await customAxios.post(url, data, config);
  return response; // response 전체를 반환
};

// PUT Method
export const putData = async (url, data, config) => {
  const response = await customAxios.put(url, data, config);
  return response;
};

// DELETE Method
export const deleteData = async (url, config) => {
  const response = await customAxios.delete(url, config);
  return response;
};
