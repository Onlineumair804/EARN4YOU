import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Megaphone } from 'lucide-react';

export const AnnouncementModal: React.FC = () => {
  const { currentUser, websiteSettings } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && websiteSettings.announcementEnabled) {
      const hasSeen = sessionStorage.getItem(`earn4you_seen_announcement_${currentUser.id}`);
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [currentUser, websiteSettings.announcementEnabled]);

  const handleClose = () => {
    setIsOpen(false);
    if (currentUser) {
      sessionStorage.setItem(`earn4you_seen_announcement_${currentUser.id}`, 'true');
    }
  };

  if (!isOpen || !websiteSettings.announcementEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-[#0d1633] to-[#060a17] border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Megaphone className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest">
              Platform Announcement
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {websiteSettings.announcementTitle || 'Welcome to EARN4YOU'}
            </h3>
          </div>

          {websiteSettings.announcementImageUrl && (
            <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden border border-amber-500/30 shadow-inner">
              <img
                src={websiteSettings.announcementImageUrl}
                alt="Announcement banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
            {websiteSettings.announcementMessage}
          </p>

          <button
            onClick={handleClose}
            className="w-full py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer transition"
          >
            Got It, Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
