import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { FeaturedVideos } from './featured-videos';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={12} />
            Powered by Kling AI
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[0.95] mb-6">
            See Yourself{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dance
            </span>{' '}
            Like a Pro
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Buy a dance move from a professional choreographer. Upload one photo.
            Get a stunning AI-generated video of <em>you</em> performing it — ready to share.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
            >
              Browse Moves
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold text-base transition-all hover:bg-white/5"
            >
              Start Creating
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/40 text-sm">
            <span>🎬 HD &amp; 4K output</span>
            <span>⚡ Ready in under 5 min</span>
            <span>🔒 Your photo is auto-deleted</span>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-white/50 max-w-xl mx-auto">Three simple steps to your personalized dance video.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🎵',
                title: 'Browse & Buy a Move',
                desc: 'Explore choreography from professional dancers. Filter by style, difficulty, and price. Purchase the move you love.',
              },
              {
                step: '02',
                icon: '📸',
                title: 'Upload Your Photo',
                desc: 'Send one clear front-facing photo. Our AI validates the image and feeds it into the generation engine.',
              },
              {
                step: '03',
                icon: '🎬',
                title: 'Get Your Dance Video',
                desc: 'Receive an HD video of you performing the choreography — ready to download and share in minutes.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-white/3 border border-white/10 hover:border-violet-500/30 transition-colors group"
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <div className="absolute top-6 right-6 text-white/10 font-black text-4xl">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-violet-300 transition-colors">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Videos ── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Featured Moves</h2>
              <p className="text-white/50">Top-performing choreography on the platform.</p>
            </div>
            <Link href="/browse" className="text-violet-400 hover:text-violet-300 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <FeaturedVideos />
        </div>
      </section>

      {/* ── Creator CTA ── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 to-purple-900/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Are You a Choreographer?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
                Upload your choreography once and earn passive income every time a fan generates a video using your moves.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: <Zap size={20} />, label: '70% revenue share' },
                  { icon: <Shield size={20} />, label: 'Content protected' },
                  { icon: <Sparkles size={20} />, label: 'Analytics dashboard' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 justify-center text-violet-300">
                    {f.icon}
                    <span className="text-sm font-medium text-white/80">{f.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all shadow-xl shadow-violet-500/30 hover:scale-105"
              >
                Become a Creator
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
