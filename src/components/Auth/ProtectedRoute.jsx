import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // Not logged in
  if (!token || !userRaw) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  try {
    const user = JSON.parse(userRaw);

    // Check required role
    if (requiredRole && user.role !== requiredRole) {
      return (
        <Navigate
          to={requiredRole === "admin" ? "/admin/login" : "/login"}
          replace
          state={{ from: location }}
        />
      );
    }
  } catch {
    // Invalid user data in localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
