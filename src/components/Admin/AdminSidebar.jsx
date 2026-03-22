import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Admins",
    path: "/admin/admins",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      id="admin-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-store-primary to-store-accent shadow-lg shadow-store-primary/30">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-lg font-bold tracking-tight">
              <span className="text-store-primary-light">Tech</span>
              <span className="text-store-accent">Nest</span>
            </h2>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-store-primary/20 text-store-primary-light shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              id={`admin-nav-${item.label.toLowerCase()}`}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? "text-store-primary-light" : "text-slate-500 group-hover:text-white"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-store-primary-light" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          id="collapse-sidebar-btn"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          id="admin-logout-btn"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
