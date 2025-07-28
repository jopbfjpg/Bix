'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationBadgeProps {
  count?: number;
  onClick?: () => void;
  showPulse?: boolean;
}

export default function NotificationBadge({
  count = 0,
  onClick,
  showPulse = false
}: NotificationBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // تشغيل الرسوم المتحركة عند تغيير العدد
  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
      aria-label="الإشعارات"
    >
      <BellIcon className="h-6 w-6" />
      
      {/* عدد الإشعارات */}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: isAnimating ? [1, 1.2, 1] : 1, 
              opacity: 1 
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* نبض الإشعارات */}
      {showPulse && (
        <span className="absolute top-0 right-0 h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
}