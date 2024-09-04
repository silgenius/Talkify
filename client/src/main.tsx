import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import "@szhsin/react-menu/dist/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./errorPage";
import App from "./App";
import Login from "./routes/(auth)/Login";
import Register from "./routes/(auth)/Register";
import ChatBoard from "./routes/chatBoard/ChatBoard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/conversation/:id",
        element: <ChatBoard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
