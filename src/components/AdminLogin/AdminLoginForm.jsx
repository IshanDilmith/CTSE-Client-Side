import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Smartphone,
} from "lucide-react";
import { loginUser } from "@/services/authService";
import { toast } from "react-hot-toast";

export default function AdminLoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData.email, formData.password);

      // Verify the user has admin role
      if (data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success('Successfully logged in!')
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-store-primary-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-store-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-store-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-store-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-store-primary to-store-accent shadow-lg shadow-store-primary/30">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Tech</span>
              <span className="text-store-accent">Nest</span>
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl shadow-black/30 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-store-primary to-store-accent shadow-lg shadow-store-primary/30 animate-pulse-glow">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Authorized personnel only — enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form">
              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400" id="admin-login-error">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-300 font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@technest.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-store-primary focus:ring-store-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-slate-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-store-primary focus:ring-store-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-store-primary transition-colors"
                    aria-label="Toggle password visibility"
                    id="admin-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-store-primary to-store-accent text-white shadow-lg shadow-store-primary/25 hover:shadow-xl hover:shadow-store-primary/30 transition-all duration-300 rounded-xl text-base font-medium"
                id="admin-login-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>

            {/* Back to user login */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Not an admin?{" "}
              <Link
                to="/login"
                className="text-store-accent hover:text-store-accent-light font-medium transition-colors"
              >
                User Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
