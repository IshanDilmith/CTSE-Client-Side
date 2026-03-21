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
  User,
  UserPlus,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "@/services/authService";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const passwordChecks = [
    { label: "At least 6 characters", check: formData.password.length >= 6 },
    { label: "Contains a number", check: /\d/.test(formData.password) },
    {
      label: "Passwords match",
      check:
        formData.confirmPassword.length > 0 &&
        formData.password === formData.confirmPassword,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Successfully logged in!')
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-store-bg via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-store-accent/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-store-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-store-primary to-store-accent shadow-lg shadow-store-primary/20">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-store-primary">Tech</span>
              <span className="text-store-accent">Nest</span>
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl shadow-store-primary/10 bg-white/80 backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-store-text">
              Create Account
            </CardTitle>
            <CardDescription className="text-store-text-muted">
              Join TechNest and start shopping today
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600" id="register-error">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-store-text font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-store-text-muted" />
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-store-primary focus:ring-store-primary/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-store-text font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-store-text-muted" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-store-primary focus:ring-store-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-store-text font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-store-text-muted" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-store-primary focus:ring-store-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-store-text-muted hover:text-store-primary transition-colors"
                    aria-label="Toggle password visibility"
                    id="register-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-store-text font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-store-text-muted" />
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-store-primary focus:ring-store-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-store-text-muted hover:text-store-primary transition-colors"
                    aria-label="Toggle confirm password visibility"
                    id="register-toggle-confirm"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicators */}
              {formData.password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {passwordChecks.map(({ label, check }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        check ? "text-green-600" : "text-store-text-muted"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          check ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-store-primary to-store-primary-light text-white shadow-lg shadow-store-primary/25 hover:shadow-xl hover:shadow-store-primary/30 transition-all duration-300 rounded-xl text-base font-medium mt-2"
                id="register-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-store-text-muted">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-11 border-store-primary/20 text-store-primary hover:bg-store-primary/5 rounded-xl"
                id="goto-login-btn"
              >
                Sign In Instead
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
