import { useNavigate, useRouteError } from "react-router-dom";

interface RouteError {
  status: number;
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);
  const navigate = useNavigate();

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1 className="text-4xl mb-4">Oops!</h1>
      <p className="text-xl mb-8">Sorry, an unexpected error has occurred.</p>
      <p className="text-lg">
        <i>
          {error.status} {error.statusText || error.message}
        </i>
      </p>
      <button
        className="bg-primary-purple hover:bg-fuchsia-900 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/")}
      >
        Take me Home
      </button>
    </div>
  );
}
