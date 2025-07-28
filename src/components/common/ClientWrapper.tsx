'use client';

import dynamic from 'next/dynamic';

// استيراد ديناميكي لمكون تحسين الأداء
const PerformanceOptimizer = dynamic(
  () => import('./PerformanceOptimizer'),
  { ssr: false }
);

// استيراد شاشة البداية
const SplashScreen = dynamic(
  () => import('./SplashScreen'),
  { ssr: false }
);

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PerformanceOptimizer />
      <SplashScreen />
      {children}
    </>
  );
}