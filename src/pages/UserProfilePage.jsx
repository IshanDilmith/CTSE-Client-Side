import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, ChevronLeft } from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4 bg-gray-50">
        <User className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-store-text">Access Denied</h2>
        <p className="text-store-text-muted">Please log in to view your profile.</p>
        <Link to="/login">
          <Button className="mt-4 rounded-xl">Login</Button>
        </Link>
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link to="/" className="text-store-primary hover:underline flex items-center gap-2 font-medium mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-store-text flex items-center gap-3">
            <User className="h-8 w-8 text-store-primary" />
            My Profile
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-store-primary to-store-accent text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-store-primary/20 shrink-0">
            {getInitials(user.name)}
          </div>
          
          <div className="space-y-6 flex-1 w-full">
            <div>
              <h2 className="text-2xl font-bold text-store-text">{user.name}</h2>
              <div className="flex items-center gap-2 text-store-text-muted mt-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Role
                </div>
                <div className="font-semibold text-store-text uppercase tracking-wide">
                  {user.role}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-4">
               <Link to="/orders">
                 <Button variant="outline" className="rounded-xl border-gray-200">View My Orders</Button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
