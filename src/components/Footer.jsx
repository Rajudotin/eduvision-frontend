import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  
  const hideFooter = ['/login', '/register', '/student/dashboard', '/teacher/dashboard', '/admin/dashboard'].includes(location.pathname);
  
  if (hideFooter) return null;

  return (
    <footer className="bg-slate-100 border-t-0">
      <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-700" />
            <span className="text-sm font-bold text-blue-700 font-headline uppercase tracking-tighter">EduVision AI</span>
          </div>
          <p className="font-body text-xs text-slate-500 max-w-xs text-center md:text-left">
            © 2026 EduVision AI. Precision Lens biometric protocols active.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="text-slate-500 font-body text-xs hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-500 font-body text-xs hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="text-slate-500 font-body text-xs hover:text-blue-600 transition-colors">Security</a>
          <a href="#" className="text-slate-500 font-body text-xs hover:text-blue-600 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}