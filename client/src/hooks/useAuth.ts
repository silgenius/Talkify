import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { removeUser, setUser } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { UserType } from "../types";
import { toast } from "react-toastify";
import { welcomeMessage } from "../utils/welcomeMessage";

const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const singIn = useMutation({
    mutationFn: async (data: string) => {
      const res = (await newRequest.post("/user/email", { email: data })).data;
      console.log(res);
      return res as UserType;
    },
    onSuccess: (data) => {
      setUser(data);
      toast(welcomeMessage(data.username));
      navigate("/");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert(error.response?.data);
    },
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

  const logout = () => {
    removeUser();
    queryClient.clear(); 
    toast("See you soon!");
    navigate("/login");
    setTimeout(() => {
      
      navigate("/");
    }, 0);
  }

  return { singIn, signUp, logout };
};

export default useAuth;
