
import React, { useMemo } from 'react';
import { Coin } from '../types';

interface GoldPileProps {
  balance: number;
  palette?: string[];
}

const GoldPile: React.FC<GoldPileProps> = ({ balance, palette }) => {
  const defaultPalette = ['#FFD700', '#FFC700', '#DAA520', '#B8860B', '#E6B422', '#F0E68C'];
  const colors = palette || defaultPalette;

  const coinCount = useMemo(() => {
    if (balance <= 0) return 0;
    const count = Math.floor(Math.sqrt(balance) * 2.5);
    return Math.min(count, 2500);
  }, [balance]);

  const coins = useMemo(() => {
    if (coinCount <= 0) return [];
    
    const newCoins: Coin[] = [];
    const baseFloorY = 360;
    const maxVaultHeight = 300;
    
    const relativeHeight = Math.min(1, Math.sqrt(balance) / 1000);
    const currentPileHeight = 20 + (relativeHeight * maxVaultHeight);
    
    const baseSpread = 100;
    const maxSpread = 180;
    const currentSpread = baseSpread + (relativeHeight * (maxSpread - baseSpread));

    for (let i = 0; i < coinCount; i++) {
      const progress = i / coinCount;
      const taper = 1 - (progress * 0.8);
      const rLimit = currentSpread * taper;
      
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * rLimit;
      
      const x = 200 + r * Math.cos(angle);
      const heightOffset = progress * currentPileHeight;
      const slump = (Math.abs(x - 200) / currentSpread) * 15;
      const y = baseFloorY - heightOffset + slump + (Math.random() * 8 - 4);

      newCoins.push({
        id: i,
        x,
        y,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return newCoins;
  }, [coinCount, balance, colors]);

  return (
    <div className="relative w-full h-[400px] flex items-end justify-center overflow-hidden">
      <div className="absolute bottom-0 w-full h-16 bg-[#2c1e12] border-t-8 border-[#1a120b] z-0 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]" />
      
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <filter id="coinShadow">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.3" floodOpacity="0.4"/>
          </filter>
        </defs>
        
        {coins.map((coin) => (
          <g 
            key={coin.id} 
            transform={`translate(${coin.x}, ${coin.y}) rotate(${coin.rotation}) scale(${coin.scale})`}
            className="transition-all duration-500 ease-out"
          >
            <ellipse 
              cx="0" 
              cy="0" 
              rx="7" 
              ry="4.5" 
              fill={coin.color} 
              stroke="#00000033" 
              strokeWidth="0.4"
              filter="url(#coinShadow)"
            />
            <ellipse cx="-1.5" cy="-1" rx="2.5" ry="1.2" fill="rgba(255,255,255,0.4)" />
          </g>
        ))}
      </svg>
      
      {balance <= 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-gray-600 italic medieval-font opacity-40 select-none">
          The stone floor is cold and empty...
        </div>
      )}
    </div>
  );
};

export default GoldPile;
