import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, Clock, MapPin, Plus, Trash2, Edit3,
  Bell, Sparkles
} from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';

const API_BASE = '/api';

export default function TeacherClasses() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({
    subject_name: '', subject_code: '', day_of_week: 'Monday',
    start_time: '', end_time: '', room: '', branch: '', semester: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'teacher') { navigate('/student/dashboard'); return; }
    setUser(parsed);
    loadClasses(parsed.student_id);
  }, []);

  const loadClasses = async (teacherId) => {
    try {
      // In production, fetch from your backend
      const stored = localStorage.getItem(`classes_${teacherId}`);
      if (stored) {
        setClasses(JSON.parse(stored));
      } else {
        // Default sample data
        const defaultClasses = [
          { id: 1, subject_name: 'Operating Systems', subject_code: 'CS301', day_of_week: 'Monday', start_time: '09:00', end_time: '10:30', room: 'CSE-101', branch: 'CSE', semester: 3 },
          { id: 2, subject_name: 'Database Systems', subject_code: 'CS302', day_of_week: 'Tuesday', start_time: '11:00', end_time: '12:30', room: 'CSE-205', branch: 'CSE', semester: 3 },
          { id: 3, subject_name: 'Computer Networks', subject_code: 'CS303', day_of_week: 'Wednesday', start_time: '14:00', end_time: '15:30', room: 'CSE-301', branch: 'CSE', semester: 3 },
        ];
        setClasses(defaultClasses);
        localStorage.setItem(`classes_${teacherId}`, JSON.stringify(defaultClasses));
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveClasses = (updatedClasses) => {
    setClasses(updatedClasses);
    if (user?.student_id) {
      localStorage.setItem(`classes_${user.student_id}`, JSON.stringify(updatedClasses));
    }
  };

  const handleAddClass = () => {
    if (!form.subject_name || !form.start_time || !form.end_time) return;
    const newClass = { ...form, id: Date.now() };
    const updated = [...classes, newClass];
    saveClasses(updated);
    setShowAddModal(false);
    setForm({ subject_name: '', subject_code: '', day_of_week: 'Monday', start_time: '', end_time: '', room: '', branch: '', semester: '' });
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls.id);
    setForm(cls);
    setShowAddModal(true);
  };

  const handleUpdateClass = () => {
    const updated = classes.map(c => c.id === editingClass ? { ...form, id: editingClass } : c);
    saveClasses(updated);
    setShowAddModal(false);
    setEditingClass(null);
    setForm({ subject_name: '', subject_code: '', day_of_week: 'Monday', start_time: '', end_time: '', room: '', branch: '', semester: '' });
  };

  const handleDeleteClass = (id) => {
    const updated = classes.filter(c => c.id !== id);
    saveClasses(updated);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <TeacherLayout onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Class Schedule</h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-1">
              {classes.length} classes this semester
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-mono font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button onClick={() => { setEditingClass(null); setForm({ subject_name: '', subject_code: '', day_of_week: 'Monday', start_time: '', end_time: '', room: '', branch: '', semester: '' }); setShowAddModal(true); }}
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Add Class
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
            <BookOpen className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Total Classes</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{classes.length}</p>
            <p className="text-xs opacity-70 mt-1">this semester</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Today</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-tertiary">{classes.filter(c => c.day_of_week === today).length}</p>
            <p className="text-xs text-on-surface-variant mt-1">classes</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-xl border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline font-mono">Days/Week</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2 text-on-surface">{new Set(classes.map(c => c.day_of_week)).size}</p>
            <p className="text-xs text-on-surface-variant mt-1">active days</p>
          </div>
          <div className="bg-secondary text-white p-5 md:p-6 rounded-xl relative overflow-hidden">
            <Users className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-mono">Branches</p>
            <p className="text-3xl md:text-4xl font-black font-mono mt-2">{new Set(classes.map(c => c.branch).filter(Boolean)).size || 1}</p>
            <p className="text-xs opacity-70 mt-1">covered</p>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-4">
          {days.map(day => {
            const dayClasses = classes.filter(c => c.day_of_week === day);
            const isToday = day === today;
            return (
              <div key={day} className={`bg-white rounded-xl shadow-sm border transition-all ${isToday ? 'border-primary/30 ring-1 ring-primary/10' : 'border-outline-variant/10'}`}>
                <div className={`px-6 py-4 rounded-t-xl flex items-center justify-between ${isToday ? 'bg-primary/5 border-b border-primary/10' : 'bg-surface-container-low border-b border-outline-variant/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isToday ? 'bg-primary text-white' : 'bg-white text-outline'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-on-surface'}`}>{day}</h3>
                      <p className="text-xs text-outline font-mono">{dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}</p>
                    </div>
                  </div>
                  {isToday && <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Today</span>}
                </div>
                <div className="p-4 space-y-3">
                  {dayClasses.length > 0 ? dayClasses.map(cls => (
                    <div key={cls.id} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all group">
                      <div className="w-1.5 h-14 rounded-full bg-primary shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-outline shrink-0" />
                          <h4 className="text-sm font-bold text-on-surface truncate">{cls.subject_name}</h4>
                          <span className="text-[10px] font-mono text-outline bg-white px-2 py-0.5 rounded shrink-0">{cls.subject_code}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-outline">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.start_time} - {cls.end_time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cls.room}</span>
                          {cls.branch && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.branch} Sem {cls.semester}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClass(cls)} className="p-2 hover:bg-white rounded-lg transition-colors"><Edit3 className="w-4 h-4 text-outline" /></button>
                        <button onClick={() => handleDeleteClass(cls.id)} className="p-2 hover:bg-error/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-error" /></button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <BookOpen className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                      <p className="text-sm text-outline">No classes</p>
                      <button onClick={() => { setForm({ ...form, day_of_week: day }); setShowAddModal(true); }} className="mt-2 text-xs text-primary font-bold hover:underline">+ Add class</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-on-surface">{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Subject Name *</label>
                <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" value={form.subject_name} onChange={e => setForm({ ...form, subject_name: e.target.value })} placeholder="e.g. Operating Systems" />
              </div>
              <div>
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Subject Code</label>
                <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" value={form.subject_code} onChange={e => setForm({ ...form, subject_code: e.target.value })} placeholder="e.g. CS301" />
              </div>
              <div>
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Day</label>
                <select className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">Start Time *</label>
                  <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">End Time *</label>
                  <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Room</label>
                <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g. CSE-101" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">Branch</label>
                  <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} placeholder="e.g. CSE" />
                </div>
                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">Semester</label>
                  <input className="w-full mt-1 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20" type="number" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} placeholder="e.g. 3" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAddModal(false); setEditingClass(null); }} className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-low transition-all">Cancel</button>
              <button onClick={editingClass ? handleUpdateClass : handleAddClass} className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:brightness-110 transition-all">
                {editingClass ? 'Update' : 'Add'} Class
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}