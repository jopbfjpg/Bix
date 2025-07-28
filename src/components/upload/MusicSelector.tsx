'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MusicalNoteIcon, 
  PlayIcon, 
  PauseIcon, 
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// قائمة الموسيقى المتاحة
const MUSIC_TRACKS = [
  { id: 'track1', name: 'أغنية شعبية', artist: 'فنان 1', duration: '0:30', url: '/music/track1.mp3' },
  { id: 'track2', name: 'موسيقى هادئة', artist: 'فنان 2', duration: '0:45', url: '/music/track2.mp3' },
  { id: 'track3', name: 'إيقاع سريع', artist: 'فنان 3', duration: '0:20', url: '/music/track3.mp3' },
  { id: 'track4', name: 'موسيقى حماسية', artist: 'فنان 4', duration: '0:35', url: '/music/track4.mp3' },
  { id: 'track5', name: 'أغنية عربية', artist: 'فنان 5', duration: '0:40', url: '/music/track5.mp3' },
  { id: 'track6', name: 'موسيقى كلاسيكية', artist: 'فنان 6', duration: '0:50', url: '/music/track6.mp3' },
  { id: 'track7', name: 'إيقاع راقص', artist: 'فنان 7', duration: '0:25', url: '/music/track7.mp3' },
  { id: 'track8', name: 'موسيقى خليجية', artist: 'فنان 8', duration: '0:30', url: '/music/track8.mp3' },
  { id: 'track9', name: 'أغنية حزينة', artist: 'فنان 9', duration: '0:45', url: '/music/track9.mp3' },
  { id: 'track10', name: 'موسيقى تصويرية', artist: 'فنان 10', duration: '0:35', url: '/music/track10.mp3' },
];

interface MusicSelectorProps {
  selectedTrackId: string;
  onSelectTrack: (trackId: string) => void;
}

export default function MusicSelector({ selectedTrackId, onSelectTrack }: MusicSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // تصفية المسارات بناءً على البحث
  const filteredTracks = MUSIC_TRACKS.filter(track => 
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // إنشاء عنصر الصوت
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.5;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // تشغيل/إيقاف المسار
  const togglePlay = (trackId: string, trackUrl: string) => {
    if (!audioElement) return;

    if (playingTrackId === trackId) {
      // إيقاف المسار الحالي
      audioElement.pause();
      setPlayingTrackId(null);
    } else {
      // تشغيل مسار جديد
      if (playingTrackId) {
        audioElement.pause();
      }
      
      audioElement.src = trackUrl;
      audioElement.play().catch(e => console.error('Error playing audio:', e));
      setPlayingTrackId(trackId);
    }
  };

  // اختيار المسار
  const handleSelectTrack = (trackId: string) => {
    onSelectTrack(trackId);
    
    // إيقاف التشغيل عند الاختيار
    if (audioElement && playingTrackId) {
      audioElement.pause();
      setPlayingTrackId(null);
    }
  };

  return (
    <div className="p-4 bg-gray-900">
      <h3 className="text-white text-sm font-medium mb-3">الموسيقى</h3>
      
      {/* حقل البحث */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن موسيقى..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      {/* قائمة المسارات */}
      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedTrackId === track.id ? 'bg-indigo-900/50' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {/* زر التشغيل/الإيقاف */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(track.id, track.url);
                }}
                className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0"
              >
                {playingTrackId === track.id ? (
                  <PauseIcon className="h-4 w-4 text-white" />
                ) : (
                  <PlayIcon className="h-4 w-4 text-white" />
                )}
              </button>
              
              {/* معلومات المسار */}
              <div className="flex-1 min-w-0" onClick={() => handleSelectTrack(track.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-white truncate">{track.name}</p>
                    <p className="text-xs text-gray-400">{track.artist}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2 rtl:ml-2 rtl:mr-0">{track.duration}</span>
                    {selectedTrackId === track.id && (
                      <CheckIcon className="h-5 w-5 text-indigo-400" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            لا توجد نتائج مطابقة
          </div>
        )}
      </div>
    </div>
  );
}