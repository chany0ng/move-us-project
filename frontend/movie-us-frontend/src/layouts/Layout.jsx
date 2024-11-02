// Layout.jsx
import { Box } from "@chakra-ui/react";
import Header from "./Header"; // Header 컴포넌트
import Footer from "./Footer"; // Footer 컴포넌트
import Main from "./Main"; // Main 컴포넌트

const Layout = () => {
  return (
    <Box>
      <Header />
      <Main /> {/* Main 컴포넌트 */}
      <Footer />
    </Box>
  );
};

export default Layout;
