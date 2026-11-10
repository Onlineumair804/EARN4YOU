import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { useApp } from '../context/AppContext';
import { X, Play, CheckCircle2, Clock, Youtube, ExternalLink, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { completeTask } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (task) {
      setSecondsRemaining(task.durationSeconds || 30);
      setIsPlaying(false);
      setIsCompleted(false);
      setErrorMsg('');
      setSuccessMsg('');
      setSubscribed(false);
    }
  }, [task]);

  useEffect(() => {
    if (isPlaying && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoClaim();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, secondsRemaining]);

  if (!task) return null;

  const handleStartWatching = () => {
    setIsPlaying(true);
    setErrorMsg('');
  };

  const handleAutoClaim = () => {
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const res = completeTask(task.id, 30);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((30 - secondsRemaining) / 30) * 100)
  );

  // Extract clean embed URL or use placeholder video
  const videoId = task.youtubeVideoId || 'dQw4w9WgXcQ';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-[#0d162e] to-[#070c1d] rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                {task.category}
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-1 mt-0.5">{task.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 30-Second Timer Banner */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-slate-800"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-amber-400 transition-all duration-1000 ease-linear"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={150.8}
                    strokeDashoffset={150.8 - (150.8 * progressPercent) / 100}
                  />
                </svg>
                <span className="absolute text-sm font-black text-amber-300">
                  {secondsRemaining}s
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <Clock className="w-3.5 h-3.5" />
                  <span>30-Second Task Watch Timer</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {secondsRemaining > 0
                    ? isPlaying
                      ? 'Video playing! Timer active. Stay on this screen.'
                      : 'Click "Start Task & Play Video" to begin the 30-second timer.'
                    : 'Time completed! Task reward is credited.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400">Reward Value</span>
              <span className="text-xl font-extrabold text-amber-400">
                +Rs. {task.reward}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-2 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* YouTube Video Embed Frame */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-3 animate-pulse">
                  <Play className="w-8 h-8 fill-red-500 translate-x-0.5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Ready to start 30s Video Task
                </h4>
                <p className="text-xs text-slate-400 max-w-md mb-4">
                  Watch for 30 seconds continuously. The anti-cheat system validates your watch time before awarding Rs. {task.reward}.
                </p>
                <button
                  onClick={handleStartWatching}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-900 gold-gradient-btn flex items-center space-x-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-900" />
                  <span>Start Task & Play Video</span>
                </button>
              </div>
            ) : null}

            {isPlaying && (
              <iframe
                src={embedUrl}
                title={task.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Channel Subscribe Section (if applicable) */}
          {task.channelSubscribeUrl && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">
                    {task.channelName || 'Official YouTube Channel'}
                  </h5>
                  <p className="text-xs text-slate-400">Subscribe for bonus task verification</p>
                </div>
              </div>

              <a
                href={task.channelSubscribeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSubscribed(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  subscribed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                <span>{subscribed ? 'Subscribed ✓' : 'Subscribe Channel'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Instructions Box */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h5 className="text-xs font-bold text-slate-300 mb-1 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Task Guidelines</span>
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">{task.instructions}</p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div className="font-medium">
                <span>{successMsg}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Close
          </button>

          {isCompleted ? (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-2 shadow-lg shadow-emerald-900/40 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed & Credited</span>
            </button>
          ) : (
            <button
              disabled={secondsRemaining > 0}
              onClick={handleAutoClaim}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${
                secondsRemaining === 0
                  ? 'gold-gradient-btn text-slate-900 cursor-pointer shadow-lg animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {secondsRemaining > 0 ? `Wait ${secondsRemaining}s to Claim` : 'Claim Rs. ' + task.reward + ' Reward'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
