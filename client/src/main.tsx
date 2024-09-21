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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { CallProvider } from "./contexts/CallContext";

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
        path: "/conversation/:id",
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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CallProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CallProvider>
    </QueryClientProvider>
  </StrictMode>
);
