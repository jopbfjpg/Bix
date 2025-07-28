'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // تقدم سريع للشاشة الافتتاحية (3 ثوانٍ)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
          }, 300);
          return 100;
        }
        return prev + 5; // زيادة بنسبة 5% كل مرة
      });
    }, 150); // 150ms * 20 steps = 3 seconds

    // تنظيف
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Bix
          </span>
        </h1>
      </motion.div>

      {/* شريط التقدم */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <p className="mt-4 text-white/80 text-sm">جاري التحميل... {progress}%</p>
    </motion.div>
  );
}