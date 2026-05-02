import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Users, BarChart3, Settings,
  HelpCircle, LogOut, Sparkles, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Bell
} from 'lucide-react';
import { getStudentAttendance, getStudentSummary } from '../services/api';

export default function AttendancePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    loadData(parsed.student_id);
  }, []);

  const loadData = async (sid) => {
    setLoading(true);
    try {
      const [attRes, summaryRes] = await Promise.all([
        getStudentAttendance(sid),
        getStudentSummary(sid)
      ]);
      setAttendanceRecords(attRes.data?.records || []);
      setStats(summaryRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance', path: '/student/attendance' },
    { id: 'classes', icon: Users, label: 'Classes', path: '/student/classes' },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: '/student/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/student/profile' },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  const monthRecords = attendanceRecords.filter(r => {
    if (!r.date) return false;
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Get status for a specific day
  const getDayStatus = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = monthRecords.find(r => (r.date?.split('T')[0]) === dateStr);
    return record ? record.status : null;
  };

  // Get record details for a day
  const getDayRecord = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthRecords.find(r => (r.date?.split('T')[0]) === dateStr);
  };

  const isToday = (day) => today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  const presentCount = monthRecords.filter(r => r.status === 'present').length;
  const absentCount = monthRecords.filter(r => r.status === 'absent').length;
  const percentage = stats?.attendance_percentage || 0;
  const statusColor = percentage >= 75 ? 'text-tertiary' : percentage >= 60 ? 'text-yellow-500' : 'text-error';

  // Get colors for each status
  const getDayColors = (status) => {
    if (status === 'present') return {
      bg: 'bg-tertiary',
      hover: 'hover:bg-tertiary/80',
      text: 'text-white',
      icon: 'text-white',
      ring: 'ring-tertiary/20'
    };
    if (status === 'absent') return {
      bg: 'bg-error',
      hover: 'hover:bg-error/80',
      text: 'text-white',
      icon: 'text-white',
      ring: 'ring-error/20'
    };
    if (status === 'late') return {
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-500/80',
      text: 'text-white',
      icon: 'text-white',
      ring: 'ring-yellow-500/20'
    };
    return {
      bg: 'bg-surface-container-low',
      hover: 'hover:bg-surface-container-high',
      text: 'text-on-surface-variant',
      icon: 'text-outline-variant',
      ring: 'ring-outline-variant/10'
    };
  };

  const selectedRecord = selectedDay ? getDayRecord(selectedDay) : null;

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
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Attendance Calendar</h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Your attendance is <span className={`font-bold ${statusColor}`}>{percentage}%</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${percentage >= 75 ? 'bg-tertiary/10 text-tertiary' : percentage >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-error/10 text-error'}`}>
                  {percentage >= 75 ? 'GOOD' : percentage >= 60 ? 'WARNING' : 'CRITICAL'}
                </span>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden hover:scale-[1.02] transition-transform">
              <CheckCircle className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Present</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2">{presentCount}</p>
              <p className="text-xs opacity-70 mt-1">this month</p>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-on-surface">{absentCount}</p>
              <p className="text-xs text-on-surface-variant mt-1">this month</p>
            </div>
            <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-transform">
              <svg className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Days</p>
              <p className="text-3xl md:text-4xl font-black font-mono mt-2">{daysInMonth}</p>
              <p className="text-xs opacity-70 mt-1">in {months[currentMonth].slice(0, 3)}</p>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Month %</p>
              <p className={`text-3xl md:text-4xl font-black font-mono mt-2 ${months[currentMonth] === today.getMonth() && currentYear === today.getFullYear() ? statusColor : 'text-on-surface'}`}>
                {Math.round((presentCount / Math.max(daysInMonth, 1)) * 100)}%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">attendance rate</p>
            </div>
          </div>

          {/* Calendar + Details Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Card - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
              {/* Month Navigator */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => { 
                    setSelectedDay(null);
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } 
                    else setCurrentMonth(m => m - 1); 
                  }}
                  className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-outline" />
                </button>
                <h3 className="text-lg font-bold text-on-surface font-headline">{months[currentMonth]} {currentYear}</h3>
                <button 
                  onClick={() => { 
                    setSelectedDay(null);
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } 
                    else setCurrentMonth(m => m + 1); 
                  }}
                  className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-outline" />
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-outline uppercase tracking-wider py-2">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e-${i}`} className="aspect-square rounded-lg" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const colors = getDayColors(status);
                  const todayClass = isToday(day);
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium
                        transition-all duration-200 cursor-pointer relative
                        ${colors.bg} ${colors.text}
                        ${!status ? `${colors.hover}` : 'hover:brightness-110'}
                        ${todayClass ? 'ring-2 ring-primary ring-offset-2 ring-offset-white z-10' : ''}
                        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-white scale-110 z-10 shadow-lg ' + colors.ring : ''}
                        ${status ? 'shadow-sm' : ''}
                      `}
                      title={`${months[currentMonth]} ${day}${status ? ` - ${status.charAt(0).toUpperCase() + status.slice(1)}` : ''}`}
                    >
                      <span className={`text-sm ${status ? 'font-bold' : ''}`}>{day}</span>
                      {status === 'present' && <CheckCircle className="w-3 h-3 mt-0.5" />}
                      {status === 'absent' && <XCircle className="w-3 h-3 mt-0.5" />}
                      {status === 'late' && (
                        <svg className="w-3 h-3 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                      )}
                      
                      {/* Today indicator dot */}
                      {todayClass && !status && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 text-xs text-outline font-medium">
                  <div className="w-3 h-3 rounded bg-tertiary"></div> Present
                </div>
                <div className="flex items-center gap-2 text-xs text-outline font-medium">
                  <div className="w-3 h-3 rounded bg-error"></div> Absent
                </div>
                <div className="flex items-center gap-2 text-xs text-outline font-medium">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div> Late
                </div>
                <div className="flex items-center gap-2 text-xs text-outline font-medium">
                  <div className="w-3 h-3 rounded bg-surface-container-low border border-outline-variant/20"></div> No Class
                </div>
              </div>
            </div>

            {/* Day Detail Panel */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
              {selectedRecord ? (
                <>
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">
                    {months[currentMonth]} {selectedDay}, {currentYear}
                  </h3>
                  
                  <div className={`p-5 rounded-xl mb-4 ${selectedRecord.status === 'present' ? 'bg-tertiary/5 border border-tertiary/10' : selectedRecord.status === 'absent' ? 'bg-error/5 border border-error/10' : 'bg-yellow-50 border border-yellow-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {selectedRecord.status === 'present' ? (
                        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-tertiary" />
                        </div>
                      ) : selectedRecord.status === 'absent' ? (
                        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-error" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className={`text-lg font-black capitalize ${selectedRecord.status === 'present' ? 'text-tertiary' : selectedRecord.status === 'absent' ? 'text-error' : 'text-yellow-600'}`}>
                          {selectedRecord.status}
                        </p>
                        <p className="text-xs text-outline font-mono">{selectedRecord.time || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {selectedRecord.confidence_score && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/10">
                        <p className="text-xs text-outline uppercase tracking-wider">Confidence</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${selectedRecord.confidence_score >= 80 ? 'bg-tertiary' : selectedRecord.confidence_score >= 50 ? 'bg-yellow-500' : 'bg-error'}`}
                              style={{ width: `${selectedRecord.confidence_score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold font-mono">{selectedRecord.confidence_score}%</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedRecord.marked_by && (
                      <p className="text-xs text-outline mt-3">
                        Marked by: <span className="font-bold capitalize">{selectedRecord.marked_by}</span>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <CalendarCheck className="w-16 h-16 text-outline-variant mb-4" />
                  <h3 className="text-lg font-bold text-on-surface mb-2">Day Details</h3>
                  <p className="text-sm text-outline">
                    {selectedDay 
                      ? `No attendance record for ${months[currentMonth]} ${selectedDay}` 
                      : 'Select a day from the calendar to view details'}
                  </p>
                </div>
              )}

              {/* Quick Stats for Selected Day */}
              <div className="mt-auto pt-4 border-t border-outline-variant/10">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <p className="text-lg font-black text-on-surface font-mono">{presentCount}</p>
                    <p className="text-[10px] uppercase font-bold text-outline">Present</p>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <p className="text-lg font-black text-on-surface font-mono">{absentCount}</p>
                    <p className="text-[10px] uppercase font-bold text-outline">Absent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-outline text-sm">Loading attendance data...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}