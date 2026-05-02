import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, TrendingDown, Download, FileText, FileSpreadsheet,
  Search, Bell, Sparkles, Calendar, Filter, ChevronDown, Users, Award
} from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';
import { getTodayAttendance, getStudentSummary, getUsers } from '../services/api';

export default function TeacherReports() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');

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

  const loadStudentReport = async (studentId) => {
    setLoading(true);
    try {
      const res = await getStudentSummary(studentId);
      setStudentReport(res.data);
    } catch (err) { console.error("Report load failed:", err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const presentToday = todayData?.records?.length || 0;
  const absentToday = students.length - presentToday;
  const todayRate = students.length > 0 ? Math.round((presentToday / students.length) * 100) : 0;

  // Class-wise attendance (grouped by year_of_study)
  const classGroups = students.reduce((acc, s) => {
    const key = s.year_of_study ? `Year ${s.year_of_study}` : 'Other';
    if (!acc[key]) acc[key] = { total: 0, present: 0 };
    acc[key].total++;
    if (todayData?.records?.some(r => r.student_id === s.student_id)) acc[key].present++;
    return acc;
  }, {});

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TeacherLayout onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Reports</h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-1">
              Attendance analytics & downloadable reports
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
          <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
            <Users className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Students</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{students.length}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Present Today</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-tertiary">{presentToday}</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Absent Today</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-error">{absentToday}</p>
          </div>
          <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden">
            <Award className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Today's Rate</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{todayRate}%</p>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-surface-container-low rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'class-wise', label: 'Class-wise' },
                { id: 'individual', label: 'Individual' },
                { id: 'downloads', label: 'Downloads' },
              ].map(tab => (
                <button key={tab.id} onClick={() => { setReportType(tab.id); setSelectedStudent(null); setStudentReport(null); }}
                  className={`px-4 py-2 text-xs font-bold rounded-md capitalize transition-all ${reportType === tab.id ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}>{tab.label}</button>
              ))}
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
              <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                className="bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-8 text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-outline pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl text-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-outline text-sm">Loading...</p></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {reportType === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Summary */}
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
                    <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-4 bg-tertiary/5 rounded-lg">
                        <span className="text-sm font-bold text-on-surface">Present</span>
                        <span className="text-lg font-black text-tertiary">{presentToday}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-error/5 rounded-lg">
                        <span className="text-sm font-bold text-on-surface">Absent</span>
                        <span className="text-lg font-black text-error">{absentToday}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-surface-container-low rounded-lg">
                        <span className="text-sm font-bold text-on-surface">Total Enrolled</span>
                        <span className="text-lg font-black text-on-surface">{students.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Distribution */}
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
                    <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-4">Attendance Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Present</span><span className="font-bold text-tertiary">{presentToday}</span></div>
                        <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary rounded-full" style={{ width: `${todayRate}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Absent</span><span className="font-bold text-error">{absentToday}</span></div>
                        <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-error rounded-full" style={{ width: `${100 - todayRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLASS-WISE */}
            {reportType === 'class-wise' && (
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                <div className="p-6 md:p-8"><h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest mb-1">Class-wise Attendance</h3><p className="text-sm text-outline">Today's attendance by year/class</p></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-surface-container-low text-[10px] font-mono text-outline uppercase tracking-widest"><th className="px-6 py-4 font-bold">Class</th><th className="px-6 py-4 font-bold">Total</th><th className="px-6 py-4 font-bold">Present</th><th className="px-6 py-4 font-bold">Absent</th><th className="px-6 py-4 font-bold">Rate</th></tr></thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {Object.entries(classGroups).map(([cls, data]) => (
                        <tr key={cls} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4 font-bold text-sm">{cls}</td>
                          <td className="px-6 py-4 font-mono text-sm">{data.total}</td>
                          <td className="px-6 py-4 font-mono text-sm text-tertiary">{data.present}</td>
                          <td className="px-6 py-4 font-mono text-sm text-error">{data.total - data.present}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-surface-container-low rounded-full overflow-hidden">
                                <div className="h-full bg-tertiary rounded-full" style={{ width: `${data.total > 0 ? Math.round((data.present / data.total) * 100) : 0}%` }}></div>
                              </div>
                              <span className="text-xs font-bold font-mono">{data.total > 0 ? Math.round((data.present / data.total) * 100) : 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INDIVIDUAL */}
            {reportType === 'individual' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                    <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search student by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden max-h-96 overflow-y-auto">
                    {filteredStudents.slice(0, 30).map(s => (
                      <button key={s.student_id} onClick={() => { setSelectedStudent(s); loadStudentReport(s.student_id); }}
                        className={`w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 flex items-center gap-3 ${selectedStudent?.student_id === s.student_id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div>
                        <div><p className="text-sm font-bold">{s.full_name}</p><p className="text-[10px] text-outline font-mono">{s.student_id}</p></div>
                      </button>
                    ))}
                  </div>
                  <div className="lg:col-span-2">
                    {studentReport ? (
                      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
                        <div><h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Student Report</h3><p className="text-lg font-bold mt-1">{selectedStudent?.full_name} <span className="text-sm text-outline font-mono">({selectedStudent?.student_id})</span></p></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-surface-container-low rounded-lg text-center"><p className="text-2xl font-black font-mono text-on-surface">{studentReport.total_days || 0}</p><p className="text-[10px] uppercase font-bold text-outline">Total Days</p></div>
                          <div className="p-4 bg-tertiary/5 rounded-lg text-center"><p className="text-2xl font-black font-mono text-tertiary">{studentReport.present_days || 0}</p><p className="text-[10px] uppercase font-bold text-outline">Present</p></div>
                          <div className="p-4 bg-error/5 rounded-lg text-center"><p className="text-2xl font-black font-mono text-error">{studentReport.absent_days || 0}</p><p className="text-[10px] uppercase font-bold text-outline">Absent</p></div>
                          <div className="p-4 bg-secondary/5 rounded-lg text-center"><p className="text-2xl font-black font-mono text-secondary">{studentReport.attendance_percentage || 0}%</p><p className="text-[10px] uppercase font-bold text-outline">Percentage</p></div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => window.open(`/api/reports/pdf/${selectedStudent.student_id}`, '_blank')} className="flex-1 py-3 bg-error/10 text-error rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-error/20"><FileText className="w-4 h-4" /> PDF</button>
                          <button onClick={() => window.open(`/api/reports/excel/${selectedStudent.student_id}`, '_blank')} className="flex-1 py-3 bg-tertiary/10 text-tertiary rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-tertiary/20"><FileSpreadsheet className="w-4 h-4" /> Excel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-12 rounded-xl shadow-sm border border-outline-variant/10 text-center">
                        <Search className="w-12 h-12 text-outline-variant mx-auto mb-3" />
                        <p className="text-outline text-sm">Select a student to view their report</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DOWNLOADS */}
            {reportType === 'downloads' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Bulk Reports</h3>
                  <button onClick={() => {/* bulk PDF */}} className="w-full p-4 bg-error/5 border border-error/20 rounded-xl hover:bg-error/10 transition-all flex items-center gap-3 group">
                    <FileText className="w-8 h-8 text-error" />
                    <div className="text-left"><p className="text-sm font-bold">All Students PDF</p><p className="text-xs text-outline">Individual reports merged</p></div>
                    <Download className="w-4 h-4 ml-auto" />
                  </button>
                  <button onClick={() => {/* bulk Excel */}} className="w-full p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl hover:bg-tertiary/10 transition-all flex items-center gap-3 group">
                    <FileSpreadsheet className="w-8 h-8 text-tertiary" />
                    <div className="text-left"><p className="text-sm font-bold">Class-wise Excel</p><p className="text-xs text-outline">All classes attendance</p></div>
                    <Download className="w-4 h-4 ml-auto" />
                  </button>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
                  <h3 className="font-mono text-xs font-bold text-outline uppercase tracking-widest">Today's Report</h3>
                  <div className="space-y-2">
                    <p className="text-sm">Present: <span className="font-bold text-tertiary">{presentToday}</span></p>
                    <p className="text-sm">Absent: <span className="font-bold text-error">{absentToday}</span></p>
                    <p className="text-sm">Rate: <span className="font-bold">{todayRate}%</span></p>
                  </div>
                  <button className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm">Generate Report</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TeacherLayout>
  );
}