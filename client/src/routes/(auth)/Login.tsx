import { googleLogo } from "../../assets";
import Button from "../../components/common/Button";
import Input from "./components/Input";
import SideBar from "./components/SideBar";
import Logo from "../../components/common/Logo";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/localStorage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const { singIn, handleGoogleAuth } = useAuth();

  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        toast.error("You are already logged in");
        navigate("/");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Please sign in with google :)");
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-2/3 px-10 py-5 flex flex-col items-center justify-center relative">
        <Logo />
        <div className="space-y-12 max-w-sm w-full">
          <h1 className="text-3xl font-semibold text-primary-purple text-center">
            Sign in to Talkify
          </h1>
          <form onSubmit={handleSubmit} className=" flex flex-col">
            <div className="flex flex-col space-y-4 mb-12">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                value={email}
                placeholder="Email"
              />
            </div>
            <Button
              className="mb-12 !text-gray-800 !border-gray-400 w-fit mx-auto px-10 hover:!bg-gray-300 hover:!border-transparent"
              icon={googleLogo}
              text="Sign in with Google"
              type="outline"
              rounded
              onClick={() => handleGoogleAuth("login")}
              loading={singIn.isPending}
            />
            <Button htmlType="submit" text="Sign In" />
            <div className="flex md:hidden items-center">
              <p className="p-2">Don't have an accont? </p>
              <Link to="/register" className="text-primary-purple">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <SideBar
        className="hidden md:flex"
        title="Join Talkify!"
        description={
          <>
            Effortless connections <span className="text-3xl">.</span>{" "}
            meaningful
            <br />
            conversations
          </>
        }
        buttonText="SIGN UP"
      />
    </div>
  );
};

export default Login;
