import React, { useState } from 'react';
import { Eye, EyeOff, BarChart2, Sprout } from 'lucide-react';
import { Bet } from '../hooks/useGameLogic';

interface DashboardStatsProps {
  betHistory: Bet[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ betHistory }) => {
  const [isHidden, setIsHidden] = useState(false);

  const completedBets = betHistory.filter(b => b.status !== 'PENDING');
  const totalTrades = completedBets.length;
  const winBets = completedBets.filter(b => b.status === 'WIN');
  const lossBets = completedBets.filter(b => b.status === 'LOSS');
  
  const winCount = winBets.length;
  const lossCount = lossBets.length;
  const drawCount = 0; // Assuming no draws for now

  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
  
  const totalVolume = completedBets.reduce((sum, bet) => sum + bet.amount, 0);
  
  const netProfit = completedBets.reduce((sum, bet) => {
    if (bet.status === 'WIN') return sum + (bet.amount * 0.95);
    if (bet.status === 'LOSS') return sum - bet.amount;
    return sum;
  }, 0);

  const totalRevenue = winBets.reduce((sum, bet) => sum + (bet.amount * 1.95), 0);

  const buyBets = completedBets.filter(b => b.type === 'UP').length;
  const sellBets = completedBets.filter(b => b.type === 'DOWN').length;
  const buyPercent = totalTrades > 0 ? (buyBets / totalTrades) * 100 : 0;
  const sellPercent = totalTrades > 0 ? (sellBets / totalTrades) * 100 : 0;

  // Donut Chart Math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const winStroke = totalTrades > 0 ? (winCount / totalTrades) * circumference : 0;

  const formatCurrency = (val: number) => {
    if (isHidden) return '******';
    const sign = val < 0 ? '-' : '';
    return `${sign}$${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (val: number) => {
    if (isHidden) return '***';
    return val.toString();
  };

  const formatPercent = (val: number) => {
    if (isHidden) return '***%';
    return `${val.toFixed(2)}%`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0B0E14] overflow-y-auto">
      <div className="p-4 sm:p-5 max-w-md mx-auto w-full space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <h1 className="text-xl font-bold text-white">Số Liệu B.O</h1>
          <button onClick={() => setIsHidden(!isHidden)} className="text-slate-400 hover:text-white transition-colors">
            {isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Trade Stats Card */}
        <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl p-6 shadow-lg">
          <h2 className="text-white font-semibold mb-6">Trade Stats</h2>
          
          <div className="flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 mb-8">
              <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                {/* Background/Loss Ring (Red) */}
                <circle cx="64" cy="64" r={radius} fill="transparent" stroke="#EF4444" strokeWidth="12" />
                {/* Win Ring (Blue) */}
                <circle 
                  cx="64" cy="64" r={radius} fill="transparent" stroke="#3B82F6" strokeWidth="12"
                  strokeDasharray={`${winStroke} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 mb-1">Lượt giao dịch</span>
                <span className="text-xl font-bold text-white">{formatNumber(totalTrades)}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full max-w-[200px] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-[#3B82F6] bg-transparent"></div>
                <span className="text-sm text-slate-300">Tổng vòng thắng</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-[#6B7280] bg-transparent"></div>
                <span className="text-sm text-slate-300">Tổng vòng hòa</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-[#EF4444] bg-transparent"></div>
                <span className="text-sm text-slate-300">Tổng vòng thua</span>
              </div>
            </div>

            {/* Stats */}
            <div className="w-full space-y-6 text-center">
              <div>
                <div className="text-sm text-slate-400 mb-1">Tỉ lệ thắng</div>
                <div className="text-xl font-bold text-white">{formatPercent(winRate)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Tổng giao dịch</div>
                <div className="text-xl font-bold text-white">{formatCurrency(totalVolume)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profit & Revenue Cards */}
        <div className="space-y-3">
          <div className="bg-[#32B11D] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <BarChart2 className="w-10 h-10 text-white/80" />
            <div>
              <div className="text-white/90 text-sm mb-1">Lợi nhuận ròng</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(netProfit)}</div>
            </div>
          </div>

          <div className="bg-[#14B8A6] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <Sprout className="w-10 h-10 text-white/80" />
            <div>
              <div className="text-white/90 text-sm mb-1">Tổng doanh thu</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Trade Summary Bar */}
        <div className="pt-4">
          <h3 className="text-center text-slate-400 text-sm mb-4">Tóm tắt giao dịch</h3>
          <div className="h-2 w-full flex rounded-full overflow-hidden mb-2">
            <div className="bg-[#EF4444] h-full transition-all duration-500" style={{ width: `${sellPercent}%` }}></div>
            <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${buyPercent}%` }}></div>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-[#EF4444]">BÁN {formatPercent(sellPercent)}</span>
            <span className="text-[#10B981]">{formatPercent(buyPercent)} MUA</span>
          </div>
        </div>

        {/* Transaction History Title */}
        <div className="pt-6">
          <h2 className="text-xl font-bold text-white">Lịch Sử Giao Dịch</h2>
        </div>

      </div>
    </div>
  );
};
