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
// Customer Pages
import HomePage from "../pages/customer/HomePage";
import ProductDetailsPage from "../pages/customer/ProductDetailsPage";
import CartPage from "../pages/customer/CartPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import ProfilePage from "../pages/customer/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* CUSTOMER ROUTES */}
      <Route path="/cart" element={<ProtectedCustomer><CartPage /></ProtectedCustomer>} />
      <Route path="/checkout" element={<ProtectedCustomer><CheckoutPage /></ProtectedCustomer>} />
      <Route path="/profile" element={<ProtectedCustomer><ProfilePage /></ProtectedCustomer>} />
      <Route path="/customer/dashboard" element={<Navigate to="/" replace />} />

      {/* ADMIN ROUTES */}
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
    </Routes>
  );
};

export default AppRoutes;
