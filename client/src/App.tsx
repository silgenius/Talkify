import { Link } from "react-router-dom";
import './index.css'; // Update to the correct path for the CSS file
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "./utils/localStorage";


function App() {
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    if (currentUser) {
      navigate("/conversations");
    }
  }, [currentUser, navigate]);

  return (
    <div className="app-background">
      <div className="header">
      <img src="./talkify-logo-01.png" alt="Logo" className="logo" />
        <div className="nav-links">
          <Link className="nav-button" to="/register">Register</Link>
          <Link className="nav-button" to="/login">Login</Link>
          <Link className="nav-button" to="/conversations">Conversations</Link>        
        </div>
      </div>

      <div className="content">
        <div className="text-container">
          <h1 className="heading-1">Welcome to <br /> Talkify!</h1>
          <h2 className="heading-2">Effortless connections ,<br /> meaningful conversations</h2>

        </div>
      </div>
    </div>
  );
}

export default App;
