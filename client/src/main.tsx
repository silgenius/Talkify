import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./errorPage";
import Login from "./routes/auth/Login";
import Dashboard from "./routes/dashboard/page";
import App from "./App";
import Register from "./routes/auth/Register";
import Conversations from "./routes/conversations/Conversations";
import Conversation from "./routes/conversations/components/Conversation";
import Profile from "./routes/profile/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/conversations",
        element: <Conversations />,
        children: [
          {
            path: "/conversations/:id",
            element: <Conversation />,
          },
        ],
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
