import { googleLogo } from "../../assets"
import Button from "./components/Button"
import Input from "./components/Input"
import Logo from "./components/Logo"
import SideBar from "./components/SideBar"

const Register = () => {
  return (
    <div className="flex w-full h-screen">
      <SideBar 
        title="Welcome Back!"
        description={<>Effortless connections <span className='text-3xl'>.</span> meaningful<br />conversations</>}
        buttonText="SIGN IN"
      />
      <div className="w-2/3 px-10 py-5 flex flex-col items-center justify-center relative">
        <Logo />
        <div className="space-y-12 max-w-sm w-full">
          <h1 className="text-3xl font-semibold text-primary-purple text-center">Create Account</h1>
          <form className=" flex flex-col">
            <div className="flex flex-col space-y-4 mb-12">
              <Input placeholder="First name"/>
              <Input placeholder="Last name"/>
              <Input placeholder="Email"/>
            </div>
            <Button className="mb-12 text-slate-800 border-slate-400 w-fit mx-auto px-10" icon={googleLogo} text="Sign up with Google" type="outline" rounded/>
            <Button text="Sign Up"/>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register