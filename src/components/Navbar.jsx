import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Hide navbar on auth pages + dashboard
  const hideNavbar = ['/login', '/register', '/student/dashboard', '/teacher/dashboard', '/admin/dashboard'].includes(location.pathname);
  
  if (hideNavbar) return null;

  return (
    <nav className="sticky top-0 z-50 bg-slate-50/70 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-screen-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-container text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-blue-700 font-headline">EduVision AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-blue-700 font-bold border-b-2 border-blue-700 font-headline text-sm">Features</a>
          <a href="#pricing" className="text-slate-600 font-medium text-sm hover:text-blue-600 transition-colors font-headline">Pricing</a>
          <a href="#about" className="text-slate-600 font-medium text-sm hover:text-blue-600 transition-colors font-headline">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block px-5 py-2 rounded-lg bg-primary-container text-white font-headline font-bold text-sm shadow-sm hover:scale-95 transition-all duration-150">
            Sign In
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <a href="#features" className="block text-blue-700 font-bold font-headline text-sm">Features</a>
          <a href="#pricing" className="block text-slate-600 font-medium text-sm font-headline">Pricing</a>
          <a href="#about" className="block text-slate-600 font-medium text-sm font-headline">About</a>
          <Link to="/login" className="block w-full text-center px-5 py-2 rounded-lg bg-primary-container text-white font-headline font-bold text-sm">Sign In</Link>
        </div>
      )}
    </nav>
  );
}