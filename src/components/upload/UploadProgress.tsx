'use client';

import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  onCancel: () => void;
  onDone: () => void;
}

export default function UploadProgress({
  progress,
  status,
  message = '',
  onCancel,
  onDone
}: UploadProgressProps) {
  // تحديد لون شريط التقدم بناءً على الحالة
  const getProgressBarColor = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-indigo-600';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-indigo-600';
    }
  };

  // تحديد عنوان الحالة
  const getStatusTitle = () => {
    switch (status) {
      case 'uploading':
        return 'جاري التحميل...';
      case 'processing':
        return 'جاري المعالجة...';
      case 'success':
        return 'تم التحميل بنجاح!';
      case 'error':
        return 'حدث خطأ أثناء التحميل';
      default:
        return 'جاري التحميل...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{getStatusTitle()}</h3>
          
          {status !== 'success' && (
            <button
              onClick={onCancel}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* شريط التقدم */}
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full ${getProgressBarColor()}`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* النسبة المئوية والرسالة */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="flex justify-end">
          {status === 'success' ? (
            <button
              onClick={onDone}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <CheckIcon className="h-5 w-5 inline-block mr-1 rtl:ml-1 rtl:mr-0" />
              تم
            </button>
          ) : status === 'error' ? (
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={onDone}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              إلغاء التحميل
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}