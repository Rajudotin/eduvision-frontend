import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CalendarCheck, Search, Bell, CheckCircle, XCircle, TrendingUp,
  Sparkles
} from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';
import { getTodayAttendance, getUsers } from '../services/api';

export default function TeacherAttendance() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'teacher') { navigate('/student/dashboard'); return; }
    setUser(parsed);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, studentsRes] = await Promise.all([getTodayAttendance(), getUsers("student")]);
      setTodayData(todayRes.data);
      setStudents(studentsRes.data?.users || []);
    } catch (err) { console.error("Load failed:", err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const presentStudents = students.filter(s => todayData?.records?.some(r => r.student_id === s.student_id));
  const presentIds = presentStudents.map(s => s.student_id);
  const absentStudents = students.filter(s => !presentIds.includes(s.student_id));

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'present') return matchesSearch && presentIds.includes(s.student_id);
    if (filter === 'absent') return matchesSearch && !presentIds.includes(s.student_id);
    return matchesSearch;
  });

  const presentCount = presentStudents.length;
  const absentCount = absentStudents.length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <TeacherLayout onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Attendance</h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-1">
              {presentCount}/{students.length} students present today
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden hover:scale-[1.02] transition-transform">
            <Users className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Students</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{students.length}</p>
            <p className="text-xs opacity-70 mt-1">enrolled</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Present</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-tertiary">{presentCount}</p>
            <p className="text-xs text-on-surface-variant mt-1">students</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-md transition-shadow">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-error">{absentCount}</p>
            <p className="text-xs text-on-surface-variant mt-1">students</p>
          </div>
          <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-transform">
            <TrendingUp className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Rate</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{attendanceRate}%</p>
            <p className="text-xs opacity-70 mt-1">attendance</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
            <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-surface-container-low rounded-lg p-1">
            {['all', 'present', 'absent'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold rounded-md capitalize transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Student List */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-outline text-sm">Loading attendance data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-1">Student Attendance</h3>
              <p className="text-sm text-outline">{filteredStudents.length} students</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-surface-container-low text-[10px] font-mono text-outline uppercase tracking-widest"><th className="px-6 py-4 font-bold">Student</th><th className="px-6 py-4 font-bold">ID</th><th className="px-6 py-4 font-bold">Email</th><th className="px-6 py-4 font-bold">Time</th><th className="px-6 py-4 font-bold">Status</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredStudents.slice(0, 20).map((s, i) => {
                    const record = todayData?.records?.find(r => r.student_id === s.student_id);
                    const isPresent = !!record;
                    return (
                      <tr key={i} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPresent ? 'bg-tertiary/10' : 'bg-error/10'}`}>{isPresent ? <CheckCircle className="w-4 h-4 text-tertiary" /> : <XCircle className="w-4 h-4 text-error" />}</div><div><p className="font-bold text-sm">{s.full_name}</p><p className="text-[10px] text-outline">Year {s.year_of_study || 'N/A'}</p></div></div></td>
                        <td className="px-6 py-4 font-mono text-xs text-outline">{s.student_id}</td>
                        <td className="px-6 py-4 text-xs text-outline">{s.email}</td>
                        <td className="px-6 py-4 text-xs text-outline font-mono">{record?.time || '—'}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${isPresent ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>{isPresent ? 'Present' : 'Absent'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}