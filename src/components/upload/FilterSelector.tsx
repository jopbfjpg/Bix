'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// أنواع الفلاتر المتاحة
const FILTERS = [
  { id: 'normal', name: 'عادي', class: '' },
  { id: 'grayscale', name: 'رمادي', class: 'grayscale' },
  { id: 'sepia', name: 'سيبيا', class: 'sepia' },
  { id: 'saturate', name: 'مشبع', class: 'saturate-150' },
  { id: 'contrast', name: 'تباين', class: 'contrast-125' },
  { id: 'brightness', name: 'سطوع', class: 'brightness-125' },
  { id: 'blur', name: 'ضبابي', class: 'blur-sm' },
  { id: 'hue-rotate', name: 'تدوير اللون', class: 'hue-rotate-90' },
  { id: 'invert', name: 'عكس', class: 'invert' },
  { id: 'vintage', name: 'قديم', class: 'sepia brightness-75 contrast-125' },
  { id: 'cool', name: 'بارد', class: 'hue-rotate-180 brightness-110' },
  { id: 'warm', name: 'دافئ', class: 'sepia-[.25] brightness-110 saturate-150' },
  { id: 'dramatic', name: 'درامي', class: 'contrast-150 brightness-75' },
  { id: 'noir', name: 'نوار', class: 'grayscale contrast-150 brightness-75' },
  { id: 'vivid', name: 'حيوي', class: 'saturate-200 contrast-110' },
];

interface FilterSelectorProps {
  previewUrl: string;
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  isVideo?: boolean;
}

export default function FilterSelector({
  previewUrl,
  selectedFilter,
  onSelectFilter,
  isVideo = false
}: FilterSelectorProps) {
  return (
    <div className="p-4 bg-gray-900">
      <h3 className="text-white text-sm font-medium mb-3">الفلاتر</h3>
      
      <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {FILTERS.map((filter) => (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectFilter(filter.id)}
            className={`flex flex-col items-center ${selectedFilter === filter.id ? 'text-indigo-400' : 'text-white'}`}
          >
            <div className={`w-16 h-16 rounded-md overflow-hidden mb-1 border-2 ${selectedFilter === filter.id ? 'border-indigo-400' : 'border-transparent'}`}>
              {isVideo ? (
                <video
                  src={previewUrl}
                  className={`w-full h-full object-cover ${filter.class}`}
                  muted
                  playsInline
                  loop
                  autoPlay
                />
              ) : (
                <div className={`w-full h-full bg-cover bg-center ${filter.class}`} style={{ backgroundImage: `url(${previewUrl})` }} />
              )}
            </div>
            <span className="text-xs">{filter.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}