import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TeacherLayout from '../components/TeacherLayout';
import {
  LayoutDashboard, Users, CalendarCheck, BarChart3, Settings,
  HelpCircle, LogOut, Camera, Upload, CheckCircle,
  Bell, Sparkles, RotateCcw, TrendingUp,
  AlertTriangle, UserCheck, UserPlus, XCircle, Smartphone,
} from "lucide-react";
import {
  getTodayAttendance, markAttendance, getUsers, manualMarkAttendance,
  sendWhatsappAlerts,
} from "../services/api";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uncertainFaces, setUncertainFaces] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentVerifyIndex, setCurrentVerifyIndex] = useState(0);
  const [manualId, setManualId] = useState("");
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [whatsappSending, setWhatsappSending] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { navigate("/login"); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "teacher") { navigate("/student/dashboard"); return; }
    setUser(parsed);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, studentsRes] = await Promise.all([getTodayAttendance(), getUsers("student")]);
      setTodayData(todayRes.data);
      setStudents(studentsRes.data?.users || []);
    } catch (err) { console.error("Load failed:", err); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const getStudentName = (studentId) => students.find(s => s.student_id === studentId)?.full_name || studentId;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "environment" } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setCameraActive(true); }
    } catch { alert("Cannot access camera."); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) { videoRef.current.srcObject.getTracks().forEach(t => t.stop()); videoRef.current.srcObject = null; }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvasRef.current.toBlob(blob => { setCapturedImage(URL.createObjectURL(blob)); }, "image/jpeg", 0.9);
    stopCamera();
  };

  const handleFileUpload = (e) => { const file = e.target.files?.[0]; if (file) setCapturedImage(URL.createObjectURL(file)); };

  const handleMarkAttendance = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const fd = new FormData(); fd.append("photo", blob, "attendance.jpg");
      const res = await markAttendance(fd);
      const data = res.data;
      if (data.uncertain_faces?.length > 0) {
        setUncertainFaces(data.uncertain_faces); setAttendanceResult(data);
        setCurrentVerifyIndex(0); setVerifiedStudents([]); setShowVerificationModal(true);
      } else { setAttendanceResult(data); setShowResultModal(true); loadData(); }
    } catch { alert("Failed."); } finally { setLoading(false); }
  };

  // ==================== WHATSAPP ALERTS ====================
  const handleSendWhatsappAlerts = async () => {
    setWhatsappSending(true);
    setWhatsappStatus("");
    try {
      const res = await sendWhatsappAlerts();
      if (res.data?.success) {
        setWhatsappStatus(`✅ Alerts sent! ${res.data.absent_count || 0} students notified.`);
      } else {
        setWhatsappStatus("❌ Failed to send alerts.");
      }
    } catch {
      setWhatsappStatus("❌ Network error. Make sure WhatsApp service is running.");
    } finally {
      setWhatsappSending(false);
      setTimeout(() => setWhatsappStatus(""), 5000);
    }
  };

  const handleConfirmStudent = async (studentId) => {
    if (!studentId) return;
    setLoading(true); setVerificationMessage("");
    try {
      const res = await manualMarkAttendance({ student_id: studentId, marked_by: "manual", confidence: currentFace?.confidence || 0 });
      if (res.data?.success) {
        const name = getStudentName(studentId);
        setVerifiedStudents(prev => [...prev, { id: studentId, name }]);
        setVerificationMessage(`✅ ${name} confirmed PRESENT`);
        setTimeout(() => { setVerificationMessage(""); moveNext(); }, 800);
      } else setVerificationMessage("❌ Failed");
    } catch { setVerificationMessage("❌ Network error"); } finally { setLoading(false); }
  };

  const moveNext = () => {
    if (currentVerifyIndex < uncertainFaces.length - 1) { setCurrentVerifyIndex(p => p + 1); setManualId(""); }
    else { setShowVerificationModal(false); setTimeout(() => { setShowResultModal(true); loadData(); }, 300); }
  };

  const handleSkipFace = () => {
    if (currentVerifyIndex < uncertainFaces.length - 1) { setCurrentVerifyIndex(p => p + 1); setManualId(""); setVerificationMessage(""); }
    else { setShowVerificationModal(false); setShowResultModal(true); loadData(); }
  };

  const handleManualIdSubmit = () => { if (manualId.trim()) handleConfirmStudent(manualId.trim().toUpperCase()); };
  const handleFinalizeAttendance = () => { setShowVerificationModal(false); setShowResultModal(true); loadData(); };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { id: "attendance", icon: CalendarCheck, label: "Attendance", path: "/teacher/attendance" },
    { id: "classes", icon: Users, label: "Classes", path: "/teacher/classes" },
    { id: "reports", icon: BarChart3, label: "Reports", path: "/teacher/reports" },
    { id: "settings", icon: Settings, label: "Settings", path: "/teacher/profile" },
  ];

  const presentCount = todayData?.records?.length || 0;
  const absentCount = students.length - presentCount;
  const currentFace = uncertainFaces[currentVerifyIndex];
  const totalVerified = verifiedStudents.length;

  return (
    <TeacherLayout onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Take Attendance</h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-1">{presentCount}/{students.length} students present today</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </div>
            <button className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors"><Bell className="w-5 h-5 text-outline" /></button>
          </div>
        </header>

        {/* WhatsApp Status Bar */}
        {whatsappStatus && (
          <div className={`p-3 rounded-lg text-sm font-bold text-center ${whatsappStatus.startsWith("✅") ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>
            {whatsappStatus}
          </div>
        )}

        {attendanceMode ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-surface-container-low">
                {attendanceMode === "camera" && <><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />{!cameraActive && !capturedImage && <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white"><Camera className="w-16 h-16 mb-4 text-outline-variant" /><button onClick={startCamera} className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all">Start Camera</button></div>}{capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />}</>}
                {attendanceMode === "upload" && <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 cursor-pointer hover:bg-slate-200 transition-all">{capturedImage ? <img src={capturedImage} alt="Uploaded" className="w-full h-full object-cover" /> : <><Upload className="w-16 h-16 mb-4 text-outline-variant" /><p className="text-sm font-medium text-outline">Click to upload classroom photo</p><p className="text-xs text-outline-variant mt-1">Supports JPG, PNG up to 10MB</p></>}<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" /></div>}
                <canvas ref={canvasRef} className="hidden" />
                {cameraActive && <div className="absolute bottom-4 left-1/2 -translate-x-1/2"><button onClick={capturePhoto} className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Camera className="w-5 h-5" /> Capture</button></div>}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Attendance Mode</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setAttendanceMode("camera"); setCapturedImage(null); startCamera(); }} className={`p-4 rounded-lg border-2 text-center transition-all ${attendanceMode === "camera" ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/30"}`}><Camera className={`w-8 h-8 mx-auto mb-2 ${attendanceMode === "camera" ? "text-primary" : "text-outline-variant"}`} /><p className="text-xs font-bold">Live Camera</p></button>
                  <button onClick={() => { setAttendanceMode("upload"); setCapturedImage(null); stopCamera(); }} className={`p-4 rounded-lg border-2 text-center transition-all ${attendanceMode === "upload" ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/30"}`}><Upload className={`w-8 h-8 mx-auto mb-2 ${attendanceMode === "upload" ? "text-primary" : "text-outline-variant"}`} /><p className="text-xs font-bold">Upload Photo</p></button>
                </div>
              </div>
              {capturedImage && <div className="space-y-3">
                <button onClick={handleMarkAttendance} disabled={loading} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-lg font-black text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"><CheckCircle className="w-5 h-5" /> {loading ? "Processing..." : "Mark Attendance"}</button>
                <button onClick={() => { setCapturedImage(null); if (attendanceMode === "camera") startCamera(); }} className="w-full bg-surface-container-low text-on-surface py-3 rounded-lg font-bold text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retake</button>
              </div>}

              {/* WhatsApp Alert Button */}
              <button onClick={handleSendWhatsappAlerts} disabled={whatsappSending} className="w-full bg-tertiary text-white py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Smartphone className="w-4 h-4" /> {whatsappSending ? "Sending..." : "Send WhatsApp Alerts"}
              </button>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Live Count</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-tertiary/5 rounded-lg"><p className="text-3xl font-black text-tertiary font-mono">{presentCount}</p><p className="text-[10px] uppercase font-bold text-outline mt-1">Present</p></div>
                  <div className="text-center p-4 bg-error/5 rounded-lg"><p className="text-3xl font-black text-error font-mono">{absentCount}</p><p className="text-[10px] uppercase font-bold text-outline mt-1">Absent</p></div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border-l-4 border-primary">
                <h2 className="text-2xl font-black mb-2">Welcome back, {user?.full_name?.split(" ")[0] || "Teacher"}!</h2>
                <p className="text-outline text-sm mb-6">Ready to take attendance for your classes today.</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { setAttendanceMode("camera"); startCamera(); }} className="px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Camera className="w-5 h-5" /> Live Camera</button>
                  <button onClick={() => setAttendanceMode("upload")} className="px-6 py-3 bg-surface-container-low text-on-surface rounded-lg font-bold hover:bg-surface-container-high transition-all flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Photo</button>
                  <button onClick={handleSendWhatsappAlerts} disabled={whatsappSending} className="px-6 py-3 bg-tertiary text-white rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-2"><Smartphone className="w-5 h-5" /> {whatsappSending ? "Sending..." : "WhatsApp Alerts"}</button>
                </div>
              </div>
              <div className="lg:col-span-4 bg-secondary text-white p-6 rounded-xl flex flex-col justify-between">
                <div className="flex items-center gap-2"><TrendingUp className="w-8 h-8 text-white/60" /><p className="font-mono text-xs uppercase tracking-widest opacity-80">Today</p></div>
                <p className="text-4xl font-black mt-2">{presentCount}/{students.length}</p>
                <p className="text-xs text-white/60 mt-1">attendance rate: {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%</p>
              </div>
            </section>
            <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="p-6 md:p-8"><h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-1">Student Registry</h3><p className="text-sm text-outline">{students.length} students enrolled</p></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left"><thead><tr className="bg-surface-container-low text-[10px] font-mono text-outline uppercase tracking-widest"><th className="px-6 py-4 font-bold">Student</th><th className="px-6 py-4 font-bold">ID</th><th className="px-6 py-4 font-bold">Email</th><th className="px-6 py-4 font-bold">Status</th></tr></thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {students.slice(0, 10).map((s, i) => {
                      const isPresent = todayData?.records?.some(r => r.student_id === s.student_id);
                      return <tr key={i} className="hover:bg-surface-container-low transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div><div><p className="font-bold text-sm">{s.full_name}</p><p className="text-[10px] text-outline">Year {s.year_of_study || "N/A"}</p></div></div></td><td className="px-6 py-4 font-mono text-xs text-outline">{s.student_id}</td><td className="px-6 py-4 text-xs text-outline">{s.email}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${isPresent ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>{isPresent ? "Present" : "Absent"}</span></td></tr>;
                    })}
                  </tbody></table>
              </div>
            </div>
          </>
        )}
      </div>

      <button onClick={() => { setAttendanceMode("camera"); startCamera(); }} className="fixed bottom-20 lg:bottom-8 right-4 md:right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 lg:hidden"><Camera className="w-6 h-6" /></button>

      {showVerificationModal && currentFace && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div><div><h3 className="font-bold text-on-surface">Manual Verification</h3><p className="text-xs text-outline">Face {currentVerifyIndex + 1} of {uncertainFaces.length}</p></div></div>
            <div className="h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${((totalVerified + currentVerifyIndex) / uncertainFaces.length) * 100}%` }}></div></div>
            {verificationMessage && <div className={`p-3 rounded-lg text-sm font-bold text-center ${verificationMessage.startsWith("✅") ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>{verificationMessage}</div>}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5"><div className="flex items-center gap-4 mb-4"><div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center shrink-0"><UserCheck className="w-7 h-7 text-yellow-700" /></div><div><p className="text-xl font-black text-on-surface">{getStudentName(currentFace.suggested_student)}</p><p className="text-sm text-outline font-mono">{currentFace.suggested_student}</p><p className="text-xs text-yellow-700 font-bold mt-0.5">Confidence: {currentFace.confidence?.toFixed(1)}%</p></div></div>
              {currentFace.all_matches?.length > 1 && currentFace.all_matches.slice(1, 4).map((m, i) => (
                <button key={i} onClick={() => handleConfirmStudent(m.student_id)} disabled={loading} className="w-full text-left px-3 py-2.5 rounded-lg bg-white hover:bg-yellow-50 border border-yellow-100 transition-all flex justify-between items-center mb-1"><span className="text-sm font-bold">{getStudentName(m.student_id)} <span className="text-xs text-outline font-mono">({m.student_id})</span></span><span className="text-xs font-mono font-bold text-yellow-700">{m.confidence?.toFixed(1)}%</span></button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3"><button onClick={() => handleConfirmStudent(currentFace.suggested_student)} disabled={loading} className="py-3.5 bg-tertiary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"><CheckCircle className="w-4 h-4" /> Confirm</button><button onClick={handleSkipFace} disabled={loading} className="py-3.5 bg-surface-container-low text-on-surface rounded-lg font-bold text-sm flex items-center justify-center gap-2">Skip</button></div>
            <div className="bg-surface-container-low p-4 rounded-lg"><p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Enter Different Student ID</p><div className="flex gap-2"><input className="flex-1 bg-white border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono" placeholder="e.g. CSE001" value={manualId} onChange={e => setManualId(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && handleManualIdSubmit()} disabled={loading} /><button onClick={handleManualIdSubmit} disabled={!manualId.trim() || loading} className="px-5 py-3 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"><UserPlus className="w-4 h-4" /> Add</button></div></div>
            <button onClick={handleFinalizeAttendance} className="w-full py-2.5 text-sm text-outline hover:text-on-surface transition-colors font-medium">Skip remaining → Finalize</button>
          </div>
        </div>
      )}

      {showResultModal && attendanceResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowResultModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="text-center"><CheckCircle className="w-16 h-16 text-tertiary mx-auto mb-3" /><h3 className="text-xl font-black text-on-surface">Attendance Complete!</h3><p className="text-outline text-sm mt-1">{(attendanceResult.recognized || 0) + verifiedStudents.length} present</p></div>
            {verifiedStudents.length > 0 && <div className="bg-surface-container-low p-3 rounded-lg max-h-32 overflow-y-auto"><p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Manually Verified:</p>{verifiedStudents.map((s, i) => <div key={i} className="text-xs text-on-surface py-0.5">✅ {s.name} ({s.id})</div>)}</div>}
            <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-lg"><div className="text-center"><p className="text-2xl font-black text-tertiary font-mono">{(attendanceResult.recognized || 0) + verifiedStudents.length}</p><p className="text-[10px] uppercase font-bold text-outline">Present</p></div><div className="text-center"><p className="text-2xl font-black text-error font-mono">{attendanceResult.uncertain_count || 0}</p><p className="text-[10px] uppercase font-bold text-outline">Uncertain</p></div></div>
            
            {/* WhatsApp Button in Result Modal */}
            <button onClick={handleSendWhatsappAlerts} disabled={whatsappSending} className="w-full py-3 bg-tertiary text-white rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <Smartphone className="w-4 h-4" /> {whatsappSending ? "Sending..." : "Send WhatsApp Alerts to Absent Students"}
            </button>
            
            <button onClick={() => { setShowResultModal(false); setCapturedImage(null); setAttendanceResult(null); setAttendanceMode(null); setVerifiedStudents([]); }} className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all">Done</button>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}