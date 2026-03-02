import Link from 'next/link';
import { Zap, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Motion<span className="text-violet-400">Mesh</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              AI-powered dance video marketplace. Buy a move, upload your photo, get a professional dance video — starring you.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/40 hover:text-violet-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-white/40 hover:text-violet-400 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-white/40 hover:text-violet-400 transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              {[['Browse Videos', '/browse'], ['Trending', '/browse'], ['New Releases', '/browse']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Creators</h4>
            <ul className="space-y-2">
              {[['Become a Creator', '/register'], ['Creator Dashboard', '/dashboard'], ['Pricing', '/browse']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2026 MotionMesh. All rights reserved.</p>
          <p className="text-white/30 text-xs">All AI-generated videos are labeled in compliance with deepfake disclosure requirements.</p>
        </div>
      </div>
    </footer>
  );
}
