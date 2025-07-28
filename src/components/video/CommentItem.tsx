'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/layout/ToastManager';
import { 
  HeartIcon, 
  EllipsisHorizontalIcon,
  FlagIcon,
  UserIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '@/utils/dateUtils';

type CommentItemProps = {
  comment: {
    id: string;
    userId?: string;
    username: string;
    userAvatar?: string;
    userImage?: string;
    text: string;
    timestamp: string;
    likes: number;
    isLiked?: boolean;
    replyTo?: {
      id: string;
      username: string;
    } | null;
    replies?: any[];
  };
  onReply: (comment: any) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
};

export default function CommentItem({ comment, onReply, onDelete, isReply = false }: CommentItemProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [showOptions, setShowOptions] = useState(false);
  
  // تحديد ما إذا كان المستخدم هو صاحب التعليق
  const isCommentOwner = user && user.uid === comment.userId;
  
  // تنسيق الوقت
  const formattedTime = formatDistanceToNow(new Date(comment.timestamp));
  
  // معالجة الإعجاب بالتعليق
  const handleLike = () => {
    if (!user) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول للإعجاب بالتعليقات',
        duration: 3000
      });
      return;
    }
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // في التطبيق الحقيقي، سنقوم بتحديث الإعجاب في قاعدة البيانات
  };
  
  // معالجة الرد على التعليق
  const handleReply = () => {
    if (!user) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول للرد على التعليقات',
        duration: 3000
      });
      return;
    }
    
    onReply({
      id: comment.id,
      username: comment.username
    });
  };
  
  // معالجة الإبلاغ عن التعليق
  const handleReport = () => {
    if (!user) {
      showToast({
        type: 'warning',
        title: 'تسجيل الدخول مطلوب',
        message: 'يجب عليك تسجيل الدخول للإبلاغ عن التعليقات',
        duration: 3000
      });
      return;
    }
    
    showToast({
      type: 'success',
      title: 'تم الإبلاغ',
      message: 'شكراً لإبلاغك. سنراجع هذا التعليق في أقرب وقت ممكن.',
      duration: 3000
    });
    
    setShowOptions(false);
  };
  
  // معالجة حذف التعليق
  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
      
      showToast({
        type: 'success',
        title: 'تم الحذف',
        message: 'تم حذف التعليق بنجاح',
        duration: 3000
      });
    }
    
    setShowOptions(false);
  };
  
  // معالجة زيارة الملف الشخصي
  const handleVisitProfile = () => {
    setShowOptions(false);
  };

  return (
    <div className={`flex mb-4 ${isReply ? 'pl-8 rtl:pr-8 rtl:pl-0' : ''}`}>
      <div className="h-8 w-8 rounded-full overflow-hidden mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0">
        <Link href={`/profile/${comment.username}`}>
          <Image
            src={comment.userAvatar || comment.userImage || 'https://randomuser.me/api/portraits/lego/1.jpg'}
            alt={comment.username}
            width={32}
            height={32}
            className="object-cover"
          />
        </Link>
      </div>
      
      <div className="flex-1 relative">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/profile/${comment.username}`} className="font-medium text-sm mr-2 hover:underline">
                @{comment.username}
              </Link>
              
              {comment.replyTo && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="mx-1">•</span>
                  رداً على{' '}
                  <Link href={`/profile/${comment.replyTo.username}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    @{comment.replyTo.username}
                  </Link>
                </span>
              )}
            </div>
            
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-sm mt-1 text-gray-900 dark:text-white">{comment.text}</p>
        </div>
        
        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-3 rtl:ml-3 rtl:mr-0">{formattedTime}</span>
          
          <button 
            onClick={handleReply}
            className="mr-3 rtl:ml-3 rtl:mr-0 hover:text-gray-700 dark:hover:text-gray-300"
          >
            رد
          </button>
          
          <button 
            onClick={handleLike}
            className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isLiked ? (
              <HeartIconSolid className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0 text-red-500" />
            ) : (
              <HeartIcon className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
            )}
            <span>{likesCount > 0 ? likesCount : ''}</span>
          </button>
        </div>
        
        {/* قائمة الخيارات */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute top-0 right-0 rtl:left-0 rtl:right-auto mt-8 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="py-1">
                <Link 
                  href={`/profile/${comment.username}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleVisitProfile}
                >
                  <UserIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  زيارة الملف الشخصي
                </Link>
                
                <button 
                  onClick={handleReport}
                  className="flex items-center w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FlagIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  الإبلاغ عن التعليق
                </button>
                
                {isCommentOwner && (
                  <button 
                    onClick={handleDelete}
                    className="flex items-center w-full text-left rtl:text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    حذف التعليق
                  </button>
                )}
                
                <button 
                  onClick={() => setShowOptions(false)}
                  className="flex items-center w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  إغلاق
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}