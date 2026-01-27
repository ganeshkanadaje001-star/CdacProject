import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ProductsPage from "../pages/admin/ProductsPage";
import AddProductPage from "../pages/admin/AddProductPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import OrdersPage from "../pages/admin/OrdersPage";
import ProtectedAdmin from "../components/common/ProtectedAdmin";
import ProtectedCustomer from "../components/common/ProtectedCustomer";
import CustomerDashboardPage from "../pages/customer/DashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdmin>
            <DashboardPage />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedAdmin>
            <ProductsPage />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/products/add"
        element={
          <ProtectedAdmin>
            <AddProductPage />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedAdmin>
            <CategoriesPage />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedAdmin>
            <OrdersPage />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedCustomer>
            <CustomerDashboardPage />
          </ProtectedCustomer>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
