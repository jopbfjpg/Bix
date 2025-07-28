'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// استيراد ديناميكي لمكون تحسين الأداء
const PerformanceOptimizer = dynamic(
  () => import('@/components/common/PerformanceOptimizer'),
  { ssr: false }
);

// استيراد شاشة البداية
const SplashScreen = dynamic(
  () => import('@/components/common/SplashScreen'),
  { ssr: false }
);

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <PerformanceOptimizer />
      <SplashScreen />
      {children}
    </>
  );
}