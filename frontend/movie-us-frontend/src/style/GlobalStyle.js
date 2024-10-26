import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #F7CE46;  /* 메인 색상 */
    --black-color: #18181B; // 검은색 대용 색상
    --secondary-color: #D9D9D9; /* 보조 색상 */
    --brighter-color: #F8E8E1;    /* 밝은 색상 */
    --darker-color: #A6725C; /* 어두운 색상 */
  }
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  vertical-align: baseline;
}
#root {
  height: 100vh;
}
html {
  /* font-size: 62.5%; // 1rem을 10px로 변환 */
  height:100vh;
}

body{
  font-family: 'Pretendard', sans-serif;
  min-height:100vh;
  min-width: 560px;
  line-height: 1.2;
  color: white;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
a{
  color: inherit;
  text-decoration: none;
}
ol, ul, li{
  list-style: none;
}
input:foucs {
  outline: none;
}
h1, h2, h3, h4, h5, h6 {
  font-family: 'Noto Sans KR', sans-serif;
}

@font-face {
  font-family: 'Noto Sans KR';
  src: url('./assets/fonts/notoSansKR/NotoSansKR-Black.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

@font-face {
  font-family: 'Noto Sans KR';
  src: url('./assets/fonts/notoSansKR/NotoSansKR-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Noto Sans KR';
  src: url('./assets/fonts/notoSansKR/NotoSansKR-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Noto Sans KR';
  src: url('./assets/fonts/notoSansKR/NotoSansKR-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Noto Sans KR';
  src: url('./assets/fonts/notoSansKR/NotoSansKR-Thin.ttf') format('truetype');
  font-weight: 100;
  font-style: normal;
}
@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/pretendard/Pretendard-Black.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/pretendard/Pretendard-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/pretendard/Pretendard-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}


@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/pretendard/Pretendard-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/pretendard/Pretendard-Thin.ttf') format('truetype');
  font-weight: 100;
  font-style: normal;
}
`;

export default GlobalStyle;
