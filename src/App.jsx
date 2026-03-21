import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "@/components/Layout/UserLayout";
import AdminLayout from "@/components/Layout/AdminLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* User-facing routes with Header & Footer */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes without Header & Footer */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
