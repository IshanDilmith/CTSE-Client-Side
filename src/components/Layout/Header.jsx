import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ShoppingCart,
  Menu,
  X,
  User,
  LogIn,
} from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
          <Button
            variant="ghost"
            size="icon"
            className="relative text-store-text-muted hover:text-store-primary hover:bg-store-primary/5"
            id="cart-btn"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-bold text-white">
              0
            </span>
          </Button>
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
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
          <div className="pt-3 border-t border-gray-100 flex gap-2">
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
        </div>
      </div>
    </header>
  );
}
