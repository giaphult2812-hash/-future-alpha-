import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  isDemo: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, amount, isDemo }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-200 rounded-2xl p-8 w-[320px] flex flex-col items-center shadow-2xl backdrop-blur-xl"
            >
              {/* Logo Section */}
              <div className="flex items-center justify-center gap-2 mb-1 relative">
                {/* Logo SVG */}
                <div className="w-12 h-12 relative shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="modalLogoBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#6B21A8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Orbital Ring - Behind */}
                    <path d="M10 55 C 10 25, 90 25, 90 55" 
                      stroke="url(#modalLogoBody)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeLinecap="round"
                      transform="rotate(-20 50 50)"
                      opacity="0.8"
                    />

                    {/* F Shape */}
                    <path d="M28 20 H 72 L 62 35 H 42 V 45 H 58 L 50 58 H 42 V 80 L 28 80 V 20 Z" 
                      fill="url(#modalLogoBody)" 
                    />
                    
                    {/* A Shape */}
                    <path d="M 52 80 L 65 45 L 82 80 H 68 L 66 72 H 58 L 55 80 H 52 Z M 62 62 L 65 52 L 68 62 H 62 Z" 
                      fill="url(#modalLogoBody)" 
                    />

                    {/* Orbital Ring - Front */}
                    <path d="M90 55 C 90 85, 10 85, 10 55" 
                      stroke="url(#modalLogoBody)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeLinecap="round"
                      transform="rotate(-20 50 50)"
                      opacity="0.9"
                      strokeDasharray="100"
                      strokeDashoffset="0"
                    />
                  </svg>
                </div>
                
                {/* Text */}
                <span className="text-xl font-black text-slate-800 tracking-wide drop-shadow-sm" style={{ fontFamily: 'sans-serif' }}>
                  Future<span className="text-purple-600">Alpha</span>
                </span>
              </div>

              {/* Demo Badge */}
              {isDemo && (
                <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-4 shadow-sm z-10">
                  Demo
                </div>
              )}

              {/* Message */}
              <div className="text-slate-800 text-xl font-black mb-1 tracking-wide">
                Xin chúc mừng
              </div>

              {/* Amount */}
              <div className="text-4xl font-black text-emerald-500 drop-shadow-sm">
                +${amount.toFixed(2)}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
