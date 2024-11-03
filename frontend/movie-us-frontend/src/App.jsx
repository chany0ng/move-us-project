import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/login/Index";
import ChangePw from "./pages/login/ChangePw";
import SignUp from "./pages/login/SignUp";
import MainPage from "./pages/MainPage";
import Layout from "./layouts/Layout";

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/change-pw/:email" element={<ChangePw />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Header/Footer Layout적용하는 페이지 */}
          <Route element={<Layout />}>
            <Route path="/main" element={<MainPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
