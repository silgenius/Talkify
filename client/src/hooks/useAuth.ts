import { useMutation } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { setUser } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { UserType } from "../types";

const useAuth = () => {
  const navigate = useNavigate();

  const singIn = useMutation({
    mutationFn: async (data: string) => {
      const res = (await newRequest.post("/user/email", {email: data})).data;
      console.log(res);
      return res as UserType;
    },
    onSuccess: (data) => {
        setUser(data);
        navigate("/conversations");
    },
    onError: (error: AxiosError<{error: string}>) => {
      alert(error.response?.data.error);
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
