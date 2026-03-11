import { useState, useEffect, useCallback, useRef } from 'react';
import { getVietnamTime, getCandleColor, CandleColor, SOUNDS } from '../constants';
import { fetchCandles } from '../services/binanceService';

export interface Bet {
  id: string;
  type: 'UP' | 'DOWN';
  amount: number;
  time: Date;
  status: 'PENDING' | 'WIN' | 'LOSS';
  resultAmount?: number;
  accountType: 'DEMO' | 'REAL';
  targetMinute: number;
}

export const useGameLogic = () => {
  const [time, setTime] = useState(getVietnamTime());
  const [historyMap, setHistoryMap] = useState<Record<number, CandleColor>>({});
  
  // Account State
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');
  const [demoBalance, setDemoBalance] = useState(1000);
  const [realBalance, setRealBalance] = useState(() => {
    const saved = localStorage.getItem('futureAlpha_realBalance');
    return saved ? parseFloat(saved) : 0; // Initialize with 0 for new accounts
  });
  const [usdtBalance, setUsdtBalance] = useState(0);

  // Persist realBalance
  useEffect(() => {
    localStorage.setItem('futureAlpha_realBalance', realBalance.toString());
  }, [realBalance]);
  
  // Derived Balance
  const balance = accountType === 'DEMO' ? demoBalance : realBalance;
  
  const setBalance = (amount: number | ((prev: number) => number)) => {
    if (accountType === 'DEMO') {
      setDemoBalance(amount);
    } else {
      setRealBalance(amount);
    }
  };

  const switchAccount = (type: 'DEMO' | 'REAL') => {
    setAccountType(type);
  };

  const resetDemoBalance = () => {
    setDemoBalance(1000);
    setNotification({ message: "Đã đặt lại số dư Demo", type: 'success' });
  };

  const [betAmount, setBetAmount] = useState(10);
  const [demoBets, setDemoBets] = useState<{ UP: number; DOWN: number }>({ UP: 0, DOWN: 0 });
  const [realBets, setRealBets] = useState<{ UP: number; DOWN: number }>({ UP: 0, DOWN: 0 });
  const currentBets = accountType === 'DEMO' ? demoBets : realBets;
  
  // Bet History State
  const [betHistory, setBetHistory] = useState<Bet[]>([]);

  const [lastProcessedPairIndex, setLastProcessedPairIndex] = useState(-1);
  const [notification, setNotification] = useState<{ message: string; type: 'win' | 'loss' | 'info' | 'success' } | null>(null);
  const [streak, setStreak] = useState<{ type: 'WIN' | 'LOSS' | 'NONE'; count: number }>({ type: 'NONE', count: 0 });
  const [jackpotPool, setJackpotPool] = useState(30723.00);

  // Refs for audio to avoid re-creation
  const audioClick = useRef(new Audio(SOUNDS.CLICK));
  const audioWin = useRef(new Audio(SOUNDS.WIN));
  const audioLoss = useRef(new Audio(SOUNDS.LOSS));

  // 1. Time Synchronization (UTC+7)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Adjust to UTC+7 for display purposes
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const vnTime = new Date(utc + (3600000 * 7));
      setTime(vnTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMinute = time.getMinutes();
  const currentSecond = time.getSeconds();
  
  // Phase Logic: Even minute = WAIT (Result), Odd minute = ORDER
  // Row 1 (Min 0, 4...) & Row 3 (Min 2, 6...) -> Result Phase (WAIT)
  // Row 2 (Min 1, 5...) & Row 4 (Min 3, 7...) -> Order Phase (ORDER)
  const isOrderPhase = currentMinute % 2 !== 0;
  const phase = isOrderPhase ? 'ORDER' : 'WAIT';

  // 2. Initial Data Fetch (Load closed candles based on current time to sync across all users)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch enough candles to ensure we have enough closed ones (e.g., 100)
        const data = await fetchCandles(100);
        
        const now = Date.now();
        const newMap: Record<number, CandleColor> = {};
        
        data.forEach((candle: any[]) => {
           // Only process closed candles
           if (candle[6] < now) {
               const candleAbsM = Math.floor(candle[0] / 60000);
               const color = getCandleColor(candle[1], candle[4]);
               newMap[candleAbsM] = color;
           }
        });
        
        setHistoryMap(newMap);
      } catch (e) {
        console.error("Failed to fetch history", e);
      }
    };
    
    fetchHistory();
  }, []); // Run once on mount

  // 3. Real-time Result Checking (Every minute at second 01)
  useEffect(() => {
    if (currentSecond === 1) {
       const targetMinute = currentMinute === 0 ? 59 : currentMinute - 1;
       checkResult(targetMinute);
    }
  }, [currentMinute, currentSecond]);

  const checkResult = async (minuteIndex: number) => {
    // Prevent double processing
    if (minuteIndex === lastProcessedPairIndex) return; 

    try {
      // Fetch recent candles to find the correct one
      const data = await fetchCandles(5);
      
      const targetCandle = data.find((c: any) => {
        const m = new Date(c[0] + (3600000 * 7)).getMinutes();
        return m === minuteIndex;
      });

      if (targetCandle) {
        const color = getCandleColor(targetCandle[1], targetCandle[4]);
        
        // Handle Betting Result
        // Payout on EVEN minutes (Row 1, 3...) which are the RESULT phases
        // We bet on ODD minutes (Order), and the result is the NEXT minute (Even)
        if (minuteIndex % 2 === 0) {
           const winningType = color === 'green' ? 'UP' : color === 'red' ? 'DOWN' : null;
           
           if (winningType) {
             // Process Bets History
             setBetHistory(prevHistory => {
               return prevHistory.map(bet => {
                 if (bet.status === 'PENDING' && bet.targetMinute === minuteIndex) {
                   const isWin = bet.type === winningType;
                   const winAmount = isWin ? bet.amount * 1.95 : 0;
                   return {
                     ...bet,
                     status: isWin ? 'WIN' : 'LOSS',
                     resultAmount: isWin ? winAmount : -bet.amount
                   };
                 }
                 return bet;
               });
             });

             // Process Demo Bets (Aggregate)
             const demoWinAmount = demoBets[winningType] * 1.95;
             const demoTotalBet = demoBets.UP + demoBets.DOWN;
             
             if (demoTotalBet > 0) {
                if (demoWinAmount > 0) {
                    setDemoBalance(prev => prev + demoWinAmount);
                    if (accountType === 'DEMO') {
                        audioWin.current.play();
                        setNotification({ message: `WIN +$${demoWinAmount.toFixed(2)}`, type: 'win' });
                    }
                } else {
                    if (accountType === 'DEMO') {
                        audioLoss.current.play();
                        setNotification({ message: `LOSS -$${demoTotalBet.toFixed(2)}`, type: 'loss' });
                    }
                }
             }

             // Process Real Bets (Aggregate)
             const realWinAmount = realBets[winningType] * 1.95;
             const realTotalBet = realBets.UP + realBets.DOWN;
             
             if (realTotalBet > 0) {
                if (realWinAmount > 0) {
                    setRealBalance(prev => prev + realWinAmount);
                    if (accountType === 'REAL') {
                        audioWin.current.play();
                        setNotification({ message: `WIN +$${realWinAmount.toFixed(2)}`, type: 'win' });
                    }
                } else {
                    if (accountType === 'REAL') {
                        audioLoss.current.play();
                        setNotification({ message: `LOSS -$${realTotalBet.toFixed(2)}`, type: 'loss' });
                    }
                }
             }

             // Streak Logic
             const totalBet = accountType === 'DEMO' ? demoTotalBet : realTotalBet;
             const winAmount = accountType === 'DEMO' ? demoWinAmount : realWinAmount;
             
             if (totalBet > 0) {
               const isWin = winAmount > 0;
               setStreak(prev => {
                 const newType = isWin ? 'WIN' : 'LOSS';
                 const newCount = prev.type === newType ? prev.count + 1 : 1;
                 
                 // Jackpot trigger logic (9+ streak)
                 if (newCount >= 9) {
                   // 10% chance to win the jackpot
                   if (Math.random() < 0.1) {
                     // 0.1% of jackpot pool
                     const jackpotWin = jackpotPool * 0.001;
                     if (accountType === 'REAL') {
                       setRealBalance(b => b + jackpotWin);
                     } else {
                       setDemoBalance(b => b + jackpotWin);
                     }
                     setNotification({ message: `STREAK JACKPOT! +$${jackpotWin.toFixed(2)}`, type: 'success' });
                   }
                 }
                 
                 return { type: newType, count: newCount };
               });
             }
           }
           
           // Reset bets after processing result
           setDemoBets({ UP: 0, DOWN: 0 });
           setRealBets({ UP: 0, DOWN: 0 });
        }
        
        // Update Grid with Sliding Window Logic
        // We use the current state values directly since this runs once per minute
        const candleAbsM = Math.floor(targetCandle[0] / 60000);
        setHistoryMap(prev => ({
            ...prev,
            [candleAbsM]: color
        }));
        
        setLastProcessedPairIndex(minuteIndex);
      }
    } catch (e) {
      console.error("Error checking result", e);
    }
  };

  const handleBet = (type: 'UP' | 'DOWN') => {
    if (phase === 'WAIT') return;
    if (balance < betAmount) {
      setNotification({ message: "Số dư không đủ", type: 'info' });
      return;
    }
    
    // Deduct immediately and accumulate bet based on account type
    if (accountType === 'DEMO') {
        setDemoBalance(prev => prev - betAmount);
        setDemoBets(prev => ({
            ...prev,
            [type]: prev[type] + betAmount
        }));
    } else {
        setRealBalance(prev => prev - betAmount);
        setRealBets(prev => ({
            ...prev,
            [type]: prev[type] + betAmount
        }));
        // 0.05% of real trading volume goes to jackpot
        setJackpotPool(prev => prev + (betAmount * 0.0005));
    }

    // Add to History
    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: betAmount,
      time: new Date(time), // Current VN time
      status: 'PENDING',
      accountType,
      targetMinute: (currentMinute + 1) % 60 // Target the next minute (Result Phase)
    };
    setBetHistory(prev => [newBet, ...prev]);
    
    audioClick.current.play();
    setNotification({ message: "Đặt lệnh thành công", type: 'success' });
  };

  // Derive grid and currentIndex from historyMap
  const realNow = Date.now();
  const currentAbsM = Math.floor(realNow / 60000);
  const currentIndex = 40 + (currentAbsM % 20);
  
  const grid = Array(60).fill('none') as CandleColor[];
  for (let i = 0; i < 60; i++) {
      const diff = currentIndex - i;
      const candleAbsM = currentAbsM - diff;
      grid[i] = historyMap[candleAbsM] || 'none';
  }

  return {
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
    streak,
    jackpotPool
  };
};
