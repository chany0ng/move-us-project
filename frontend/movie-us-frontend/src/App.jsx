import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/login/Index";
import ChangePw from "./pages/login/ChangePw";
import SignUp from "./pages/login/SignUp";
import MainPage from "./pages/user/MainPage";
function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/change-pw" element={<ChangePw />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
