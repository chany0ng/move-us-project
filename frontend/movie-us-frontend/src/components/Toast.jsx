import { useToast, Button } from "@chakra-ui/react";
const Toast = ({ title, description, status = "success" }) => {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: title,
          description: description,
          status: status,
          duration: 2000,
          isClosable: true,
          position: "top",
        })
      }
    >
      Show Toast
    </Button>
  );
};
export default Toast;
