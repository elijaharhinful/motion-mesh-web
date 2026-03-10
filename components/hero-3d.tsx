'use client';

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export function Hero3D() {
  return (
    <div className="w-full h-[500px] lg:h-[700px] flex items-center justify-center relative">
      <Suspense
        fallback={
          <div className="animate-pulse w-full h-full bg-violet-900/10 rounded-2xl flex items-center justify-center">
            <span className="text-violet-400/50 text-sm font-medium">Loading 3D Experience...</span>
          </div>
        }
      >
        <Spline 
          scene="https://prod.spline.design/LTFNYLQBdo3WfN1X/scene.splinecode" 
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
      </Suspense>
      
      {/* Optional overlay to blend the 3D scene smoothly into the dark background */}
      {/* <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_100px_40px_#050505] lg:shadow-[inset_0_0_150px_60px_#050505]" /> */}
    </div>
  );
}
