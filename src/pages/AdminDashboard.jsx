import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Database, Settings,
  HelpCircle, LogOut, Sparkles, Search, Bell,
  UserPlus, Edit, Trash2, CheckCircle, XCircle,
  School, TrendingUp, TrendingDown, Calendar, Plus, Save, Shield,
  BarChart3, PieChart, Activity, Cpu, HardDrive, Wifi, Clock,
  AlertTriangle, Award, Download, Filter, RefreshCw, Zap
} from 'lucide-react';
import { getUsers, getTodayAttendance } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('student');

  // Academic Calendar
  const [totalWorkingDays, setTotalWorkingDays] = useState(() => parseInt(localStorage.getItem('totalWorkingDays')) || 180);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarInput, setCalendarInput] = useState(totalWorkingDays);

  // Add User
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ student_id: '', full_name: '', email: '', phone: '', password: '', role: 'student', department: '', year_of_study: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') { navigate('/student/dashboard'); return; }
    setUser(parsed);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, adminsRes, todayRes] = await Promise.all([getUsers('student'), getUsers('teacher'), getUsers('admin'), getTodayAttendance()]);
      setUsers(studentsRes.data?.users || []);
      setTeachers(teachersRes.data?.users || []);
      setAdmins(adminsRes.data?.users || []);
      setTodayData(todayRes.data);
    } catch (err) { console.error('Load failed:', err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const handleAddUser = async () => {
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newUser, phone: newUser.phone ? `+91${newUser.phone}` : '+919999999999' }) });
      if (res.ok) { setShowAddUserModal(false); setNewUser({ student_id: '', full_name: '', email: '', phone: '', password: '', role: 'student', department: '', year_of_study: '' }); loadAllData(); }
    } catch (err) { console.error('Add failed:', err); }
  };

  const handleDeleteUser = async (studentId) => {
    if (!confirm(`Delete user ${studentId}?`)) return;
    try {
      await fetch(`/api/auth/users`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: studentId }) });
      loadAllData();
    } catch { setUsers(prev => prev.filter(u => u.student_id !== studentId)); }
  };

  const handleSaveCalendar = () => { setTotalWorkingDays(calendarInput); localStorage.setItem('totalWorkingDays', calendarInput); setShowCalendarModal(false); };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'attendance', icon: BookOpen, label: 'Attendance' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const filteredUsers = userFilter === 'student' ? users : userFilter === 'teacher' ? teachers : admins;
  const searchedUsers = filteredUsers.filter(u => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.student_id?.toLowerCase().includes(searchTerm.toLowerCase()));

  const presentToday = todayData?.records?.length || 0;
  const totalStudents = users.length;
  const absentToday = totalStudents - presentToday;
  const todayRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
  const daysCompleted = 45;
  const totalDays = totalWorkingDays;
  const overallRate = 82;

  // Chart Data
  const attendanceTrendData = [
    { name: 'Mon', present: 142, absent: 8 }, { name: 'Tue', present: 138, absent: 12 },
    { name: 'Wed', present: 145, absent: 5 }, { name: 'Thu', present: 140, absent: 10 },
    { name: 'Fri', present: 135, absent: 15 }, { name: 'Sat', present: 120, absent: 5 },
  ];

  const roleDistribution = [
    { name: 'Students', value: users.length, color: '#2563eb' },
    { name: 'Teachers', value: teachers.length, color: '#712ae2' },
    { name: 'Admins', value: admins.length, color: '#006242' },
  ];

  const departmentData = [
    { name: 'CSE', students: 85, attendance: 88 }, { name: 'ECE', students: 62, attendance: 82 },
    { name: 'ME', students: 45, attendance: 78 }, { name: 'CE', students: 38, attendance: 85 },
    { name: 'AIML', students: 55, attendance: 92 },
  ];

  const COLORS = ['#2563eb', '#712ae2', '#006242', '#eab308', '#ef4444'];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-lg font-black tracking-tighter text-on-surface">EduVision AI</h1><p className="text-[10px] uppercase tracking-widest text-outline font-mono">Admin Console</p></div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-outline hover:bg-surface-container-low hover:text-on-surface'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-outline-variant/10 space-y-1">
          <button onClick={() => setShowAddUserModal(true)} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 mb-2"><UserPlus className="w-4 h-4" /> Add User</button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-outline"><HelpCircle className="w-4 h-4" /> Help</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/5"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around py-3">
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-primary' : 'text-outline'}`}><item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span></button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {activeTab === 'dashboard' ? 'Admin Command Center' : activeTab === 'users' ? 'User Management' : activeTab === 'attendance' ? 'Attendance Overview' : activeTab === 'analytics' ? 'Advanced Analytics' : activeTab === 'calendar' ? 'Academic Calendar' : 'Settings'}
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                {activeTab === 'dashboard' ? `${totalStudents} students • ${teachers.length} teachers • System OPTIMAL` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={loadAllData} className="p-2 rounded-lg hover:bg-surface-container-low transition-colors" title="Refresh"><RefreshCw className="w-5 h-5 text-outline" /></button>
              <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <button className="relative p-2 rounded-lg hover:bg-surface-container-low"><Bell className="w-5 h-5 text-outline" /></button>
            </div>
          </header>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden hover:scale-[1.02] transition-transform">
                  <School className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Students</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2">{users.length}</p>
                  <p className="text-xs opacity-70 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Present Today</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-tertiary">{presentToday}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{todayRate}% of total</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent Today</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-error">{absentToday}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{(100 - todayRate)}% of total</p>
                </div>
                <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-transform">
                  <Activity className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">System Health</p>
                  <p className="text-3xl md:text-4xl font-black font-mono mt-2">98%</p>
                  <p className="text-xs opacity-70 mt-1 flex items-center gap-1"><Zap className="w-3 h-3" /> OPTIMAL</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Weekly Attendance Trend</h3>
                    <Filter className="w-4 h-4 text-outline" />
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={attendanceTrendData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#737686' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#737686' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="present" fill="#006242" radius={[6, 6, 0, 0]} name="Present" />
                      <Bar dataKey="absent" fill="#ba1a1a" radius={[6, 6, 0, 0]} name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Role Distribution Pie */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">User Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                        {roleDistribution.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {roleDistribution.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>{r.name} ({r.value})</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Analytics + Face DB */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Department-wise Attendance</h3>
                  <div className="space-y-4">
                    {departmentData.map((dept, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium">{dept.name}</span><span className="font-bold">{dept.attendance}%</span></div>
                        <div className="h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${dept.attendance}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Face Database</h3>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3"><Database className="w-8 h-8 text-primary" /><div><p className="text-sm font-bold">Registered Faces</p><p className="text-xs text-outline">{users.length} students</p></div></div>
                    <CheckCircle className="w-5 h-5 text-tertiary" />
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg space-y-3">
                    <div><div className="flex justify-between text-xs mb-1"><span>Quality Score</span><span className="font-bold text-tertiary">98.4%</span></div><div className="h-2 bg-outline-variant/20 rounded-full overflow-hidden"><div className="h-full bg-tertiary w-[98%] rounded-full"></div></div></div>
                    <div><div className="flex justify-between text-xs mb-1"><span>Storage</span><span className="font-bold">14.2 / 50 GB</span></div><div className="h-2 bg-outline-variant/20 rounded-full overflow-hidden"><div className="h-full bg-secondary w-[28%] rounded-full"></div></div></div>
                  </div>
                  <button className="w-full py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5">Manage Records</button>
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <>
              <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" /><input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="flex bg-surface-container-low rounded-lg p-1">
                  {['student','teacher','admin'].map(r => <button key={r} onClick={() => setUserFilter(r)} className={`px-4 py-2 text-xs font-bold rounded-md capitalize ${userFilter===r?'bg-white text-primary shadow-sm':'text-outline'}`}>{r}s</button>)}
                </div>
                <button onClick={() => setShowAddUserModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left"><thead><tr className="bg-surface-container-low text-[10px] font-mono text-outline uppercase tracking-widest"><th className="px-6 py-4">Profile</th><th className="px-6 py-4">ID</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Actions</th></tr></thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {searchedUsers.slice(0,20).map((u,i) => (
                        <tr key={i} className="hover:bg-surface-container-low"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div><p className="font-bold text-sm">{u.full_name}</p></div></td><td className="px-6 py-4 font-mono text-xs">{u.student_id}</td><td className="px-6 py-4 text-xs text-outline">{u.email}</td><td className="px-6 py-4 text-xs text-outline">{u.phone}</td><td className="px-6 py-4"><div className="flex gap-1"><button className="p-2 hover:bg-surface-container-low rounded-lg"><Edit className="w-4 h-4 text-outline" /></button><button onClick={()=>handleDeleteUser(u.student_id)} className="p-2 hover:bg-error/10 rounded-lg"><Trash2 className="w-4 h-4 text-error" /></button></div></td></tr>
                      ))}
                    </tbody></table>
                </div>
              </div>
            </>
          )}

          {/* ATTENDANCE */}
          {activeTab === 'attendance' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary text-white p-5 rounded-xl shadow-lg shadow-primary/20"><p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total</p><p className="text-3xl font-black font-mono mt-2">{totalStudents}</p></div>
                <div className="bg-white p-5 rounded-xl border"><p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Present</p><p className="text-3xl font-black font-mono mt-2 text-tertiary">{presentToday}</p></div>
                <div className="bg-white p-5 rounded-xl border"><p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent</p><p className="text-3xl font-black font-mono mt-2 text-error">{absentToday}</p></div>
                <div className="bg-secondary text-white p-5 rounded-xl"><p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Rate</p><p className="text-3xl font-black font-mono mt-2">{todayRate}%</p></div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-surface-container-low text-[10px] font-mono text-outline uppercase tracking-widest"><th className="px-6 py-4">Student</th><th className="px-6 py-4">ID</th><th className="px-6 py-4">Time</th><th className="px-6 py-4">Status</th></tr></thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {users.map((s,i) => { const record = todayData?.records?.find(r=>r.student_id===s.student_id); return <tr key={i} className="hover:bg-surface-container-low"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div><p className="font-bold text-sm">{s.full_name}</p></div></td><td className="px-6 py-4 font-mono text-xs">{s.student_id}</td><td className="px-6 py-4 text-xs font-mono">{record?.time||'—'}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${record?'bg-tertiary/10 text-tertiary':'bg-error/10 text-error'}`}>{record?'Present':'Absent'}</span></td></tr>; })}
                  </tbody></table></div>
              </div>
            </>
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Monthly Attendance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}><BarChart data={attendanceTrendData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" tick={{fontSize:12,fill:'#737686'}} /><YAxis tick={{fontSize:12,fill:'#737686'}} /><Tooltip /><Bar dataKey="present" fill="#006242" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Department Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}><RePieChart><Pie data={departmentData} cx="50%" cy="50%" outerRadius={100} dataKey="students" nameKey="name" label={({name,students})=>`${name}: ${students}`}><Cell fill="#2563eb"/><Cell fill="#712ae2"/><Cell fill="#006242"/><Cell fill="#eab308"/><Cell fill="#ef4444"/></Pie><Tooltip /></RePieChart></ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Department-wise Attendance Rate</h3>
                {departmentData.map((dept,i) => (
                  <div key={i} className="mb-3"><div className="flex justify-between text-sm mb-1"><span>{dept.name}</span><span className="font-bold">{dept.attendance}%</span></div><div className="h-3 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${dept.attendance}%`,backgroundColor:COLORS[i]}}></div></div></div>
                ))}
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border space-y-6">
              <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Academic Calendar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-surface-container-low rounded-xl text-center"><p className="text-sm text-outline mb-2">Total Working Days</p><p className="text-6xl font-black text-primary font-mono">{totalWorkingDays}</p></div>
                <div className="space-y-4">
                  <input type="number" className="w-full bg-surface-container-low border-none rounded-lg p-3 text-lg font-bold" value={calendarInput} onChange={e=>setCalendarInput(parseInt(e.target.value)||0)} min="100" max="300" />
                  <button onClick={handleSaveCalendar} className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-xs text-yellow-700">📌 75% = {Math.round(totalWorkingDays*0.75)} days required</p></div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border space-y-4">
              <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">System Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{label:'Students',value:users.length},{label:'Teachers',value:teachers.length},{label:'Working Days',value:totalWorkingDays},{label:'Required %',value:'75%'},{label:'Today Present',value:presentToday},{label:'System Status',value:'OPTIMAL'}].map((item,i)=>(
                  <div key={i} className="flex justify-between p-4 bg-surface-container-low rounded-lg"><span className="text-sm">{item.label}</span><span className="font-bold">{item.value}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && <div className="bg-white p-12 rounded-xl text-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-outline text-sm">Loading...</p></div>}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAddUserModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold">Add New User</h3>
            <div className="space-y-3">
              <select className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}><option>student</option><option>teacher</option><option>admin</option></select>
              <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm" placeholder="Student ID *" value={newUser.student_id} onChange={e=>setNewUser({...newUser,student_id:e.target.value})} />
              <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm" placeholder="Full Name *" value={newUser.full_name} onChange={e=>setNewUser({...newUser,full_name:e.target.value})} />
              <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm" placeholder="Email" type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} />
              <div className="flex"><span className="bg-surface-container-low rounded-l-lg px-3 py-3 text-sm font-bold border-r">+91</span><input className="flex-1 bg-surface-container-low border-none rounded-r-lg p-3 text-sm" placeholder="Phone" value={newUser.phone} onChange={e=>setNewUser({...newUser,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} maxLength={10} /></div>
              <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm" placeholder="Password *" type="password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} />
            </div>
            <div className="flex gap-3"><button onClick={()=>setShowAddUserModal(false)} className="flex-1 py-3 rounded-lg border font-bold text-sm">Cancel</button><button onClick={handleAddUser} className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-sm">Add User</button></div>
          </div>
        </div>
      )}
    </div>
  );
}