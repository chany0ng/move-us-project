import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const cancelRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) {
      setOpenAlert(true); // 로그인 상태가 아니면 AlertDialog를 엽니다.
    }
  }, [isAuthenticated]);

  const handleConfirm = () => {
    setOpenAlert(false);
    navigate("/login", { replace: true }); // "예"를 선택하면 로그인 페이지로 이동
  };

  const handleCancel = () => {
    setOpenAlert(false);
    navigate(-1); // "아니오"를 선택하면 이전 페이지로 돌아갑니다.
  };

  // 로그인된 경우에만 children을 렌더링하고, 로그인되지 않은 경우에는 AlertDialog만 띄웁니다.
  if (!isAuthenticated) {
    return (
      <AlertDialog
        isOpen={openAlert}
        leastDestructiveRef={cancelRef}
        onClose={handleCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#333">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              로그인 필요
            </AlertDialogHeader>
            <AlertDialogBody>
              마이페이지에 접근하려면 로그인이 필요합니다. <br />
              로그인하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancel}>
                아니오
              </Button>
              <Button colorScheme="blue" onClick={handleConfirm} ml={3}>
                로그인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }

  // 로그인된 경우에는 자식 요소를 렌더링합니다.
  return children;
};

export default ProtectedRoute;
