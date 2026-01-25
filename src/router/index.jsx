import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../page/LoginPage/login";
import ForgotPasswordPage from "../page/ForgotPasswordPage/forgotpassword"; 
import Register from "../page/Register/register";
import Dashboard from "../page/Dashboard/dashboard";
import Order from "../page/Order/order";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        index: true, 
        element: <Order />,
      },
 
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard  />,
  },
  
  
]);