import { getUser } from "./utils/localStorage";
import Conversation from "./routes/conversation/[id]";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { talkifyLogo } from "./assets";
import "./index.css";
import { IoRocketSharp } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";
import { Link } from "react-router-dom";

function App() {
  const currentUser = getUser();

  return (
    <>
      {currentUser ? (
        <Conversation />
      ) : (
        <div className="relative min-h-screen">
          {/* Header */}
          <header className="fixed top-0 left-0 w-full z-20 bg-fuchsia-100/40 backdrop-blur-md shadow-md animate-slideDown">
            <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6 md:px-8">
              <img
                src={talkifyLogo}
                alt="Talkify Logo"
                className="w-16 sm:w-20 hover:scale-105 transition-transform duration-300"
              />
              <nav className="flex space-x-2 sm:space-x-4 items-center">
                <a
                  href="#intro"
                  className="text-primary-purple text-xs sm:text-sm font-semibold hover:underline transition-all hidden md:block"
                >
                  Intro
                </a>
                <a
                  href="#features"
                  className="text-primary-purple text-xs sm:text-sm font-semibold hover:underline transition-all hidden md:block"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-primary-purple text-xs sm:text-sm font-semibold hover:underline transition-all hidden md:block"
                >
                  About
                </a>
                {/* Sign In and Sign Up buttons */}
                <Link
                  to="/login"
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-primary-purple bg-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-primary-purple text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-fuchsia-900 hover:scale-105 transition-transform duration-300"
                >
                  Join us now
                </Link>
              </nav>
            </div>
          </header>

          {/* Intro Section */}
          <section
            id="intro"
            className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-auto md:bg-center md:bg-cover px-4 sm:px-6 md:px-16 animate-fadeIn"
            style={{ backgroundImage: "url('/backgroundLanding.png')" }}
          >
            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-950/25 to-transparent"></div>

            {/* Left Side: Text and Call to Action */}
            <div className="relative z-10 container mx-auto flex flex-col justify-center items-center md:items-start md:w-1/2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 leading-tight drop-shadow-md animate-fadeInUp">
                Welcome to <span className="text-primary-purple">Talkify</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-8 text-center md:text-start animate-slideInLeft">
                Effortless connections, meaningful conversations. Where
                communication meets style.
              </p>
              <Link
                to="/register"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-purple to-fuchsia-900 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all"
              >
                Join us now
              </Link>
            </div>
            <div className="hidden md:block w-1/2"></div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="py-12 md:py-16 bg-secondary-purple/25 animate-slideInUp"
          >
            <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 animate-fadeInUp">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <IoRocketSharp className="text-6xl mb-4 animate-spin-slow" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Seamless Messaging
                  </h3>
                  <p className="text-sm sm:text-base">
                    Experience real-time messaging with friends and colleagues.
                    Our platform ensures smooth and reliable communication.
                  </p>
                </div>
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <FaMicrophoneAlt className="text-6xl mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Voice & Video Calls
                  </h3>
                  <p className="text-sm sm:text-base">
                    Connect face-to-face or over the phone with high-quality
                    voice and video calls, all within the same platform.
                  </p>
                </div>
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <FiSmartphone className="text-6xl mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Customizable Profiles
                  </h3>
                  <p className="text-sm sm:text-base">
                    Personalize your profile with unique avatars and
                    information. Make your presence known and stand out.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section
            id="about"
            className="py-12 md:py-16 bg-white animate-fadeInUp"
          >
            <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
                About Talkify
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-base sm:text-lg mb-8 text-gray-700 leading-relaxed">
                  Talkify was created to revolutionize the way we connect with
                  one another. Inspired by the need for more meaningful
                  interactions, our goal was to build a platform that makes
                  communication effortless and engaging. This project is part of
                  our portfolio for Alx School.
                </p>
              </div>
              <div className="flex justify-center gap-6 sm:gap-8 mb-8">
                <a
                  href="https://linkedin.com/"
                  className="text-primary-purple hover:underline flex items-center transition-transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
                <a
                  href="https://github.com/"
                  className="text-primary-purple hover:underline flex items-center transition-transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="mr-2" /> GitHub
                </a>
                <a
                  href="https://twitter.com/"
                  className="text-primary-purple hover:underline flex items-center transition-transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              </div>
              <a
                href="https://github.com/silgenius/Talkify"
                className="px-6 py-3 rounded-full bg-primary-purple text-white font-bold text-lg shadow-lg hover:bg-fuchsia-900 hover:scale-105 transition-transform duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub Repo
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full py-6 bg-secondary-purple/25 text-gray-800 text-center text-sm animate-fadeIn">
            <p>
              &copy; {new Date().getFullYear()} Talkify. All rights reserved.
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
