import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { removeUser, setUser } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { UserType } from "../types";
import { toast } from "react-toastify";
import { welcomeMessage } from "../utils/welcomeMessage";
import { useEffect } from "react";

const serverUrl = import.meta.env.VITE_SERVER_ORIGIN;

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
    localStorage.removeItem("authToken");
    toast("See you soon!");
    navigate("/login");
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== (serverUrl || "https://talkify.techerudites.tech"))
        return;

      const { email, token, error } = event.data;
      if (error) {
        console.error("Error:", error);
        toast.error(error);
        return;
      }

      localStorage.setItem("authToken", token);
      singIn.mutate(email);
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [singIn]);

  const handleGoogleAuth = (authType: string) => {
    const width = 500;
    const height = 600;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${serverUrl || "https://talkify.techerudites.tech"}/auth/${authType}`,
      "GoogleSignUpWindow",
      `width=${width},height=${height},top=${top},toolbar=no,scrollbars=yes,resizable=no`
    );
  };
  return { singIn, signUp, handleGoogleAuth, logout };
};

export default useAuth;
