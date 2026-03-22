import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ShoppingCart,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  UserCircle,
  Settings,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/categories" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { cartItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Check auth state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (token && userRaw) {
        try {
          setUser(JSON.parse(userRaw));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", checkAuth);
    // Listen for custom auth event (login/logout in same tab)
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-store-primary/5 border-b border-store-primary/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="logo-link">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-store-primary to-store-accent shadow-md shadow-store-primary/20 transition-transform duration-300 group-hover:scale-110">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-store-primary">Tech</span>
            <span className="text-store-accent">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === path
                  ? "text-store-primary bg-store-primary/10"
                  : "text-store-text-muted hover:text-store-primary hover:bg-store-primary/5"
              }`}
            >
              {label}
              {location.pathname === path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-store-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2" id="desktop-actions">
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-store-text-muted hover:text-store-primary hover:bg-store-primary/5"
              id="cart-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            </Button>
          </Link>

          {user ? (
            /* Logged-in: User Avatar + Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-store-primary/5 transition-all duration-200"
                id="user-menu-btn"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-store-primary to-store-accent text-white text-xs font-bold shadow-md shadow-store-primary/20">
                  {getInitials(user.name)}
                </div>
                <span className="text-sm font-medium text-store-text max-w-[100px] truncate hidden lg:block">
                  {user.name}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-store-text-muted transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 animate-fade-in-up z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-store-text truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-store-text-muted truncate">
                      {user.email}
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-store-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-store-primary uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-store-text-muted hover:text-store-primary hover:bg-store-primary/5 transition-colors"
                      id="user-profile-link"
                    >
                      <UserCircle className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-store-text-muted hover:text-store-primary hover:bg-store-primary/5 transition-colors"
                      id="user-orders-link"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-store-text-muted hover:text-store-primary hover:bg-store-primary/5 transition-colors"
                        id="admin-panel-link"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      id="user-logout-btn"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not logged-in: Login + Sign Up */
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-store-text-muted hover:text-store-primary hover:bg-store-primary/5 gap-1.5"
                  id="login-btn"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-store-primary to-store-primary-light text-white shadow-md shadow-store-primary/25 hover:shadow-lg hover:shadow-store-primary/30 transition-all duration-300"
                  id="signup-btn"
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-store-text-muted hover:bg-store-primary/5 transition-colors"
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-store-primary/10 px-4 py-4 space-y-1">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === path
                  ? "text-store-primary bg-store-primary/10"
                  : "text-store-text-muted hover:bg-store-primary/5 hover:text-store-primary"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              /* Mobile logged-in state */
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-store-primary to-store-accent text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-store-text">{user.name}</p>
                    <p className="text-xs text-store-text-muted">{user.email}</p>
                  </div>
                </div>
                <Link to="/orders" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    size="sm"
                    id="mobile-orders-link"
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin/dashboard" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      size="sm"
                      id="mobile-admin-link"
                    >
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-500 border-red-200 hover:bg-red-50"
                  size="sm"
                  id="mobile-logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              /* Mobile guest state */
              <div className="flex gap-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm" id="mobile-login-btn">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button
                    className="w-full bg-gradient-to-r from-store-primary to-store-primary-light text-white"
                    size="sm"
                    id="mobile-signup-btn"
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
