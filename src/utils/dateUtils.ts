/**
 * تنسيق التاريخ بصيغة "منذ X وقت"
 * @param date التاريخ المراد تنسيقه
 * @returns نص يمثل الوقت المنقضي منذ التاريخ المحدد
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // أقل من دقيقة
  if (diffInSeconds < 60) {
    return 'منذ لحظات';
  }
  
  // أقل من ساعة
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
  }
  
  // أقل من يوم
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`;
  }
  
  // أقل من أسبوع
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'أيام'}`;
  }
  
  // أقل من شهر
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
  }
  
  // أقل من سنة
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? 'شهر' : 'أشهر'}`;
  }
  
  // أكثر من سنة
  const diffInYears = Math.floor(diffInDays / 365);
  return `منذ ${diffInYears} ${diffInYears === 1 ? 'سنة' : 'سنوات'}`;
}

/**
 * تنسيق التاريخ بصيغة مقروءة
 * @param date التاريخ المراد تنسيقه
 * @returns نص يمثل التاريخ بصيغة مقروءة
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('ar-SA', options);
}

/**
 * تنسيق الوقت بصيغة مقروءة
 * @param date التاريخ المراد تنسيقه
 * @returns نص يمثل الوقت بصيغة مقروءة
 */
export function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleTimeString('ar-SA', options);
}

/**
 * تنسيق التاريخ والوقت بصيغة مقروءة
 * @param date التاريخ المراد تنسيقه
 * @returns نص يمثل التاريخ والوقت بصيغة مقروءة
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}