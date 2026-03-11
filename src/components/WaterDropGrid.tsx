import React from 'react';
import { motion } from 'motion/react';
import { CandleColor } from '../constants';

interface WaterDropGridProps {
  grid: CandleColor[];
  activeDropIndex: number;
}

export const WaterDropGrid: React.FC<WaterDropGridProps> = ({ grid, activeDropIndex }) => {
  const renderBlock = (blockIndex: number) => {
    const startIndex = blockIndex * 20;
    const blockData = grid.slice(startIndex, startIndex + 20);

    return (
      <div className="grid grid-cols-5 grid-rows-4 gap-0.5 p-1 bg-[#1E2329]/50 rounded border border-slate-800/50 shadow-inner relative">
        {blockData.map((color, i) => {
          const index = startIndex + i;
          const isCurrent = index === activeDropIndex;
          
          // Calculate position based on user instruction:
          // minute % 20 (which is i)
          // remainder 0 -> row 1, col 1
          // remainder 1 -> row 2, col 1
          // ...
          // remainder 4 -> row 1, col 2
          const row = (i % 4) + 1;
          const col = Math.floor(i / 4) + 1;
          
          return (
            <div 
              key={i} 
              className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
              style={{ gridRow: row, gridColumn: col }}
            >
              {/* Main Circle */}
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-300 shadow-sm
                ${color === 'green' 
                  ? 'bg-gradient-to-br from-[#0ECB81] to-[#05A665] shadow-[0_1px_3px_rgba(14,203,129,0.4)]' 
                  : color === 'red' 
                    ? 'bg-gradient-to-br from-[#F6465D] to-[#D93549] shadow-[0_1px_3px_rgba(246,70,93,0.4)]' 
                    : 'bg-[#2B3139] shadow-none'}`}
              >
                {/* Glossy effect */}
                {(color === 'green' || color === 'red') && (
                  <div className="absolute top-[2px] left-[3px] w-1.5 h-1 sm:w-2 sm:h-1.5 bg-white/40 rounded-full blur-[0.2px]" />
                )}
              </div>

              {/* Current Indicator (Pulse Ring) */}
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-white/50"
                />
              )}
              
              {/* Current Indicator (Solid Ring) */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full border border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex gap-1 justify-center items-center p-1 w-full overflow-hidden">
      {renderBlock(0)}
      {renderBlock(1)}
      {renderBlock(2)}
    </div>
  );
};
