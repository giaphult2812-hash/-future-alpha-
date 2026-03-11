import React, { useEffect, useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { WaterDropGrid } from './components/WaterDropGrid';
import { BettingControls } from './components/BettingControls';
import { ChartComponent } from './components/ChartComponent';
import { WinModal } from './components/WinModal';
import { SidebarMenu } from './components/SidebarMenu';
import { StreakChallenge } from './components/StreakChallenge';
import { VipAffiliateDashboard } from './components/VipAffiliateDashboard';
import { UserProfile } from './components/UserProfile';
import { DashboardStats } from './components/DashboardStats';
import { FutureAlphaAuth } from './components/FutureAlphaAuth';
import { Bell, Menu, ChevronDown, Gift, CheckCircle, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    time,
    grid,
    currentIndex,
    balance,
    demoBalance,
    realBalance,
    setRealBalance,
    usdtBalance,
    setUsdtBalance,
    accountType,
    switchAccount,
    resetDemoBalance,
    betAmount,
    setBetAmount,
    currentBets,
    phase,
    handleBet,
    notification,
    setNotification,
    betHistory,
    jackpotPool
  } = useGameLogic();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<'TRADE' | 'STREAK_CHALLENGE' | 'VIP_AFFILIATE' | 'PROFILE' | 'DASHBOARD'>('TRADE');

  // Calculate seconds left in current phase
  const currentSecond = time.getSeconds();
  const timeLeft = 60 - currentSecond;

  // Auto-hide notification and handle win modal trigger
  useEffect(() => {
    if (notification) {
      if (notification.type === 'win') {
        // Parse amount from message if possible
        const match = notification.message.match(/\+\$([\d.]+)/);
        if (match) {
            setWinAmount(parseFloat(match[1]));
            setShowWinModal(true);
        }
      }
      
      // Always hide notification after 3 seconds
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  // Auto-hide win modal
  useEffect(() => {
    if (showWinModal) {
      const timer = setTimeout(() => setShowWinModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWinModal]);

  return (
    <>
      {!isAuthenticated && <FutureAlphaAuth onAuthenticated={() => setIsAuthenticated(true)} />}
      
      <div 
        className="h-screen w-full bg-black flex items-center justify-center overflow-hidden selection:bg-purple-500/30"
        style={{ display: isAuthenticated ? 'flex' : 'none' }}
      >
        <div className="w-full h-full sm:max-w-[430px] sm:h-[90vh] sm:rounded-[2.5rem] sm:border-[8px] sm:border-[#1E2329] bg-[#0F0518] text-slate-200 font-sans flex flex-col overflow-hidden relative shadow-2xl">
        <SidebarMenu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          betHistory={betHistory} 
          realBalance={realBalance} 
          setRealBalance={setRealBalance}
          usdtBalance={usdtBalance}
          setUsdtBalance={setUsdtBalance}
          setActivePage={setActivePage}
          activePage={activePage}
        />
        <WinModal 
          isOpen={showWinModal} 
          onClose={() => setShowWinModal(false)} 
          amount={winAmount} 
          isDemo={accountType === 'DEMO'} 
        />

        {/* Header */}
        <header className="h-[60px] bg-[#131722] flex items-center justify-between px-3 sm:px-4 shrink-0 border-b border-[#2A2E39] z-50 relative shadow-md">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Custom Logo SVG - Refined 3D Glossy Look */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative shrink-0 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D8B4FE" />
                  <stop offset="50%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#581C87" />
                </linearGradient>
                <linearGradient id="logoHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="gloss" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                  <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="15" lightingColor="#ffffff" result="spec">
                    <fePointLight x="-5000" y="-10000" z="20000" />
                  </feSpecularLighting>
                  <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
                  <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                </filter>
              </defs>
              
              {/* Orbital Ring - Behind */}
              <path d="M10 55 C 10 25, 90 25, 90 55" 
                stroke="url(#logoBody)" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                transform="rotate(-20 50 50)"
                filter="url(#gloss)"
                opacity="0.8"
              />

              {/* F Shape - Bold & Angular */}
              <path d="M28 20 H 72 L 62 35 H 42 V 45 H 58 L 50 58 H 42 V 80 L 28 80 V 20 Z" 
                fill="url(#logoBody)" 
                filter="url(#gloss)"
                stroke="#E9D5FF"
                strokeWidth="0.5"
              />
              
              {/* A Shape - Interlocking */}
              <path d="M 52 80 L 65 45 L 82 80 H 68 L 66 72 H 58 L 55 80 H 52 Z M 62 62 L 65 52 L 68 62 H 62 Z" 
                fill="url(#logoBody)" 
                filter="url(#gloss)"
                stroke="#E9D5FF"
                strokeWidth="0.5"
              />

              {/* Orbital Ring - Front (Closing the loop visually but cut for depth) */}
              <path d="M90 55 C 90 85, 10 85, 10 55" 
                stroke="url(#logoBody)" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                transform="rotate(-20 50 50)"
                filter="url(#gloss)"
                opacity="0.9"
                strokeDasharray="100"
                strokeDashoffset="0"
              />
            </svg>
          </div>

          {/* Prize Pool Badge */}
          <div 
            className="hidden sm:flex items-center gap-1.5 bg-[#2D1B4E] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(124,58,237,0.15)] cursor-pointer hover:bg-[#3B2563] transition-colors shrink-0"
            onClick={() => setActivePage('STREAK_CHALLENGE')}
          >
            <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 drop-shadow-md" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] sm:text-[9px] text-purple-200/70 uppercase tracking-wider font-semibold">Prize Pool</span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400">${(jackpotPool / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account Balance Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="flex items-center justify-between bg-[#1E2329] hover:bg-[#2A2F36] transition-all px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700 min-w-[110px] sm:min-w-[140px] group"
            >
              <div className="flex flex-col items-start leading-none mr-2 sm:mr-3">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium mb-0.5 group-hover:text-slate-300 transition-colors">
                  {accountType === 'REAL' ? 'Tài khoản Thực' : 'Tài khoản Demo'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">${balance.toFixed(2)}</span>
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2A2E39] flex items-center justify-center group-hover:bg-[#363A45] transition-colors shrink-0">
                <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Account Dropdown Menu */}
            <AnimatePresence>
              {isAccountDropdownOpen && (
                <>
                  <div 
                    className="absolute inset-0 z-40" 
                    onClick={() => setIsAccountDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-[#1E2329] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/5"
                  >
                    {/* Real Account Option */}
                    <div 
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-[#2A2E39] transition-all border-b border-slate-700 ${accountType === 'REAL' ? 'bg-[#2A2E39]/50' : ''}`}
                      onClick={() => {
                        switchAccount('REAL');
                        setIsAccountDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 rounded-full ${accountType === 'REAL' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-600'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tài khoản Thực</span>
                          <span className="text-lg font-bold text-white">${realBalance.toFixed(2)}</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                        <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
                      </button>
                    </div>

                    {/* Demo Account Option */}
                    <div 
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-[#2A2E39] transition-all ${accountType === 'DEMO' ? 'bg-[#2A2E39]/50' : ''}`}
                      onClick={() => {
                        switchAccount('DEMO');
                        setIsAccountDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 rounded-full ${accountType === 'DEMO' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-600'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tài khoản Demo</span>
                          <span className="text-lg font-bold text-white">${demoBalance.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetDemoBalance();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-700/30 flex items-center justify-center border border-slate-600 hover:bg-slate-600/50 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Bell Icon */}
          <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1E2329] hover:bg-[#2A2F36] transition-colors rounded-lg border border-slate-700 text-slate-400 hover:text-white group shrink-0">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] transition-all" />
          </button>
          
          {/* Menu Icon */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1E2329] hover:bg-[#2A2F36] transition-colors rounded-lg border border-slate-700 text-slate-400 hover:text-white shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      {activePage === 'STREAK_CHALLENGE' ? (
        <StreakChallenge onBackToTrade={() => setActivePage('TRADE')} jackpotPool={jackpotPool} />
      ) : activePage === 'VIP_AFFILIATE' ? (
        <VipAffiliateDashboard realBalance={realBalance} setRealBalance={setRealBalance} />
      ) : activePage === 'PROFILE' ? (
        <UserProfile />
      ) : activePage === 'DASHBOARD' ? (
        <DashboardStats betHistory={betHistory} />
      ) : (
        <main className="flex-1 flex flex-col min-h-0 relative">
          {/* Background Gradient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.1),transparent_50%)] pointer-events-none"></div>

          {/* Chart Section - Flexible Height */}
          <div className="relative flex-1 min-h-0 bg-[#0F0518] border-b border-purple-500/10">
            <div className="absolute top-3 left-4 z-10 flex gap-2">
              <div className="bg-[#2D1B4E]/80 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-purple-500/20 shadow-lg">
                <span className="text-amber-500 text-xs">₿</span> 
                <span className="tracking-wider">BTC/USD</span>
              </div>
            </div>
            <ChartComponent data={[]} />
          </div>

          {/* Indicators Bar */}
          <div className="h-9 bg-[#130720] flex items-center justify-between px-4 border-b border-purple-500/10 shrink-0 relative z-10">
            <div className="flex gap-6 text-[10px] font-medium">
              <span className="text-purple-400/60 hover:text-purple-300 cursor-pointer transition-colors">Indicators</span>
              <span className="text-purple-400 border-b-2 border-purple-500 pb-2.5">Last Results</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#2D1B4E] px-2 py-1 rounded-md text-[9px] text-emerald-400 flex items-center gap-1.5 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> 24
              </div>
              <div className="bg-[#2D1B4E] px-2 py-1 rounded-md text-[9px] text-rose-400 flex items-center gap-1.5 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span> 33
              </div>
            </div>
          </div>

          {/* Water Drop Grid - Fixed Height Container */}
          <div className="h-[110px] sm:h-[130px] bg-[#0F0518] flex items-center justify-center shrink-0 border-b border-purple-500/10 relative z-10">
            <WaterDropGrid grid={grid} activeDropIndex={currentIndex} />
          </div>

          {/* Betting Controls - Fixed Height */}
          <div className="shrink-0 relative z-20">
            <BettingControls 
              phase={phase}
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onBet={handleBet}
              currentBets={currentBets}
              timeLeft={timeLeft}
            />
          </div>
        </main>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`absolute top-20 right-4 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md border z-[60] flex items-center gap-3 min-w-[200px]
              ${notification.type === 'win' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 
                notification.type === 'loss' ? 'bg-rose-500/90 border-rose-400 text-white' : 
                notification.type === 'success' ? 'bg-[#1E2329]/95 border-slate-600 text-white' :
                'bg-slate-800/90 border-slate-700 text-slate-200'}`}
          >
            {notification.type === 'success' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
            <div className="font-bold text-sm">{notification.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
    </>
  );
}
