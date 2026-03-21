import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout() {
  const location = useLocation();

  // Show sidebar on all admin routes EXCEPT the login page
  const isLoginPage = location.pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8 min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
