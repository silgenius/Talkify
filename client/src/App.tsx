import "./index.css";
import { Link } from "react-router-dom";
import { getUser } from "./utils/localStorage";
import Conversation from "./routes/conversation/[id]";

function App() {
  const currentUser = getUser();

  return (
    <>
      {currentUser ? (
        <Conversation />
      ) : (
        <div className="app-background">
          <div className="header">
            <img src="./talkify-logo-01.png" alt="Logo" className="logo" />
            <div className="nav-links">
              <Link className="nav-button bg-primary-purple text-white hover:bg-fuchsia-900" to="/register">
                Register
              </Link>
              <Link className="nav-button bg-white" to="/login">
                Login
              </Link>
            </div>
          </div>

          <div className="content">
            <div className="text-container">
              <h1 className="heading-1">
                Welcome to <br /> Talkify!
              </h1>
              <h2 className="heading-2">
                Effortless connections ,<br /> meaningful conversations
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
