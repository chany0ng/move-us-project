import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/login/Index";
import ChangePw from "./pages/login/ChangePw";
import SignUp from "./pages/login/SignUp";
import MainPage from "./pages/MainPage";
import Layout from "./layouts/Layout";
import ScrollToTopWhenPageChange from "./components/ScrollToTopWhenPageChange";
import MovieReviews from "./pages/community/MovieReviews";
import Notice from "./pages/community/Notice";
import Movies from "./pages/movie-list/Movies";
import MovieDetail from "./pages/movie-list/MovieDetail";
import UserLikedMovies from "./pages/my-page/UserLikedMovies";
import UserInfo from "./pages/my-page/UserInfo";
import UserReservationHistory from "./pages/my-page/UserReservationHistory";
import UserReviewHistory from "./pages/my-page/UserReviewHistory";
import MovieTicketing from "./pages/ticketing/MovieTicketing";

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <ScrollToTopWhenPageChange />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/change-pw/:email" element={<ChangePw />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Header/Footer Layout적용하는 페이지 */}
          <Route element={<Layout />}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie-detail/:tmdbId" element={<MovieDetail />} />
            <Route path="/community/movie-reviews" element={<MovieReviews />} />
            <Route path="/community/notice" element={<Notice />} />
            {/*//todo useAuth 만들어서, 로그인 여부 체크 후 my-page 접근 여부 확인,
               //todo RequireAuth 컴포넌트로 상위 Route 구현 */}
            <Route path="/my-page/user-info" element={<UserInfo />} />
            <Route
              path="/my-page/activity/user-liked-movies"
              element={<UserLikedMovies />}
            />
            <Route
              path="/my-page/activity/user-reservation-history"
              element={<UserReservationHistory />}
            />
            <Route
              path="/my-page/activity/user-review-history"
              element={<UserReviewHistory />}
            />
            <Route path="/ticketing" element={<MovieTicketing />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
