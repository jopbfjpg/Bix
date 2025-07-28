'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  onClose: () => void;
}

export default function QRCodeGenerator({ value, size = 200, onClose }: QRCodeGeneratorProps) {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);

  useEffect(() => {
    // توليد رمز QR باستخدام API
    const generateQRCode = async () => {
      try {
        // استخدام API لتوليد رمز QR
        const encodedValue = encodeURIComponent(value);
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`;
        
        setQrCodeSvg(apiUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [value, size]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">رمز QR للملف الشخصي</h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          {qrCodeSvg ? (
            <img 
              src={qrCodeSvg} 
              alt="QR Code" 
              width={size} 
              height={size} 
              className="rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 border-2 border-gray-300 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">جاري التحميل...</div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          امسح رمز QR لزيارة الملف الشخصي
        </p>
      </div>
    </div>
  );
}