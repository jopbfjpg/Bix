'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import CameraCapture from './CameraCapture';
import { 
  PlusIcon, 
  VideoCameraIcon, 
  PhotoIcon, 
  ArrowUpTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function VideoCreationButton() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  // فتح/إغلاق القائمة
  const toggleMenu = () => {
    if (!user || user.isAnonymous) {
      showToast({
        type: 'error',
        title: 'يجب تسجيل الدخول',
        message: 'يجب تسجيل الدخول لإنشاء محتوى',
        duration: 3000
      });
      router.push('/auth');
      return;
    }
    
    setIsMenuOpen(!isMenuOpen);
  };
  
  // فتح نافذة اختيار الملفات
  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = false;
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelected(file);
      }
    };
    
    input.click();
    setIsMenuOpen(false);
  };
  
  // فتح الكاميرا
  const openCamera = () => {
    setShowCamera(true);
    setIsMenuOpen(false);
  };
  
  // معالجة الملف المختار
  const handleFileSelected = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      showToast({
        type: 'error',
        title: 'خطأ في الملف',
        message: 'يرجى اختيار ملف فيديو أو صورة صالح',
        duration: 3000
      });
      return;
    }
    
    // إنشاء URL للملف
    const fileUrl = URL.createObjectURL(file);
    
    // توجيه المستخدم إلى صفحة التحرير
    router.push(`/upload?file=${encodeURIComponent(fileUrl)}&type=${isVideo ? 'video' : 'image'}`);
  };
  
  // معالجة الوسائط الملتقطة من الكاميرا
  const handleCapturedMedia = (file: File, type: 'image' | 'video') => {
    setShowCamera(false);
    handleFileSelected(file);
  };
  
  return (
    <>
      {/* زر الإنشاء */}
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
      >
        <PlusIcon className="h-8 w-8 text-white" />
      </motion.button>
      
      {/* قائمة الخيارات */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-end justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">إنشاء محتوى جديد</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={openCamera}
                  className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <VideoCameraIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                  <span className="text-sm text-gray-900 dark:text-white">الكاميرا</span>
                </button>
                
                <button
                  onClick={openFilePicker}
                  className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowUpTrayIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                  <span className="text-sm text-gray-900 dark:text-white">تحميل ملف</span>
                </button>
                
                <button
                  onClick={openCamera}
                  className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <PhotoIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                  <span className="text-sm text-gray-900 dark:text-white">صورة</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                بالنقر على "إنشاء"، فإنك توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* مكون الكاميرا */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <CameraCapture
              onCapture={handleCapturedMedia}
              onCancel={() => setShowCamera(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}