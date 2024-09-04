import { Link } from "react-router-dom";
import { getUser } from "./utils/localStorage";
import EmptyChat from "./routes/chatBoard/components/EmptyChat";

function App() {
  const currentUser = getUser();

  return (
    <>
      {currentUser ? (
        <EmptyChat />
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center">
          <div className="flex flex-col md:flex-row items-center max-w-6xl w-full px-4">
            <header className="flex flex-col items-center md:items-start md:w-1/2 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">
                Welcome to Talkify
              </h1>
              <p className="mt-4 text-lg md:text-xl font-light max-w-xl">
                Connect with your friends and colleagues effortlessly with
                Talkify. A modern, fast, and secure way to stay in touch.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link
                  className="transform transition-transform hover:scale-105 px-6 py-3 bg-white text-primary-purple font-bold rounded-lg shadow-lg hover:shadow-2xl"
                  to="/register"
                >
                  Get Started
                </Link>
                <Link
                  className="transform transition-transform hover:scale-105 px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg shadow-lg hover:bg-white hover:text-primary-purple"
                  to="/login"
                >
                  Login
                </Link>
              </div>
            </header>

            <div className="mt-16 md:mt-0 md:w-1/2 flex justify-center md:justify-end">
              <img
                src="/illustration.png"
                alt="Chat Illustration"
                className="w-full max-w-xl mx-auto md:mx-0"
              />
            </div>
          </div>

          <footer className="absolute bottom-4 text-sm text-gray-300">
            <p>&copy; 2024 Talkify. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;

// import './index.css';
// import { Link } from "react-router-dom";

// function App() {

//   return (
//     <div className="app-background">
//       <div className="header">
//       <img src="./talkify-logo-01.png" alt="Logo" className="logo" />
//         <div className="nav-links">
//           <Link className="nav-button" to="/register">Register</Link>
//           <Link className="nav-button" to="/login">Login</Link>
//           <Link className="nav-button" to="/conversations">Conversations</Link>
//         </div>
//       </div>

//       <div className="content">
//         <div className="text-container">
//           <h1 className="heading-1">Welcome to <br /> Talkify!</h1>
//           <h2 className="heading-2">Effortless connections ,<br /> meaningful conversations</h2>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
