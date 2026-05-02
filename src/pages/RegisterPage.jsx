import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Camera,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  GraduationCap,
  Building,
} from "lucide-react";
import { registerUser, registerFace } from "../services/api";

const ROLES = ["student", "teacher"];
const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const YEARS = [1, 2, 3, 4];

export default function RegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    student_id: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
    branch: "",
    year_of_study: "",
    password: "",
    confirmPassword: "",
  });

  const [faceImages, setFaceImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.student_id || !form.full_name || !form.email || !form.password) {
      setError("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email format");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && faceImages.length >= 3) setStep(3);
    else if (step === 2) setError("Please upload at least 3 face images");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + faceImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setFaceImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
    setError("");
  };

  const removeImage = (index) => {
    setFaceImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const phoneWithCode = `+91${form.phone}`;

      // ✅ Include department, branch, year_of_study
      const userData = {
        student_id: form.student_id,
        full_name: form.full_name,
        email: form.email,
        phone: phoneWithCode,
        password: form.password,
        role: role,
        department: form.department || null,
        branch: form.branch || null,
        year_of_study: form.year_of_study ? parseInt(form.year_of_study) : null,
      };

      const res = await registerUser(userData);

      if (res.data.success) {
        if (faceImages.length >= 3) {
          const fd = new FormData();
          fd.append("student_id", form.student_id);
          fd.append("full_name", form.full_name);
          fd.append("email", form.email);
          fd.append("phone", phoneWithCode);
          faceImages.forEach((img) => fd.append("images", img));
          await registerFace(fd);
        }
        navigate("/login", { state: { registered: true, role } });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row min-h-screen">
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
            Smart Attendance, <br />
            <span className="text-primary-fixed-dim">Smarter Education</span>
          </h1>
          <div className="flex gap-4 mt-8">
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-mono text-[10px] uppercase text-primary font-bold">
                Accuracy
              </p>
              <p className="font-mono text-lg text-white">99.8%</p>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-mono text-[10px] uppercase text-tertiary font-bold">
                Response
              </p>
              <p className="font-mono text-lg text-white">&lt;2s</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-white/60 text-sm max-w-xs">
          Precision biometric protocols active.
        </p>
      </section>

      <section className="flex-grow bg-white flex flex-col justify-center items-center p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-6 py-8">
          <div className="md:hidden flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">
              EduVision AI
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Create Account
            </h2>
            <p className="text-on-surface-variant text-sm">
              Join the next generation of academic management.
            </p>
          </div>

          <div className="bg-surface-container-low p-1.5 rounded-xl flex">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setStep(1);
                }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all capitalize ${role === r ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${s <= step ? "bg-primary" : "bg-surface-container-highest"}`}
              ></div>
            ))}
          </div>

          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-outline">
                Step 1: Account Details
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Student ID / Roll Number *"
                  value={form.student_id}
                  onChange={(e) => updateForm("student_id", e.target.value)}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Full Name *"
                  value={form.full_name}
                  onChange={(e) => updateForm("full_name", e.target.value)}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Email Address *"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>

              <div className="flex">
                <span className="bg-surface-container-low rounded-l-lg px-3 flex items-center border-r text-sm font-bold">
                  +91
                </span>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                  <input
                    className="w-full bg-surface-container-low border-none rounded-r-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      updateForm(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    maxLength={10}
                  />
                </div>
              </div>

              {role === "student" && (
                <>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                    <select
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                      value={form.department}
                      onChange={(e) => updateForm("department", e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-4 text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="Branch (e.g. AIML)"
                      value={form.branch}
                      onChange={(e) => updateForm("branch", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                    <select
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                      value={form.year_of_study}
                      onChange={(e) =>
                        updateForm("year_of_study", e.target.value)
                      }
                    >
                      <option value="">Year of Study</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Password *"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-3.5 text-outline-variant"
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-outline-variant" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Confirm Password *"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateForm("confirmPassword", e.target.value)
                  }
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-outline">
                Step 2: Face Registration (Min 3)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-all"
              >
                <Camera className="w-10 h-10 text-outline-variant" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-outline-variant">
                  Front, Left, Right angles
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={p}
                        alt=""
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-outline">
                {faceImages.length}/3 minimum
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-lg border border-outline-variant font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={faceImages.length < 3}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-outline">
                Step 3: Confirm
              </label>
              <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-sm">
                <p>
                  <span className="font-bold">Role:</span>{" "}
                  <span className="capitalize">{role}</span>
                </p>
                <p>
                  <span className="font-bold">ID:</span> {form.student_id}
                </p>
                <p>
                  <span className="font-bold">Name:</span> {form.full_name}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {form.email}
                </p>
                <p>
                  <span className="font-bold">Phone:</span> +91 {form.phone}
                </p>
                {form.department && (
                  <p>
                    <span className="font-bold">Dept:</span> {form.department}
                  </p>
                )}
                {form.branch && (
                  <p>
                    <span className="font-bold">Branch:</span> {form.branch}
                  </p>
                )}
                {form.year_of_study && (
                  <p>
                    <span className="font-bold">Year:</span>{" "}
                    {form.year_of_study}
                  </p>
                )}
                <p>
                  <span className="font-bold">Face:</span> {faceImages.length}{" "}
                  images
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-lg border font-bold text-sm flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-outline">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
