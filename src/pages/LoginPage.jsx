// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Eye, EyeOff, Lock, User, LogIn } from "lucide-react";
import { loginUser } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ student_id: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_id || !form.password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form.student_id, form.password);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else if (user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row min-h-screen">
      {/* Left Branding */}
      <section className="hidden md:flex md:w-1/2 bg-on-surface relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              EduVision AI
            </span>
          </Link>
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Welcome <span className="text-primary-fixed-dim">Back</span>
          </h1>
          <p className="text-white/60 text-lg">
            Access your attendance dashboard, reports, and more.
          </p>
        </div>
      </section>

      {/* Right Form */}
      <section className="flex-grow bg-white flex flex-col justify-center items-center p-6 md:p-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="md:hidden flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">
              EduVision AI
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Sign In
            </h2>
            <p className="text-on-surface-variant text-sm">
              Enter your credentials to continue.
            </p>
          </div>

          {/* Success Message */}
          {registered && (
            <div className="bg-tertiary/10 text-tertiary text-sm p-3 rounded-lg font-medium">
              ✅ Registration successful! Please login.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
              <input
                className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Student ID or Email"
                value={form.student_id}
                onChange={(e) =>
                  setForm({ ...form, student_id: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
              <input
                className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-3.5 text-outline-variant hover:text-primary"
              >
                {showPwd ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3.5 rounded-lg font-bold text-sm shadow-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />{" "}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-center text-outline">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>

          {/* Admin Login Hint */}
          <div className="bg-surface-container-low p-3 rounded-lg text-center">
            <p className="text-[10px] font-mono text-outline uppercase tracking-wider">
              Admin Access: Use admin credentials
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
