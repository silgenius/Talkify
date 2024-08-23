import { googleLogo } from "../../assets"
import Button from "./components/Button"
import Input from "./components/Input"
import SideBar from "./components/SideBar"
import Logo from "./components/Logo"

const Login = () => {

  return (
    <div className="flex w-full h-screen">
      <div className="w-2/3 px-10 py-5 flex flex-col items-center justify-center relative">
        <Logo />
        <div className="space-y-12 max-w-sm w-full">
          <h1 className="text-3xl font-semibold text-primary-purple text-center">Sign in to Talkify</h1>
          <form className=" flex flex-col">
            <div className="flex flex-col space-y-4 mb-12">
              <Input placeholder="Email" />
            </div>
            <Button className="mb-12 text-gray-800 border-gray-400 w-fit mx-auto px-10" icon={googleLogo} text="Sign in with Google" type="outline" rounded />
            <Button text="Sign In" />
          </form>
        </div>
      </div>
      <SideBar
        title="Join Talkify!"
        description={<>Effortless connections <span className='text-3xl'>.</span> meaningful<br />conversations</>}
        buttonText="SIGN UP"
      />
    </div>
  )
}

export default Login