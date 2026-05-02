import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, BarChart3, Settings, 
  HelpCircle, LogOut, CheckCircle, XCircle, TrendingUp, 
  Clock, MessageCircle, Smartphone, Award, QrCode,
  Bell, Sparkles, ChevronRight, Camera, Upload
} from 'lucide-react';
import { getStudentSummary, getTodayAttendance } from '../services/api';

// Get total working days from admin settings
const getTotalWorkingDays = () => {
  return parseInt(localStorage.getItem('totalWorkingDays')) || 180;
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [whatsappReason, setWhatsappReason] = useState('');
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'student') { 
      navigate(`/${parsed.role}/dashboard`); 
      return; 
    }
    setUser(parsed);
    loadData(parsed.student_id);
  }, []);

  const loadData = async (studentId) => {
    try {
      const [summaryRes, todayRes] = await Promise.all([
        getStudentSummary(studentId),
        getTodayAttendance()
      ]);
      
      const data = summaryRes.data;
      const totalWorking = getTotalWorkingDays();
      const presentDays = data.present_days || 0;
      
      // Calculate percentage based on admin's working days
      const calculatedPercentage = totalWorking > 0 
        ? Math.round((presentDays / totalWorking) * 100)
        : 0;
      
      // Days needed to reach 75%
      const requiredFor75 = Math.ceil(totalWorking * 0.75);
      const daysNeededCalc = Math.max(0, requiredFor75 - presentDays);
      
      setStats({
        ...data,
        total_working_days: totalWorking,
        attendance_percentage: calculatedPercentage,
        days_needed_for_75: daysNeededCalc,
        required_for_75: requiredFor75
      });
      
      setToday(todayRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'reports': navigate('/student/reports'); break;
      case 'attendance': navigate('/student/attendance'); break;
      case 'classes': navigate('/student/classes'); break;
      case 'settings': navigate('/student/profile'); break;
      default: break;
    }
  };

  const sendWhatsappReason = () => {
    const phone = user?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`REASON: ${whatsappReason}`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    setShowWhatsappModal(false);
    setWhatsappReason('');
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance' },
    { id: 'classes', icon: Users, label: 'Classes' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const percentage = stats?.attendance_percentage || 0;
  const statusColor = percentage >= 75 ? 'text-tertiary' : percentage >= 60 ? 'text-yellow-500' : 'text-error';
  const statusBg = percentage >= 75 ? 'bg-tertiary/10' : percentage >= 60 ? 'bg-yellow-50' : 'bg-error/10';
  const statusText = percentage >= 75 ? 'Good Standing' : percentage >= 60 ? 'Needs Improvement' : 'Critical';
  const gaugeOffset = 552.92 - (552.92 * percentage / 100);
  const todayPresent = today?.records?.some(r => r.student_id === user?.student_id);
  const recentActivity = today?.records?.filter(r => r.student_id === user?.student_id) || [];
  const daysNeeded = stats?.days_needed_for_75 || 0;

  // Dummy upcoming classes for demo
  const upcomingClasses = [
    { subject: 'Operating Systems', time: '10:30 AM', room: 'CSE-101', teacher: 'Dr. Smith' },
    { subject: 'Database Systems', time: '12:00 PM', room: 'CSE-205', teacher: 'Dr. Johnson' },
    { subject: 'Computer Networks', time: '2:00 PM', room: 'CSE-301', teacher: 'Dr. Williams' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-on-surface">EduVision AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-mono">Student Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-outline hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === 'reports' && daysNeeded > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-error"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-outline-variant/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-outline hover:bg-surface-container-low transition-all">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/5 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/10 z-50 flex justify-around py-3">
        {navItems.slice(0, 4).map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-primary' : 'text-outline'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Hello, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Your attendance is <span className={`font-bold ${statusColor}`}>{percentage}%</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBg} ${statusColor}`}>
                  {statusText}
                </span>
                <span className="ml-2 text-xs text-outline">
                  📅 {stats?.total_working_days || 180} working days | {stats?.present_days || 0}/{stats?.required_for_75 || 135} for 75%
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <button className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <Bell className="w-5 h-5 text-outline" />
                {todayPresent && <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full"></span>}
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden hover:scale-[1.02] transition-transform">
              <CheckCircle className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Present Days</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2">{stats?.present_days || 0}</p>
              <p className="text-xs opacity-70 mt-1">of {stats?.total_working_days || 180} working days</p>
            </div>
            
            <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent Days</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-on-surface">{stats?.absent_days || 0}</p>
              <p className="text-xs text-on-surface-variant mt-1">days absent</p>
            </div>
            
            <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-transform">
              <TrendingUp className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">75% Target</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2">{stats?.required_for_75 || 135}</p>
              <p className="text-xs opacity-70 mt-1">days required</p>
            </div>
            
            <div className={`bg-white p-5 md:p-6 rounded-xl border hover:shadow-md transition-shadow ${daysNeeded > 0 ? 'border-yellow-300' : 'border-outline-variant/10'}`}>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Days to 75%</p>
              <p className={`text-3xl md:text-4xl font-black font-mono mt-2 ${daysNeeded > 0 ? 'text-yellow-500' : 'text-tertiary'}`}>
                {daysNeeded}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {daysNeeded > 0 ? `need ${daysNeeded} more` : 'requirement met ✅'}
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gauge */}
            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
              <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-6">Attendance Health</h3>
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#e7eeff" strokeWidth="12" />
                  <circle cx="96" cy="96" r="88" fill="none" 
                    stroke={percentage >= 75 ? '#006242' : percentage >= 60 ? '#eab308' : '#ba1a1a'} 
                    strokeWidth="12" strokeDasharray="552.92" strokeDashoffset={gaugeOffset} 
                    className="transition-all duration-1000" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black font-mono">{Math.round(percentage)}%</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${statusColor}`}>
                    {percentage >= 75 ? 'Optimal' : percentage >= 60 ? 'Warning' : 'Critical'}
                  </span>
                </div>
              </div>
              {daysNeeded > 0 ? (
                <p className="mt-6 text-sm text-yellow-600 font-medium">
                  ⚠️ Attend <span className="font-bold">{daysNeeded}</span> more classes to reach 75% ({stats?.required_for_75 || 135} required out of {stats?.total_working_days || 180} working days)
                </p>
              ) : (
                <p className="mt-6 text-sm text-tertiary font-medium">
                  🎉 Great job! You've met the 75% requirement ({stats?.required_for_75 || 135} days out of {stats?.total_working_days || 180})
                </p>
              )}
            </div>

            {/* Today + Upcoming */}
            <div className="lg:col-span-5 space-y-6">
              {/* Today's Status */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" /> Today's Status
                </h3>
                
                {todayPresent ? (
                  recentActivity.map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-tertiary/5 border border-tertiary/10 rounded-lg mb-2">
                      <CheckCircle className="w-5 h-5 text-tertiary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">Present — {rec.time}</p>
                        <p className="text-xs text-on-surface-variant font-mono">Confidence: {rec.confidence_score || 'N/A'}%</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <XCircle className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant mb-3">Not marked today</p>
                    <button 
                      onClick={() => setShowWhatsappModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-white rounded-lg text-sm font-bold hover:brightness-110 transition-all"
                    >
                      <Smartphone className="w-4 h-4" /> Send Reason via WhatsApp
                    </button>
                  </div>
                )}
              </div>

              {/* Upcoming Classes */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" /> Upcoming Classes
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((cls, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                      <div>
                        <p className="text-sm font-bold text-on-surface">{cls.subject}</p>
                        <p className="text-xs text-outline">{cls.teacher} • {cls.room}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary">{cls.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 space-y-4">
              <button 
                onClick={() => setShowWhatsappModal(true)}
                className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors shrink-0">
                  <MessageCircle className="w-5 h-5 text-tertiary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">WhatsApp Reason</p>
                  <p className="text-xs text-outline">Send absence reason</p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline-variant ml-auto" />
              </button>

              <button 
                onClick={() => navigate('/student/reports')}
                className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">View Reports</p>
                  <p className="text-xs text-outline">PDF & Excel download</p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline-variant ml-auto" />
              </button>

              <button className="w-full bg-white p-4 rounded-xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
                  <Camera className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">Scan to Attend</p>
                  <p className="text-xs text-outline">QR / Face scan</p>
                </div>
                <ChevronRight className="w-4 h-4 text-outline-variant ml-auto" />
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-surface-container-low">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((rec, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center z-10 shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Marked Present</p>
                    <p className="font-mono text-[10px] text-on-surface-variant uppercase mt-1">{rec.date} at {rec.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-outline-variant text-center py-4">No recent activity. Attend classes to see your timeline.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Reason Modal */}
      {showWhatsappModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowWhatsappModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Send Absence Reason</h3>
                <p className="text-xs text-outline">Via WhatsApp</p>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-outline uppercase tracking-wider">Reason for absence</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Fever', 'Family Emergency', 'Transport Issue', 'Medical Appointment', 'Other'].map(reason => (
                  <button
                    key={reason}
                    onClick={() => setWhatsappReason(reason)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      whatsappReason === reason 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full mt-3 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                rows="2"
                placeholder="Additional details (optional)..."
                value={whatsappReason}
                onChange={e => setWhatsappReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setShowWhatsappModal(false); setWhatsappReason(''); }}
                className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-low transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={sendWhatsappReason}
                disabled={!whatsappReason}
                className="flex-1 py-3 rounded-lg bg-tertiary text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button className="fixed bottom-20 lg:bottom-8 right-4 md:right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40">
        <QrCode className="w-6 h-6" />
      </button>
    </div>
  );
}