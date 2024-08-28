import { useState } from "react";
import { googleLogo } from "../../assets";
import Button from "./components/Button";
import Input from "./components/Input";
import Logo from "./components/Logo";
import SideBar from "./components/SideBar";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { signUp } = useAuth();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp.mutate(formData);
  };

  return (
    <div className="flex w-full h-screen">
      <SideBar
        title="Welcome Back!"
        description={
          <>
            Effortless connections <span className="text-3xl">.</span>{" "}
            meaningful
            <br />
            conversations
          </>
        }
        buttonText="SIGN IN"
      />
      <div className="w-2/3 px-10 py-5 flex flex-col items-center justify-center relative">
        <Logo />
        <div className="space-y-12 max-w-sm w-full">
          <h1 className="text-3xl font-semibold text-primary-purple text-center">
            Create Account
          </h1>
          <form onSubmit={handleSubmit} className=" flex flex-col">
            <div className="flex flex-col space-y-4 mb-12">
              <Input
                onChange={handleInputChange}
                name="firstName"
                value={formData.firstName}
                placeholder="First name"
              />
              <Input
                onChange={handleInputChange}
                name="lastName"
                value={formData.lastName}
                placeholder="Last name"
              />
              <Input
                onChange={handleInputChange}
                name="email"
                value={formData.email}
                placeholder="Email"
              />
            </div>
            <Button
              className="mb-12 !text-gray-800 !border-gray-400 w-fit mx-auto px-10"
              icon={googleLogo}
              text="Sign up with Google"
              type="outline"
              rounded
            />
            <Button htmlType="submit" text="Sign Up" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;