import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, BarChart3, Settings,
  HelpCircle, LogOut, Camera, Sparkles
} from 'lucide-react';

export default function TeacherLayout({ children, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { id: "attendance", icon: CalendarCheck, label: "Attendance", path: "/teacher/attendance" },
    { id: "classes", icon: Users, label: "Classes", path: "/teacher/classes" },
    { id: "reports", icon: BarChart3, label: "Reports", path: "/teacher/reports" },
    { id: "settings", icon: Settings, label: "Settings", path: "/teacher/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-on-surface">EduVision AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-mono">Teacher Portal</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary font-bold' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-outline-variant/10 space-y-1">
          <button onClick={() => navigate('/teacher/dashboard')} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 mb-2">
            <Camera className="w-4 h-4" /> Take Attendance
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-outline hover:bg-surface-container-low"><HelpCircle className="w-4 h-4" /> Help</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/5"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around py-3">
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1 ${location.pathname === item.id ? 'text-primary' : 'text-outline'}`}>
            <item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
        {children}
      </main>
    </div>
  );
}