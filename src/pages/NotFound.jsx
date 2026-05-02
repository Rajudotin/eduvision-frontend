import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-black text-on-surface mb-4 font-mono">404</h1>
        <h2 className="text-xl font-bold text-on-surface mb-2">Page Not Found</h2>
        <p className="text-outline text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}