import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarCheck, BarChart3, Settings,
  HelpCircle, LogOut, Sparkles, Download, FileText, FileSpreadsheet,
  TrendingUp, TrendingDown, Calendar, Filter, Search, Bell,
  Award, ChevronDown, CheckCircle, Printer, Mail
} from "lucide-react";
import { getStudentSummary } from "../services/api";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState("this-month");
  const [studentId, setStudentId] = useState("");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { navigate("/login"); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    if (parsed.role === "student") {
      setStudentId(parsed.student_id);
      loadReport(parsed.student_id);
    }
  }, []);

  const loadReport = async (sid) => {
    setLoading(true);
    try {
      const res = await getStudentSummary(sid || studentId);
      setReportData(res.data);
    } catch (err) { console.error("Failed to load report:", err); }
    finally { setLoading(false); }
  };

  const handleDownloadPDF = () => {
    const sid = studentId || user?.student_id;
    if (sid) window.open(`/api/reports/pdf/${sid}`, "_blank");
  };

  const handleDownloadExcel = () => {
    const sid = studentId || user?.student_id;
    if (sid) window.open(`/api/reports/excel/${sid}`, "_blank");
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: `/${user?.role || 'student'}/dashboard` },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance', path: `/${user?.role || 'student'}/attendance` },
    { id: 'classes', icon: Users, label: 'Classes', path: `/${user?.role || 'student'}/classes` },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: `/${user?.role || 'student'}/reports` },
    { id: 'settings', icon: Settings, label: 'Settings', path: `/${user?.role || 'student'}/profile` },
  ];

  const percentage = reportData?.attendance_percentage || 0;
  const statusColor = percentage >= 75 ? "text-tertiary" : percentage >= 60 ? "text-yellow-500" : "text-error";
  const statusBg = percentage >= 75 ? "bg-tertiary/10" : percentage >= 60 ? "bg-yellow-50" : "bg-error/10";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - EXACT match with StudentDashboard */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-on-surface">EduVision AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-mono">{user?.role || 'Student'} Portal</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); navigate(item.path); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-outline-variant/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-outline hover:bg-surface-container-low"><HelpCircle className="w-4 h-4" /> Help</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/5"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/10 z-50 flex justify-around py-3">
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); navigate(item.path); }}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-primary' : 'text-outline'}`}>
            <item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Reports & Analytics</h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Attendance insights & downloadable reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <button className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <Bell className="w-5 h-5 text-outline" />
              </button>
            </div>
          </header>

          {/* Controls */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                {["summary", "monthly"].map(type => (
                  <button key={type} onClick={() => setReportType(type)}
                    className={`px-4 py-2 text-xs font-bold rounded-md capitalize transition-all ${reportType === type ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}>
                    {type}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                  className="bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-8 text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="semester">This Semester</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-outline pointer-events-none" />
              </div>
              {user?.role !== "student" && (
                <>
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                    <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Student ID..." value={studentId} onChange={e => setStudentId(e.target.value)} />
                  </div>
                  <button onClick={() => loadReport()} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Load
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-outline text-sm">Loading report data...</p>
            </div>
          ) : reportData ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
                  <CheckCircle className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Days</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2">{reportData.total_days || 0}</p>
                  <p className="text-xs opacity-70 mt-1">recorded</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Present</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-tertiary">{reportData.present_days || 0}</p>
                  <p className="text-xs text-on-surface-variant mt-1">days</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-error">{reportData.absent_days || 0}</p>
                  <p className="text-xs text-on-surface-variant mt-1">days</p>
                </div>
                <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden">
                  <Award className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Percentage</p>
                  <p className={`text-3xl md:text-4xl font-black font-mono mt-2`}>{percentage}%</p>
                  <p className="text-xs opacity-70 mt-1">attendance</p>
                </div>
              </div>

              {/* Gauge + Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-6">Attendance Health</h3>
                  <div className="relative w-40 h-40 md:w-48 md:h-48">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="none" stroke="#e7eeff" strokeWidth="12" />
                      <circle cx="96" cy="96" r="88" fill="none" stroke={percentage >= 75 ? '#006242' : percentage >= 60 ? '#eab308' : '#ba1a1a'} strokeWidth="12" strokeDasharray="552.92" strokeDashoffset={552.92 - (552.92 * percentage / 100)} className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl md:text-5xl font-black font-mono">{Math.round(percentage)}%</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${statusColor}`}>{percentage >= 75 ? 'Optimal' : percentage >= 60 ? 'Warning' : 'Critical'}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Status Details</h3>
                  <div className={`p-4 rounded-lg ${statusBg} mb-4`}>
                    <p className="text-sm font-bold">Overall</p>
                    <p className={`text-lg font-black ${statusColor}`}>{reportData.status || (percentage >= 75 ? 'Good Standing' : 'Below Required')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-surface-container-low rounded-lg">
                      <p className="text-xs text-outline uppercase tracking-wider">Last</p>
                      <p className="text-sm font-bold font-mono mt-1">{reportData.last_attendance || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-lg">
                      <p className="text-xs text-outline uppercase tracking-wider">First</p>
                      <p className="text-sm font-bold font-mono mt-1">{reportData.first_attendance || 'N/A'}</p>
                    </div>
                  </div>
                  {reportData.days_needed_for_75 > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-bold text-yellow-700">⚠️ Need <span className="text-lg">{reportData.days_needed_for_75}</span> more days to reach 75%</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3 space-y-4">
                  <button onClick={handleDownloadPDF} className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-error/30 transition-all flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center"><FileText className="w-5 h-5 text-error" /></div>
                    <div className="text-left"><p className="text-sm font-bold">PDF Report</p><p className="text-xs text-outline">Download</p></div>
                    <Download className="w-4 h-4 text-outline ml-auto" />
                  </button>
                  <button onClick={handleDownloadExcel} className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-all flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center"><FileSpreadsheet className="w-5 h-5 text-tertiary" /></div>
                    <div className="text-left"><p className="text-sm font-bold">Excel Report</p><p className="text-xs text-outline">Download</p></div>
                    <Download className="w-4 h-4 text-outline ml-auto" />
                  </button>
                  <button className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"><Printer className="w-5 h-5 text-secondary" /></div>
                    <div className="text-left"><p className="text-sm font-bold">Print</p><p className="text-xs text-outline">Physical copy</p></div>
                    <Mail className="w-4 h-4 text-outline ml-auto" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
              <BarChart3 className="w-16 h-16 text-outline-variant mx-auto mb-4" />
              <h3 className="text-lg font-bold text-on-surface mb-2">No Report Loaded</h3>
              <p className="text-sm text-outline">{user?.role === "student" ? "Loading your attendance report..." : 'Enter a Student ID and click "Load" to view analytics.'}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}