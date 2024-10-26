import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./style/chakraTheme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      {/* ChakraProvider에 theme 전달 */}
      <App />
    </ChakraProvider>
  </StrictMode>
);
