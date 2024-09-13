import { getUser } from "./utils/localStorage";
import Conversation from "./routes/conversation/[id]";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { GiRocket, GiMicrophone, GiSmartphone } from "react-icons/gi";
import { talkifyLogo } from "./assets";
import "./index.css";

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
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <img
                src={talkifyLogo}
                alt="Talkify Logo"
                className="w-20 hover:scale-105 transition-transform duration-300"
              />
              <nav className="flex space-x-4 items-center">
                <a
                  href="#intro"
                  className="text-primary-purple text-sm font-semibold hover:underline transition-all"
                >
                  Intro
                </a>
                <a
                  href="#features"
                  className="text-primary-purple text-sm font-semibold hover:underline transition-all"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-primary-purple text-sm font-semibold hover:underline transition-all"
                >
                  About
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 rounded-full bg-primary-purple text-white text-sm font-semibold shadow-lg hover:bg-fuchsia-900 hover:scale-105 transition-transform duration-300"
                >
                  Get Started
                </a>
              </nav>
            </div>
          </header>

          {/* Intro Section */}
          <section
            id="intro"
            className="relative flex items-center justify-between min-h-screen bg-cover bg-center px-16 animate-fadeIn"
            style={{ backgroundImage: "url('/backgroundLanding.png')" }}
          >
            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-950/25 to-transparent"></div>

            {/* Left Side: Text and Call to Action */}
            <div className="relative z-10 container mx-auto px-6 flex flex-col justify-center items-start md:w-1/2">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-md animate-fadeInUp">
                Welcome to <span className="text-primary-purple">Talkify</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-slideInLeft">
                Effortless connections, meaningful conversations. Where
                communication meets style.
              </p>
              <a
                href="/register"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-purple to-fuchsia-900 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all"
              >
                Get Started
              </a>
            </div>
            <div className="w-1/2"></div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="py-16 bg-secondary-purple/25 animate-slideInUp"
          >
            <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold mb-12 animate-fadeInUp">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <GiRocket className="text-6xl mb-4 animate-spin-slow" />
                  <h3 className="text-xl font-semibold mb-2">
                    Seamless Messaging
                  </h3>
                  <p className="text-white">
                    Experience real-time messaging with friends and colleagues.
                    Our platform ensures smooth and reliable communication.
                  </p>
                </div>
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <GiMicrophone className="text-6xl mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Voice & Video Calls
                  </h3>
                  <p className="text-white">
                    Connect face-to-face or over the phone with high-quality
                    voice and video calls, all within the same platform.
                  </p>
                </div>
                <div className="bg-fuchsia-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
                  <GiSmartphone className="text-6xl mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Customizable Profiles
                  </h3>
                  <p className="text-white">
                    Personalize your profile with unique avatars and
                    information. Make your presence known and stand out.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-16 bg-white pb-32 animate-fadeInUp">
            <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                About Talkify
              </h2>
              <div className="max-w-3xl mx-auto px-4">
                <p className="text-lg mb-8 text-gray-700 leading-relaxed">
                  Talkify was created to revolutionize the way we connect with
                  one another. Inspired by the need for more meaningful
                  interactions, our goal was to build a platform that makes
                  communication effortless and engaging. This project is part of
                  our portfolio for Alx School.
                </p>
              </div>
              <div className="flex justify-center gap-8 mb-8">
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
          <footer className="absolute bottom-0 w-full py-6 bg-secondary-purple/25 text-gray-800 text-center text-sm animate-fadeIn">
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
