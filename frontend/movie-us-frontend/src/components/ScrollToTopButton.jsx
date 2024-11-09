import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    isVisible && (
      <IconButton
        position="fixed"
        bottom="30px"
        right="20px"
        colorScheme="teal"
        onClick={scrollToTop}
        icon={<ArrowUpIcon />}
        aria-label="Scroll to top"
      />
    )
  );
};

export default ScrollToTop;
