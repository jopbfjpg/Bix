'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import Image from 'next/image';
import { validateComment } from '@/lib/utils/contentFilter';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface CommentFormProps {
  videoId: string;
  onCommentAdded: (comment: any) => void;
  replyTo?: {
    id: string;
    username: string;
  } | null;
  onCancelReply?: () => void;
}

export default function CommentForm({ 
  videoId, 
  onCommentAdded, 
  replyTo = null, 
  onCancelReply 
}: CommentFormProps) {
  const { user, isGuest } = useAuth();
  const { showToast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول لإضافة تعليق',
        duration: 3000
      });
      return;
    }
    
    if (!comment.trim()) {
      showToast({
        type: 'error',
        title: 'خطأ',
        message: 'لا يمكن إرسال تعليق فارغ',
        duration: 3000
      });
      return;
    }
    
    // التحقق من المحتوى غير اللائق
    const validationResult = validateComment(comment);
    
    if (!validationResult.isValid) {
      showToast({
        type: 'error',
        title: 'محتوى غير لائق',
        message: validationResult.message || 'يرجى تجنب استخدام لغة غير لائقة',
        duration: 3000
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // في التطبيق الحقيقي، سنقوم بإرسال التعليق إلى قاعدة البيانات
      // هنا نقوم بمحاكاة ذلك
      
      setTimeout(() => {
        const newComment = {
          id: `comment-${Date.now()}`,
          userId: user.uid,
          username: user.displayName || 'مستخدم',
          userAvatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          text: validationResult.cleanedComment,
          timestamp: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          replyTo: replyTo ? {
            id: replyTo.id,
            username: replyTo.username
          } : null
        };
        
        onCommentAdded(newComment);
        setComment('');
        setIsSubmitting(false);
        
        // إذا كان رد، نقوم بإلغاء وضع الرد
        if (replyTo && onCancelReply) {
          onCancelReply();
        }
        
        showToast({
          type: 'success',
          title: 'تم إضافة التعليق',
          message: replyTo 
            ? `تم إضافة ردك على @${replyTo.username} بنجاح` 
            : 'تمت إضافة تعليقك بنجاح',
          duration: 3000
        });
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      showToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى.',
        duration: 3000
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* إذا كان رد، نعرض شريط الرد */}
      {replyTo && (
        <div className="absolute top-0 left-0 right-0 bg-indigo-50 dark:bg-indigo-900/30 p-2 flex justify-between items-center transform -translate-y-full">
          <span className="text-xs text-indigo-600 dark:text-indigo-400">
            الرد على <span className="font-bold">@{replyTo.username}</span>
          </span>
          <button 
            type="button" 
            onClick={onCancelReply}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            إلغاء
          </button>
        </div>
      )}
      
      <div className="h-8 w-8 rounded-full overflow-hidden mr-2 rtl:ml-2 rtl:mr-0">
        <Image
          src={user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt="صورة المستخدم"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isGuest 
            ? "سجل الدخول للتعليق..." 
            : replyTo 
              ? `الرد على @${replyTo.username}...` 
              : "أضف تعليقًا..."
          }
          disabled={isGuest || isSubmitting}
          className="flex-1 bg-transparent text-sm focus:outline-none py-1 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={!comment.trim() || isSubmitting || isGuest}
          className={`ml-2 rtl:mr-2 rtl:ml-0 ${
            !comment.trim() || isSubmitting || isGuest
              ? 'text-gray-400 dark:text-gray-600'
              : 'text-indigo-600 dark:text-indigo-400'
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
        </button>
      </div>
    </form>
  );
}