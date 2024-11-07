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
import SeatSelection from "./pages/ticketing/SeatSelection";
import ProtectedRoute from "./ProtectedRoute";
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
            <Route path="/ticketing/:tmdbId?" element={<MovieTicketing />} />
            <Route
              path="/ticketing/seat-selection"
              element={<SeatSelection />}
            />
            <Route
              path="/my-page"
              element={
                <ProtectedRoute>
                  {/* 모든 중첩된 경로에 대해 ProtectedRoute 적용 */}
                  <Routes>
                    <Route path="user-info" element={<UserInfo />} />
                    <Route
                      path="activity/user-liked-movies"
                      element={<UserLikedMovies />}
                    />
                    <Route
                      path="activity/user-reservation-history"
                      element={<UserReservationHistory />}
                    />
                    <Route
                      path="activity/user-review-history"
                      element={<UserReviewHistory />}
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-page/user-info"
              element={
                <ProtectedRoute>
                  <UserInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-page/activity/user-liked-movies"
              element={
                <ProtectedRoute>
                  <UserLikedMovies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-page/activity/user-reservation-history"
              element={
                <ProtectedRoute>
                  <UserReservationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-page/activity/user-review-history"
              element={
                <ProtectedRoute>
                  <UserReviewHistory />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
