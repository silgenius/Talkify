import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./errorPage";
import Login from "./routes/auth/login/page";
import Dashboard from "./routes/dashboard/page";
import App from "./App";
import Register from "./routes/auth/register/page";
import Conversations from "./routes/conversations/page";
import Conversation from "./routes/conversations/[id]";
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
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
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
