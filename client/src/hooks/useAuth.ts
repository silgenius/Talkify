import { useMutation } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { setUser } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  const singIn = useMutation({
    mutationFn: async (data: string) => {
      const res = (await newRequest.post("/user/email", {email: data})).data;
      console.log(res);
      return res;
    },
    onSuccess: (data) => {
        setUser(data);
        navigate("/conversations");
    }
  });

  const signUp = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
    }) => {
      const res = (await newRequest.post("/auth/register", data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      console.log("success");
    },
  });

  return { singIn, signUp };
};

export default useAuth;
