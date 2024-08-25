import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1 className="text-3xl font-semibold text-primary-purple">Welcome to Talkify</h1>
      <div className="flex space-x-4">
        <Link className="border border-secondary-purple p-2 w-fit rounded-lg" to="/register">Register page</Link>
        <Link className="border border-secondary-purple p-2 w-fit rounded-lg" to="/login">Login page</Link>
        <Link className="border border-secondary-purple p-2 w-fit rounded-lg" to="/conversations">Conversations page</Link>        
      </div>

    </>
  )
}

export default App;
