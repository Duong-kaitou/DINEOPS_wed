import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../page/LoginPage/login";
import ForgotPasswordPage from "../page/ForgotPasswordPage/forgotpassword";
import Register from "../page/Register/register";
import Dashboard from "../page/Dashboard/dashboard";
import InventoryPage from "../page/ingredient/InventoryPage";
import FloorManagement from "../page/desk diagram/desk diagram";
import CategoryManagement from "../page/category/category";
import FoodManagement from "../page/Menu/Menu";
import VariantPage from "../page/Variant/VariantPage";
import OrdersDashboardPage from "../page/Order/OrderPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
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
    element: <Dashboard />,
  },
  {
    path: "/ingredient",
    element: <InventoryPage />,
  },

  {
    path: "/desk-diagram",
    element: <FloorManagement />,
  },
  {
    path: "/category",
    element: <CategoryManagement />,
  },
  {
    path: "/menu",
    element: <FoodManagement />,
  },
  {
    path: "/variants",
    element: <VariantPage />,
  },
  {
    path: "/orders",
    element: <OrdersDashboardPage />,
  },


]);