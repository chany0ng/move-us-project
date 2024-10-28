import axios from "axios";

// Axios instance 생성
export const customAxios = axios.create({
  // baseURL: "https://api.comission-platform.store", // AWS EC2 API서버의 BASE URL
  baseURL: "http://localhost:8080", // 개발용 로컬서버의 BASE URL
  timeout: 5000,
  withCredentials: true,
});

// 요청 interceptor
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
    const requestUrl = error.config.url;

    if (requestUrl === "/api/reissue") {
      // reissue 실패 시 명시적으로 에러 메시지 반환
      return Promise.reject(new Error("토큰 갱신 요청 failed"));
    }
    // accessToken 만료 시 받는 status를 정해야함.
    else if (errorStatus === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // 이전 요청에 Authorization 헤더 추가
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return customAxios.request(error.config); // 이전 요청 재시도
        }
      } catch (error) {
        if (error.response?.status === 403) {
          // 예: refreshToken이 만료된 경우
          // 로그인 페이지로 리디렉션
          window.location.href = "/"; // 또는 사용자가 원하는 다른 페이지로
        }
        return Promise.reject(new Error("이전 요청 재시도 failed"));
      }
    }
    return Promise.reject(error);
  }
);

// Access Token 재발급 함수
export const refreshAccessToken = async () => {
  const response = await postData("/api/reissue", "");
  const newAccessToken = response.headers?.authorization; // 새로운 액세스 토큰 가져오기
  localStorage.setItem("accessToken", newAccessToken); // 로컬 스토리지에 저장
  return newAccessToken; // 필요한 경우 반환
};

//todo config에 Query Parameter 전달하는법
/*
{
  params: {
    search: 'John',  // 검색 키워드
    sort: 'asc',     // 정렬 순서
  },
}
*/

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
