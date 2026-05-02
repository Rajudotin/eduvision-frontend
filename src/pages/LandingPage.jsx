import { Sparkles, Play, Users, Zap, Shield, BarChart3, Send, Fingerprint, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-12 md:pt-24 pb-16 md:pb-32 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="lg:col-span-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-mono text-xs font-semibold mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              99.8% PRECISION BIOMETRICS
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-headline leading-[1.1] tracking-tighter text-on-surface mb-4 md:mb-8">
              Attendance in <span className="text-primary italic">Seconds</span>, Not Minutes.
            </h1>
            <p className="text-base md:text-xl text-on-surface-variant max-w-xl mb-6 md:mb-10 leading-relaxed font-body">
              Eliminate proxy attendance and administrative friction. Our enterprise-grade facial recognition system deploys in minutes.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/register" className="hero-gradient px-6 md:px-8 py-3 md:py-4 rounded-lg text-white font-headline font-bold text-base md:text-lg shadow-xl hover:scale-[0.98] transition-transform">
                Start Free Trial
              </Link>
              <button className="px-6 md:px-8 py-3 md:py-4 rounded-lg border-2 border-outline-variant text-on-surface font-headline font-bold text-base md:text-lg hover:bg-surface-container-low transition-colors inline-flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-low shadow-2xl border-4 border-surface-container-lowest">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {/* <Fingerprint className="w-32 h-32 text-primary/30" /> */}
                <img src="face.png" alt="image" className='w-500 h-auto' />
              </div>
              <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="glass-panel p-3 md:p-4 rounded-xl border border-white/40">
                    <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">Live Detection</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-sm">142</p>
                        <p className="font-mono text-[10px] text-tertiary">Present Now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold font-headline tracking-tight mb-4">Precision in Every Byte</h2>
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto font-body">
              Modern challenges require modern tools. Our ecosystem is built to ensure integrity, speed, and actionable insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Face Recognition - Large Card */}
            <div className="md:col-span-2 lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-tertiary/10 text-tertiary font-mono text-xs font-bold">99.8% ACCURACY</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-headline mb-3 md:mb-4">Advanced Face Recognition</h3>
              <p className="text-on-surface-variant leading-relaxed font-body text-sm md:text-base">
                Powered by InsightFace neural networks, our system identifies students in large crowds, low light, and diverse angles within milliseconds.
              </p>
            </div>

            {/* WhatsApp - Purple Card */}
            <div className="lg:col-span-4 bg-secondary p-6 md:p-8 rounded-2xl text-white shadow-sm relative overflow-hidden group">
              <Send className="w-16 h-16 md:w-24 md:h-24 absolute -right-4 -bottom-4 opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform" />
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center mb-12 md:mb-16">
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-headline mb-2 md:mb-3">WhatsApp Alerts</h3>
                <p className="text-white/80 leading-relaxed text-sm font-body">
                  Automated notifications to parents and admins the moment absence is detected.
                </p>
              </div>
            </div>

            {/* Liveness Detection */}
            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-error/10 text-error flex items-center justify-center mb-6 md:mb-8">
                <Shield className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-headline mb-2 md:mb-3">Liveness Detection</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm font-body">
                3D depth analysis prevents spoofing using photos or videos.
              </p>
            </div>

            {/* Reports */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-6 md:mb-8">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-headline mb-2 md:mb-3">Academic Reports</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm font-body">
                  Deep-dive analytics on attendance trends, identifying at-risk students before performance drops.
                </p>
              </div>
              <div className="w-full md:w-64 h-24 md:h-32 bg-surface-container-low rounded-xl p-4 flex items-end gap-1">
                <div className="flex-1 bg-primary/20 h-1/2 rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-2/3 rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-3/4 rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-full rounded-t-sm"></div>
                <div className="flex-1 bg-primary/80 h-4/5 rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-32">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl md:text-4xl font-bold font-headline tracking-tight mb-4">Scalable For Every Institution</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="bg-surface-container-low p-6 md:p-10 rounded-2xl flex flex-col">
              <h3 className="text-lg font-bold font-headline mb-2">Starter</h3>
              <p className="text-on-surface-variant text-sm mb-6 md:mb-8 font-body">For small learning centers</p>
              <div className="flex items-baseline gap-1 mb-6 md:mb-8">
                <span className="text-3xl md:text-4xl font-bold font-headline">Free</span>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary" /> Up to 100 Students
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface-variant font-body">
                  <XCircle className="w-5 h-5 text-outline-variant" /> WhatsApp Integration
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-xl border border-outline-variant font-headline font-bold hover:bg-surface-container-lowest transition-all">Choose Plan</button>
            </div>

            {/* Pro */}
            <div className="bg-white p-6 md:p-10 rounded-2xl flex flex-col border-2 border-primary relative shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-6 md:right-10 -translate-y-1/2 px-3 md:px-4 py-1 bg-primary text-white text-xs font-bold rounded-full font-headline">POPULAR</div>
              <h3 className="text-lg font-bold font-headline mb-2">Pro</h3>
              <p className="text-on-surface-variant text-sm mb-6 md:mb-8 font-body">For schools</p>
              <div className="flex items-baseline gap-1 mb-6 md:mb-8">
                <span className="text-3xl md:text-4xl font-bold font-headline text-primary">$199</span>
                <span className="text-on-surface-variant text-sm font-body">/mo</span>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary" /> Up to 1,000 Students
                </li>
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary" /> WhatsApp Alerts
                </li>
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary" /> Advanced Reports
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-xl hero-gradient text-white font-headline font-bold shadow-lg hover:scale-105 transition-transform">Start Pro Trial</button>
            </div>

            {/* Enterprise */}
            <div className="bg-inverse-surface p-6 md:p-10 rounded-2xl flex flex-col text-white">
              <h3 className="text-lg font-bold font-headline mb-2">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-6 md:mb-8 font-body">For universities</p>
              <div className="flex items-baseline gap-1 mb-6 md:mb-8">
                <span className="text-3xl md:text-4xl font-bold font-headline">Custom</span>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary-fixed" /> Unlimited Students
                </li>
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary-fixed" /> API Integration
                </li>
                <li className="flex items-center gap-3 text-sm font-medium font-body">
                  <CheckCircle className="w-5 h-5 text-primary-fixed" /> 24/7 Support
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-xl bg-white text-on-surface font-headline font-bold hover:bg-slate-100 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="bg-primary-container rounded-2xl md:rounded-[2rem] p-8 md:p-12 lg:p-20 overflow-hidden relative">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-headline text-white mb-4 md:mb-6 leading-tight">Ready to modernize your academic workflow?</h2>
            <p className="text-white/80 text-base md:text-lg mb-8 md:mb-10 font-body">Join 500+ institutions already saving 40+ administrative hours every week with EduVision AI.</p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link to="/register" className="px-8 md:px-10 py-4 md:py-5 bg-white text-primary font-bold font-headline rounded-xl shadow-xl hover:scale-105 transition-all">Claim Your Free Month</Link>
              <button className="px-8 md:px-10 py-4 md:py-5 border-2 border-white/30 text-white font-bold font-headline rounded-xl hover:bg-white/10 transition-all">Book a Workshop</button>
            </div>
          </div>
          <Fingerprint className="absolute right-0 bottom-0 w-48 h-48 md:w-80 md:h-80 text-white/10 -translate-x-1/4 translate-y-1/4" />
        </div>
      </section>
    </main>
  );
}