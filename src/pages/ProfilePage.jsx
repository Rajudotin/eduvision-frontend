import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Bell,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Edit3,
  X,
  Save,
  Key,
  Sun,
  Moon,
  Smartphone,
  Mail,
} from "lucide-react";

const API_BASE = "/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [originalValues, setOriginalValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState({ c: false, n: false, cf: false });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );
  const [notifications, setNotifications] = useState({
    push: true,
    whatsapp: true,
    email: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFreshProfile(token);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fetchFreshProfile = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      const data = await res.json();
      if (data.user) {
        const u = data.user;
        setUser(u);
        setName(u.full_name || "");
        setEmail(u.email || "");
        setPhone(u.phone?.replace("+91", "") || "");
        setImageUrl(u.image_url || "");
        if (!u.image_url) setImageError(true);
        localStorage.setItem("user", JSON.stringify(u));
        setOriginalValues({
          name: u.full_name || "",
          email: u.email || "",
          phone: u.phone?.replace("+91", "") || "",
        });
      }
    } catch {
      const stored = localStorage.getItem("user");
      if (stored) {
        const fb = JSON.parse(stored);
        setUser(fb);
        setName(fb.full_name || "");
        setEmail(fb.email || "");
        setPhone(fb.phone?.replace("+91", "") || "");
        setImageUrl(fb.image_url || "");
        if (!fb.image_url) setImageError(true);
      } else navigate("/login");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const enableEdit = (f) => setEditMode((p) => ({ ...p, [f]: true }));
  const cancelEdit = (f) => {
    if (f === "name") setName(originalValues.name);
    if (f === "email") setEmail(originalValues.email);
    if (f === "phone") setPhone(originalValues.phone);
    setEditMode((p) => ({ ...p, [f]: false }));
  };

  const saveField = async (field) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = {};
      if (field === "name") body.full_name = name.trim();
      if (field === "email") body.email = email.trim();
      if (field === "phone") body.phone = phone ? `+91${phone}` : undefined;
      const res = await fetch(`${API_BASE}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const u = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(u));
        setUser(u);
        setImageUrl(data.user.image_url || "");
        setEditMode((p) => ({ ...p, [field]: false }));
        setOriginalValues({
          name: u.full_name || "",
          email: u.email || "",
          phone: u.phone?.replace("+91", "") || "",
        });
        showToast("Updated! ✅");
      } else showToast(data.error || "Failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    if (!name.trim() || !email.trim()) {
      showToast("Name & email required", "error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          phone: phone ? `+91${phone}` : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const u = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(u));
        setUser(u);
        setImageUrl(data.user.image_url || "");
        setEditMode({ name: false, email: false, phone: false });
        setOriginalValues({
          name: u.full_name || "",
          email: u.email || "",
          phone: u.phone?.replace("+91", "") || "",
        });
        showToast("Profile updated! ✅");
      } else showToast(data.error || "Failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToast("All fields required", "error");
      return;
    }
    if (newPwd.length < 6) {
      showToast("Min 6 chars", "error");
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast("Mismatch", "error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPwd,
          new_password: newPwd,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Password changed! 🔐");
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else showToast(data.error || "Failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: `/${user?.role || "student"}/dashboard`,
    },
    {
      id: "attendance",
      icon: CalendarCheck,
      label: "Attendance",
      path: `/${user?.role || "student"}/attendance`,
    },
    { id: "classes", icon: Users, label: "Classes", path: "/student/classes" },
    {
      id: "reports",
      icon: BarChart3,
      label: "Reports",
      path: `/${user?.role || "student"}/reports`,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: `/${user?.role || "student"}/profile`,
    },
  ];

  const getInitials = () =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";
  const getAvatarColor = () => {
    const c = [
      "bg-primary",
      "bg-secondary",
      "bg-tertiary",
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    let h = 0;
    for (let i = 0; i < (name || "").length; i++)
      h = name.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
  };

  const showImage = imageUrl && !imageError;
  const percentage = 82; // dummy for consistency

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - EXACT match with StudentDashboard */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-on-surface">
              EduVision AI
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-mono">
              {user?.role || "Student"} Portal
            </p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? "bg-primary/10 text-primary font-bold" : "text-outline hover:bg-surface-container-low hover:text-on-surface"}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-outline-variant/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-outline hover:bg-surface-container-low">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/10 z-50 flex justify-around py-3">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              navigate(item.path);
            }}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? "text-primary" : "text-outline"}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content - matches StudentDashboard spacing */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header - EXACT match */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Profile & Settings
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Manage your account and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <button className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <Bell className="w-5 h-5 text-outline" />
              </button>
            </div>
          </header>

          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 animate-slide-in ${toast.type === "error" ? "bg-error text-white" : "bg-tertiary text-white"}`}
            >
              {toast.type === "error" ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {toast.msg}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-6">
              Profile Information
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-6 border-b border-outline-variant/10">
              <div className="relative">
                {showImage ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-primary/10">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div
                    className={`w-24 h-24 rounded-full ${getAvatarColor()} flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-primary/10`}
                  >
                    <span className="text-3xl font-black text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-on-surface">
                  {name || "User"}
                </h3>
                <p className="text-sm text-outline capitalize">
                  {user?.role} • {user?.student_id}
                </p>
                {showImage && (
                  <p className="text-[10px] text-tertiary mt-1 font-medium">
                    📸 Cloudinary profile photo
                  </p>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              {[
                {
                  field: "name",
                  label: "Full Name",
                  value: name,
                  setter: setName,
                },
                {
                  field: "email",
                  label: "Email Address",
                  value: email,
                  setter: setEmail,
                  type: "email",
                },
                {
                  field: "phone",
                  label: "Phone (WhatsApp)",
                  value: phone,
                  setter: setPhone,
                  isPhone: true,
                },
              ].map(({ field, label, value, setter, type, isPhone }) => (
                <div key={field}>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">
                    {label}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {editMode[field] ? (
                      <>
                        {isPhone && (
                          <span className="bg-surface-container-low rounded-l-lg px-3 py-3 text-sm font-bold border-r border-outline-variant/20">
                            +91
                          </span>
                        )}
                        <input
                          className={`flex-1 bg-surface-container-low border-none ${isPhone ? "rounded-r-lg" : "rounded-lg"} p-3 text-sm focus:ring-2 focus:ring-primary/20 font-medium`}
                          type={type || "text"}
                          value={value}
                          onChange={(e) =>
                            isPhone
                              ? setter(
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10),
                                )
                              : setter(e.target.value)
                          }
                          maxLength={isPhone ? 10 : undefined}
                          autoFocus
                        />
                        <button
                          onClick={() => saveField(field)}
                          disabled={loading}
                          className="p-3 bg-tertiary text-white rounded-lg hover:brightness-110 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cancelEdit(field)}
                          className="p-3 bg-surface-container-low text-outline rounded-lg hover:bg-surface-container-high transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1 p-3 text-sm font-medium text-on-surface">
                          {isPhone
                            ? value
                              ? `+91 ${value}`
                              : "Not set"
                            : value || "Not set"}
                        </p>
                        <button
                          onClick={() => enableEdit(field)}
                          className="p-3 text-outline hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(editMode.name || editMode.email || editMode.phone) && (
              <button
                onClick={handleUpdateAll}
                disabled={loading}
                className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" />{" "}
                {loading ? "Saving..." : "Save All Changes"}
              </button>
            )}
          </div>

          {/* Password Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-6">
              Change Password
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Current Password",
                  val: currentPwd,
                  set: setCurrentPwd,
                  key: "c",
                },
                {
                  label: "New Password",
                  val: newPwd,
                  set: setNewPwd,
                  key: "n",
                },
                {
                  label: "Confirm New Password",
                  val: confirmPwd,
                  set: setConfirmPwd,
                  key: "cf",
                },
              ].map(({ label, val, set, key }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">
                    {label}
                  </label>
                  <div className="relative mt-1">
                    <input
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20"
                      type={showPwd[key] ? "text" : "password"}
                      value={val}
                      onChange={(e) => set(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        setShowPwd((p) => ({ ...p, [key]: !p[key] }))
                      }
                      className="absolute right-3 top-3 text-outline-variant hover:text-primary"
                    >
                      {showPwd[key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
              >
                <Key className="w-4 h-4" />{" "}
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-6">
              Preferences
            </h3>
            <div className="space-y-4">
              {[
                { key: "push", icon: Bell, label: "Push Notifications" },
                { key: "whatsapp", icon: Smartphone, label: "WhatsApp Alerts" },
                { key: "email", icon: Mail, label: "Email Digests" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-outline" />
                    <span className="text-sm font-medium text-on-surface">
                      {item.label}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((p) => ({
                        ...p,
                        [item.key]: !p[item.key],
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-all ${notifications[item.key] ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-all ${notifications[item.key] ? "ml-6" : "ml-0.5"}`}
                    ></div>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg mt-4">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-outline" />
                ) : (
                  <Sun className="w-4 h-4 text-outline" />
                )}
                <span className="text-sm font-medium text-on-surface">
                  Dark Mode
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-all ${darkMode ? "bg-primary" : "bg-outline-variant"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-all ${darkMode ? "ml-6" : "ml-0.5"}`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
