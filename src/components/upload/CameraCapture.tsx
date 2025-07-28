'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CameraIcon, 
  VideoCameraIcon, 
  ArrowPathIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface CameraCaptureProps {
  onCapture: (file: File, type: 'image' | 'video') => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // بدء تشغيل الكاميرا
  useEffect(() => {
    startCamera();
    
    return () => {
      // تنظيف عند إزالة المكون
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [facingMode]);
  
  // بدء تشغيل الكاميرا
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        audio: cameraMode === 'video',
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('فشل في الوصول إلى الكاميرا. يرجى التحقق من الأذونات.');
    }
  };
  
  // تبديل الكاميرا الأمامية/الخلفية
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };
  
  // تبديل وضع الكاميرا (صورة/فيديو)
  const toggleCameraMode = () => {
    setCameraMode(prev => prev === 'photo' ? 'video' : 'photo');
  };
  
  // بدء العد التنازلي للتقاط صورة
  const startPhotoCountdown = () => {
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };
  
  // التقاط صورة
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // تحويل الصورة إلى URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // تحويل الصورة إلى ملف
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file, 'image');
          }
        }, 'image/jpeg');
      }
    }
  };
  
  // بدء تسجيل فيديو
  const startRecording = () => {
    if (streamRef.current) {
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        
        // تحويل الفيديو إلى ملف
        const file = new File([blob], `video_${Date.now()}.mp4`, { type: 'video/mp4' });
        onCapture(file, 'video');
      };
      
      // بدء التسجيل
      mediaRecorder.start();
      setIsRecording(true);
      
      // بدء مؤقت التسجيل
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  // إيقاف تسجيل الفيديو
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // تنسيق وقت التسجيل
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* شريط العنوان */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={onCancel}
          className="text-white p-2"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleCamera}
            className="text-white p-2"
          >
            <ArrowPathIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={toggleCameraMode}
            className="text-white p-2"
          >
            {cameraMode === 'photo' ? (
              <VideoCameraIcon className="h-6 w-6" />
            ) : (
              <CameraIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* عرض الكاميرا */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <canvas ref={canvasRef} className="hidden" />
            
            {/* العد التنازلي */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white text-7xl font-bold"
                >
                  {countdown}
                </motion.div>
              </div>
            )}
            
            {/* مؤقت التسجيل */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
                <div className="w-3 h-3 rounded-full bg-white mr-2 rtl:ml-2 rtl:mr-0 animate-pulse" />
                <span>{formatRecordingTime(recordingTime)}</span>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* أزرار التحكم */}
      <div className="p-6 flex justify-center">
        {cameraMode === 'photo' ? (
          <button
            onClick={startPhotoCountdown}
            disabled={!!error || countdown !== null}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-white rounded-full" />
          </button>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!!error}
            className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50 ${
              isRecording ? 'bg-red-600' : ''
            }`}
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-white rounded-sm" />
            ) : (
              <div className="w-12 h-12 bg-red-600 rounded-full" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}