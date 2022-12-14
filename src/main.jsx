import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Login from "./features/Login";
import AcceptedRequests from "./features/AcceptedRequests";
import Root from "./Root";
import UserList from "./features/UserList";
import Register from "./features/Register";
import UserDetail from "./features/UserDetail";
import PasswordReset from "./features/PasswordReset";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./AuthProvider";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "user-list",
        element: <UserList />,
      },
      {
        path: "user-detail/:userId",
        element: <UserDetail />,
      },
      {
        path: "user-accepted-requests",
        element: <AcceptedRequests />,
      },
      {
        path: "password-reset/:uid/:token",
        element: <PasswordReset />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
    <Toaster />
  </MantineProvider>
);
