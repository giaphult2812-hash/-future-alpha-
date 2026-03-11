import React, { useState, useEffect } from 'react';
import { Copy, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VipAffiliateDashboardProps {
  realBalance: number;
  setRealBalance: (amount: number | ((prev: number) => number)) => void;
}

interface VipData {
  isVIP: boolean;
  referralCode: string;
}

export const VipAffiliateDashboard: React.FC<VipAffiliateDashboardProps> = ({ realBalance, setRealBalance }) => {
  const [vipData, setVipData] = useState<VipData>({
    isVIP: false,
    referralCode: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load VIP data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('futureAlpha_vipData');
    if (storedData) {
      try {
        setVipData(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse VIP data', e);
      }
    }
  }, []);

  // Save VIP data to localStorage whenever it changes
  useEffect(() => {
    if (vipData.isVIP || vipData.referralCode) {
      localStorage.setItem('futureAlpha_vipData', JSON.stringify(vipData));
    }
  }, [vipData]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleBuyVIP = () => {
    if (realBalance >= 100) {
      setRealBalance((prev) => prev - 100);
      setVipData({
        isVIP: true,
        referralCode: generateCode(),
      });
      showToast('Nâng cấp VIP thành công!');
    } else {
      showToast('Số dư không đủ!', 'error');
    }
  };

  const handleCopy = async (text: string) => {
    if (!vipData.isVIP) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép');
    } catch (err) {
      showToast('Lỗi sao chép', 'error');
    }
  };

  const affiliateLink = `https://futurealpha.net/signup/${vipData.referralCode || 'XXXXXX'}`;
  const displayCode = vipData.referralCode || 'XXXXXX';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F0518] overflow-y-auto">
      <div className="p-5 pt-8 pb-20 max-w-md mx-auto w-full">
        {/* Header Text */}
        <h1 className="text-[22px] leading-[1.3] font-semibold text-white mb-6">
          Bạn cần trở thành Thành viên VIP để nhận hoa hồng VIP và hoa hồng giao dịch
        </h1>

        {/* Action Button (Conditional) */}
        {!vipData.isVIP && (
          <button
            onClick={handleBuyVIP}
            className="w-full sm:w-auto mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Mua ngay $100
          </button>
        )}

        {/* Affiliate Box */}
        <div className="relative mb-8">
          {/* Blur Overlay if not VIP */}
          {!vipData.isVIP && (
            <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-[#0F0518]/40 rounded-2xl flex items-center justify-center border border-purple-500/20">
              <div className="bg-[#131722]/90 px-4 py-2 rounded-lg border border-purple-500/30 text-purple-300 text-sm font-medium shadow-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Yêu cầu VIP để mở khóa
              </div>
            </div>
          )}

          <div className={`bg-[#131722] border border-purple-500/40 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 ${!vipData.isVIP ? 'opacity-60 grayscale-[0.3]' : 'shadow-[0_0_30px_rgba(139,92,246,0.15)]'}`}>
            
            {/* Input Group 1: Link */}
            <div className="mb-5">
              <label className="block text-sm text-slate-400 mb-2 font-medium">Link đăng ký</label>
              <div className="flex bg-[#0F0518] rounded-xl border border-slate-700/50 overflow-hidden focus-within:border-purple-500/50 transition-colors">
                <input
                  type="text"
                  readOnly
                  value={affiliateLink}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-200 outline-none w-full"
                />
                <button
                  onClick={() => handleCopy(affiliateLink)}
                  disabled={!vipData.isVIP}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Sao chép
                </button>
              </div>
            </div>

            {/* Input Group 2: Code */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">Mã giới thiệu</label>
              <div className="flex bg-[#0F0518] rounded-xl border border-slate-700/50 overflow-hidden focus-within:border-purple-500/50 transition-colors">
                <input
                  type="text"
                  readOnly
                  value={displayCode}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-200 outline-none font-mono tracking-wider"
                />
                <button
                  onClick={() => handleCopy(displayCode)}
                  disabled={!vipData.isVIP}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Area */}
        <div className="bg-[#131722] rounded-2xl p-5 border border-slate-800 flex gap-4 items-start">
          <div className="relative shrink-0 mt-1">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            {/* Badge */}
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#131722]">
              2
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium text-base mb-1">Bạn bè đăng kí</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bạn bè của bạn chấp nhận lời mời, hoàn thành đăng kí và sử dụng
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium z-50 border backdrop-blur-md whitespace-nowrap
              ${toast.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
