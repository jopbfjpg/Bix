/**
 * تسجيل Service Worker وإعداد مراقبة حالة الاتصال
 */

// تسجيل Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}

// إعداد مراقبة حالة الاتصال
export function setupOfflineDetection(callback: (isOnline: boolean) => void) {
  // التحقق من حالة الاتصال الحالية
  const checkOnlineStatus = () => {
    const isOnline = navigator.onLine;
    callback(isOnline);
    return isOnline;
  };

  // إعداد المستمعين لأحداث الاتصال
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));

  // التحقق من الحالة الأولية
  checkOnlineStatus();

  // إرجاع دالة التنظيف
  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
}

// إعداد التخزين المؤقت للبيانات
export function setupCaching() {
  // تخزين البيانات المهمة في IndexedDB
  if ('indexedDB' in window) {
    // هنا يمكن إضافة منطق التخزين المؤقت باستخدام IndexedDB
  }
}

// تحديث Service Worker
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}