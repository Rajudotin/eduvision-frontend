import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Users, BarChart3, Settings,
  HelpCircle, LogOut, Sparkles, Clock, MapPin, BookOpen,
  Bell, ChevronRight, GraduationCap, Building
} from 'lucide-react';

export default function ClassesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance', path: '/student/attendance' },
    { id: 'classes', icon: Users, label: 'Classes', path: '/student/classes' },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: '/student/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/student/profile' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Sample timetable - replace with API data
  const timetable = {
    Monday: [
      { subject: 'Operating Systems', code: 'CS301', time: '09:00 - 10:30 AM', room: 'CSE-101', teacher: 'Dr. Smith', color: 'bg-primary' },
      { subject: 'Database Systems', code: 'CS302', time: '11:00 - 12:30 PM', room: 'CSE-205', teacher: 'Dr. Johnson', color: 'bg-secondary' },
      { subject: 'Computer Networks', code: 'CS303', time: '02:00 - 03:30 PM', room: 'CSE-301', teacher: 'Dr. Williams', color: 'bg-tertiary' },
    ],
    Tuesday: [
      { subject: 'Data Structures', code: 'CS201', time: '09:00 - 10:30 AM', room: 'CSE-102', teacher: 'Dr. Davis', color: 'bg-primary' },
      { subject: 'Software Engineering', code: 'CS401', time: '11:00 - 12:30 PM', room: 'CSE-304', teacher: 'Dr. Brown', color: 'bg-secondary' },
    ],
    Wednesday: [
      { subject: 'Operating Systems', code: 'CS301', time: '09:00 - 10:30 AM', room: 'CSE-101', teacher: 'Dr. Smith', color: 'bg-primary' },
      { subject: 'Computer Networks', code: 'CS303', time: '01:00 - 02:30 PM', room: 'CSE-301', teacher: 'Dr. Williams', color: 'bg-tertiary' },
      { subject: 'AI & Machine Learning', code: 'CS501', time: '03:00 - 04:30 PM', room: 'CSE-405', teacher: 'Dr. Wilson', color: 'bg-secondary' },
    ],
    Thursday: [
      { subject: 'Database Systems', code: 'CS302', time: '09:00 - 10:30 AM', room: 'CSE-205', teacher: 'Dr. Johnson', color: 'bg-secondary' },
      { subject: 'Data Structures Lab', code: 'CS201L', time: '11:00 - 01:00 PM', room: 'LAB-3', teacher: 'Dr. Davis', color: 'bg-tertiary' },
    ],
    Friday: [
      { subject: 'Software Engineering', code: 'CS401', time: '10:00 - 11:30 AM', room: 'CSE-304', teacher: 'Dr. Brown', color: 'bg-secondary' },
      { subject: 'AI & Machine Learning', code: 'CS501', time: '02:00 - 03:30 PM', room: 'CSE-405', teacher: 'Dr. Wilson', color: 'bg-secondary' },
    ],
    Saturday: [
      { subject: 'Computer Networks Lab', code: 'CS303L', time: '09:00 - 11:00 AM', room: 'LAB-2', teacher: 'Dr. Williams', color: 'bg-tertiary' },
    ],
  };

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
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Class Schedule</h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Your weekly timetable for this semester
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

          {/* Today's Highlight */}
          <div className="bg-primary text-white p-6 md:p-8 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
            <GraduationCap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Today • {today}</p>
              <h3 className="text-2xl md:text-3xl font-black mt-2">
                {timetable[today]?.length || 0} Classes Scheduled
              </h3>
              <p className="text-sm opacity-80 mt-1">
                {timetable[today]?.length ? `${timetable[today][0].subject} at ${timetable[today][0].time}` : 'No classes today'}
              </p>
            </div>
          </div>

          {/* Weekly Timetable */}
          <div className="space-y-6">
            {days.map(day => {
              const classes = timetable[day] || [];
              const isToday = day === today;

              return (
                <div key={day} className={`bg-white rounded-xl shadow-sm border transition-all ${isToday ? 'border-primary/30 ring-1 ring-primary/10' : 'border-outline-variant/10'}`}>
                  {/* Day Header */}
                  <div className={`px-6 py-4 rounded-t-xl flex items-center justify-between ${isToday ? 'bg-primary/5 border-b border-primary/10' : 'bg-surface-container-low border-b border-outline-variant/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isToday ? 'bg-primary text-white' : 'bg-white text-outline'}`}>
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-on-surface'}`}>
                          {day}
                        </h3>
                        <p className="text-xs text-outline font-mono">
                          {classes.length} class{classes.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                    </div>
                    {isToday && (
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Today</span>
                    )}
                  </div>

                  {/* Class Cards */}
                  <div className="p-4 space-y-3">
                    {classes.length > 0 ? (
                      classes.map((cls, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all group cursor-pointer">
                          {/* Color indicator */}
                          <div className={`w-1.5 h-14 rounded-full ${cls.color} shrink-0`}></div>
                          
                          {/* Subject info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="w-4 h-4 text-outline shrink-0" />
                              <h4 className="text-sm font-bold text-on-surface truncate">{cls.subject}</h4>
                              <span className="text-[10px] font-mono text-outline bg-white px-2 py-0.5 rounded shrink-0">{cls.code}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-outline">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {cls.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {cls.room}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {cls.teacher}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors shrink-0" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <BookOpen className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                        <p className="text-sm text-outline">No classes scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-outline text-sm">Loading class schedule...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}