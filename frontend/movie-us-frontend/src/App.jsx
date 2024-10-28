import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import ChangePw from "./pages/ChangePw";
function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/change-pw" element={<ChangePw />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
