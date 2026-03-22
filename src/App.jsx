import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "@/components/Layout/UserLayout";
import AdminLayout from "@/components/Layout/AdminLayout";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminAdminsPage from "@/pages/AdminAdminsPage";
import CartPage from "@/pages/CartPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import UserProfilePage from "@/pages/UserProfilePage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";

function App() {
  return (
    <>
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* User-facing routes with Header & Footer */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoriesPage />} />
          </Route>

          {/* Admin routes with Sidebar */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAdminsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </>
  );
}

export default App;
