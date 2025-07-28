'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import { useTheme } from '@/components/theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// استيراد ديناميكي لمكون QRCodeGenerator
const QRCodeGenerator = dynamic(
  () => import('./QRCodeGenerator'),
  { ssr: false }
);
import { 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  MoonIcon, 
  SunIcon, 
  QrCodeIcon, 
  LinkIcon, 
  ShieldExclamationIcon, 
  UserIcon, 
  BellIcon, 
  LockClosedIcon, 
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function SettingsMenu() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // معالجة تسجيل الخروج
  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/auth');
      showToast({
        type: 'success',
        title: 'تم تسجيل الخروج',
        message: 'تم تسجيل خروجك بنجاح',
        duration: 3000
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.',
        duration: 3000
      });
    }
  };
  
  // معالجة مشاركة الملف الشخصي
  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `الملف الشخصي لـ ${user?.displayName || 'مستخدم'}`,
        text: `تفضل بزيارة ملفي الشخصي على Bix`,
        url: `${window.location.origin}/profile/${user?.uid}`
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // نسخ الرابط إلى الحافظة
      const profileUrl = `${window.location.origin}/profile/${user?.uid}`;
      navigator.clipboard.writeText(profileUrl);
      
      showToast({
        type: 'success',
        title: 'تم نسخ الرابط',
        message: 'تم نسخ رابط ملفك الشخصي إلى الحافظة',
        duration: 3000
      });
    }
  };
  
  return (
    <>
      {/* زر الإعدادات */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
        aria-label="الإعدادات"
      >
        <Cog6ToothIcon className="h-6 w-6" />
      </button>
      
      {/* قائمة الإعدادات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-sm w-full bg-white dark:bg-gray-900 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* رأس القائمة */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">الإعدادات</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                {/* محتوى القائمة */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {/* قسم الحساب */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">الحساب</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => router.push('/profile/edit')}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <UserIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>تعديل الملف الشخصي</span>
                        </button>
                        
                        <button
                          onClick={() => router.push('/settings/notifications')}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <BellIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>إعدادات الإشعارات</span>
                        </button>
                        
                        <button
                          onClick={() => router.push('/settings/privacy')}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <LockClosedIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>الخصوصية والأمان</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* قسم المظهر */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">المظهر</h3>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          {theme === 'dark' ? (
                            <SunIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <MoonIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          )}
                          <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'}</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </button>
                    </div>
                    
                    {/* قسم المشاركة */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">مشاركة الملف الشخصي</h3>
                      <div className="space-y-2">
                        <button
                          onClick={handleShareProfile}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <LinkIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>نسخ رابط الملف الشخصي</span>
                        </button>
                        
                        <button
                          onClick={() => setShowQRCode(true)}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <QrCodeIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>عرض رمز QR</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* قسم المساعدة */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">المساعدة</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => router.push('/help')}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <QuestionMarkCircleIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>مركز المساعدة</span>
                        </button>
                        
                        <button
                          onClick={() => router.push('/report')}
                          className="flex items-center w-full p-3 text-left rtl:text-right text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <ShieldExclamationIcon className="h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 text-gray-500 dark:text-gray-400" />
                          <span>الإبلاغ عن مشكلة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* زر تسجيل الخروج */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* نافذة رمز QR */}
            <AnimatePresence>
              {showQRCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 flex items-center justify-center z-50"
                  onClick={() => setShowQRCode(false)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  <div onClick={e => e.stopPropagation()}>
                    <QRCodeGenerator 
                      value={`${window.location.origin}/profile/${user?.uid}`}
                      size={200}
                      onClose={() => setShowQRCode(false)}
                    />
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleShareProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        مشاركة الرابط
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}