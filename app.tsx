
import React, { useState } from 'react';
import GoldPile from './components/goldpile';
import { Transaction, Vault } from './types';
import { audioService } from './services/audioService';
import { getTreasurerComment } from './services/geminiService';
import { Coins, ScrollText, Landmark, ShieldAlert, History, Sword, Castle, Flame, Skull, PenTool, Check, X } from 'lucide-react';

const INITIAL_VAULTS: Vault[] = [
  {
    id: 'royal',
    name: 'The Royal Vault',
    subtitle: 'Managed by the Royal Treasury',
    balance: 100,
    transactions: [],
    theme: {
      primary: '#d4af37',
      secondary: '#8b4513',
      accent: '#ffd700',
      bgClass: 'bg-[#1a120b]',
      coinPalette: ['#FFD700', '#FFC700', '#DAA520', '#B8860B', '#E6B422'],
      bannerIcon: 'royal'
    }
  },
  {
    id: 'iron',
    name: 'The Iron Bank',
    subtitle: 'The Iron Bank Will Have Its Due',
    balance: 50,
    transactions: [],
    theme: {
      primary: '#a19d94',
      secondary: '#2c3e50',
      accent: '#ecf0f1',
      bgClass: 'bg-[#1c2833]',
      coinPalette: ['#bdc3c7', '#95a5a6', '#7f8c8d', '#dcdde1', '#718093'],
      bannerIcon: 'bank'
    }
  },
  {
    id: 'forest',
    name: 'Druid Grove',
    subtitle: 'Offerings to the Great Oak',
    balance: 10,
    transactions: [],
    theme: {
      primary: '#2d5a27',
      secondary: '#3d2b1f',
      accent: '#78e08f',
      bgClass: 'bg-[#0f1d0e]',
      coinPalette: ['#20bf6b', '#26de81', '#218c74', '#33d9b2', '#009432'],
      bannerIcon: 'forest'
    }
  },
  {
    id: 'dragon',
    name: 'Dragon Hoard',
    subtitle: 'Blood Gold of the Ancient Worm',
    balance: 500,
    transactions: [],
    theme: {
      primary: '#c0392b',
      secondary: '#4a235a',
      accent: '#e67e22',
      bgClass: 'bg-[#1b0d0d]',
      coinPalette: ['#eb4d4b', '#ff7979', '#f0932b', '#ffbe76', '#c0392b'],
      bannerIcon: 'dragon'
    }
  },
  {
    id: 'shadow',
    name: 'Shadow Crate',
    subtitle: 'Treasures Plucked from the Void',
    balance: 0,
    transactions: [],
    theme: {
      primary: '#8e44ad',
      secondary: '#2c3e50',
      accent: '#9b59b6',
      bgClass: 'bg-[#0d0d0d]',
      coinPalette: ['#4834d4', '#686de0', '#be2edd', '#e056fd', '#30336b'],
      bannerIcon: 'shadow'
    }
  }
];

const App: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [activeVaultId, setActiveVaultId] = useState<string>('royal');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [treasurerMsg, setTreasurerMsg] = useState<string>("Which ledger shall we inspect today?");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Metadata Editing State
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');

  const activeVault = vaults.find(v => v.id === activeVaultId)!;

  const handleTransaction = async (type: 'gain' | 'expense') => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;

    const actualAmount = type === 'gain' ? amount : -amount;
    
    const updatedVaults = vaults.map(v => {
      if (v.id === activeVaultId) {
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          amount,
          type,
          description: description || (type === 'gain' ? 'Tribute' : 'Maintenance'),
          timestamp: Date.now(),
        };
        return {
          ...v,
          balance: v.balance + actualAmount,
          transactions: [newTransaction, ...v.transactions].slice(0, 15)
        };
      }
      return v;
    });

    setVaults(updatedVaults);
    setInputAmount('');
    setDescription('');
    audioService.playCoinSound(type === 'expense');
    
    setIsProcessing(true);
    const comment = await getTreasurerComment(activeVault.balance + actualAmount, actualAmount, activeVault.name);
    setTreasurerMsg(comment);
    setIsProcessing(false);
  };

  const startEditing = () => {
    setEditName(activeVault.name);
    setEditSubtitle(activeVault.subtitle);
    setIsEditingMetadata(true);
  };

  const saveMetadata = () => {
    const updatedVaults = vaults.map(v => 
      v.id === activeVaultId 
        ? { ...v, name: editName || v.name, subtitle: editSubtitle || v.subtitle } 
        : v
    );
    setVaults(updatedVaults);
    setIsEditingMetadata(false);
    setTreasurerMsg("The heralds have been notified of the name change.");
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'royal': return <Castle size={20} />;
      case 'bank': return <Landmark size={20} />;
      case 'forest': return <Sword size={20} />;
      case 'dragon': return <Flame size={20} />;
      case 'shadow': return <Skull size={20} />;
      default: return <Coins size={20} />;
    }
  };

  return (
    <div className={`min-h-screen ${activeVault.theme.bgClass} transition-colors duration-700 cinzel-font flex flex-col items-center p-4 md:p-8 overflow-x-hidden`}>
      
      {/* Vault Tabs */}
      <nav className="w-full max-w-6xl flex flex-wrap justify-center gap-2 mb-8 z-10">
        {vaults.map(v => (
          <button
            key={v.id}
            onClick={() => {
              setActiveVaultId(v.id);
              setIsEditingMetadata(false);
              setTreasurerMsg(`Inspecting ${v.name}...`);
            }}
            className={`
              flex items-center gap-2 px-6 py-3 border-b-4 transition-all active:scale-95
              ${activeVaultId === v.id 
                ? 'bg-[#3d2b1f] border-t-2 border-x-2 border-t-[#8b4513] border-x-[#8b4513] border-b-transparent translate-y-1' 
                : 'bg-[#1a120b] border-transparent opacity-60 hover:opacity-100 hover:bg-[#2c1e12]'}
            `}
            style={{ color: v.theme.primary, borderBottomColor: activeVaultId === v.id ? 'transparent' : v.theme.secondary }}
          >
            {renderIcon(v.theme.bannerIcon)}
            <span className="medieval-font font-bold uppercase tracking-wider text-xs md:text-sm">{v.name}</span>
          </button>
        ))}
      </nav>

      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-8 border-b-4 pb-4 group relative" style={{ borderColor: activeVault.theme.secondary }}>
        {!isEditingMetadata ? (
          <>
            <h1 className="pirata-font text-6xl md:text-8xl mb-2 tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ color: activeVault.theme.primary }}>
              {activeVault.name.toUpperCase()}
            </h1>
            <p className="medieval-font text-lg md:text-xl text-[#f4e4bc] italic opacity-80">
              {activeVault.subtitle}
            </p>
            <button 
              onClick={startEditing}
              className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-[#8b4513] hover:text-[#d4af37]"
              title="Edit Vault Details"
            >
              <PenTool size={24} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <input 
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="pirata-font text-5xl text-center bg-[#1a120b]/50 border-2 rounded p-2 focus:outline-none w-full max-w-xl"
              style={{ color: activeVault.theme.primary, borderColor: activeVault.theme.primary }}
              placeholder="Vault Name"
              autoFocus
            />
            <input 
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              className="medieval-font text-xl text-center bg-[#1a120b]/50 border-2 rounded p-2 focus:outline-none w-full max-w-lg"
              style={{ color: '#f4e4bc', borderColor: activeVault.theme.secondary }}
              placeholder="Vault Subtitle"
            />
            <div className="flex gap-4">
              <button 
                onClick={saveMetadata}
                className="flex items-center gap-2 px-4 py-2 bg-green-900 text-green-100 rounded hover:bg-green-800 transition-colors cinzel-font font-bold border border-green-500"
              >
                <Check size={18} /> SEAL CHANGES
              </button>
              <button 
                onClick={() => setIsEditingMetadata(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-900 text-red-100 rounded hover:bg-red-800 transition-colors cinzel-font font-bold border border-red-500"
              >
                <X size={18} /> DISCARD
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls & Treasurer */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Treasurer Card */}
          <div className="bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] bg-[#f4e4bc] border-8 border-[#5d3a1a] p-6 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
                {renderIcon(activeVault.theme.bannerIcon)}
            </div>
            <h2 className="cinzel-font text-2xl font-bold text-[#3d2b1f] mb-4 border-b-2 border-[#8b4513] pb-2 flex items-center gap-2">
              <ScrollText size={24} /> The Royal Ledger
            </h2>
            <div className="bg-[#3d2b1f]/10 p-4 rounded-md border border-[#8b4513]/30 min-h-[80px] flex items-center">
              <p className="medieval-font text-xl text-[#3d2b1f] italic leading-relaxed">
                {isProcessing ? "Dipping the quill..." : `"${treasurerMsg}"`}
              </p>
            </div>
          </div>

          {/* Ledger Inputs */}
          <div className="bg-[#2c1e12] border-4 p-6 rounded-sm shadow-xl space-y-4" style={{ borderColor: activeVault.theme.secondary }}>
            <h3 className="cinzel-font text-xl font-bold mb-2 flex items-center gap-2" style={{ color: activeVault.theme.primary }}>
              <Coins size={20} /> Amend the Records
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#f4e4bc] mb-1 medieval-font uppercase opacity-60">Gold Pieces</label>
                <input 
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1a120b] border-2 p-3 text-2xl rounded focus:outline-none transition-colors medieval-font"
                  style={{ borderColor: activeVault.theme.secondary, color: activeVault.theme.accent }}
                />
              </div>

              <div>
                <label className="block text-xs text-[#f4e4bc] mb-1 medieval-font uppercase opacity-60">Tribute Details</label>
                <input 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="The source of this coin..."
                  className="w-full bg-[#1a120b] border-2 p-3 text-lg text-[#f4e4bc] rounded focus:outline-none transition-colors medieval-font"
                  style={{ borderColor: activeVault.theme.secondary }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => handleTransaction('gain')}
                  className="p-4 font-bold border-2 shadow-lg active:scale-95 transition-all cinzel-font text-lg hover:brightness-125"
                  style={{ backgroundColor: activeVault.theme.secondary, color: activeVault.theme.accent, borderColor: activeVault.theme.primary }}
                >
                  DEPOSIT
                </button>
                <button 
                  onClick={() => handleTransaction('expense')}
                  className="bg-[#3a1a1a] hover:bg-[#5d1a1a] text-[#ff4d4d] p-4 font-bold border-2 border-[#ff4d4d] shadow-lg active:scale-95 transition-all cinzel-font text-lg"
                >
                  WITHDRAW
                </button>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="bg-[#1a120b]/50 border-4 p-6 rounded-sm shadow-xl" style={{ borderColor: activeVault.theme.secondary }}>
             <h3 className="cinzel-font text-lg font-bold text-[#f4e4bc] mb-4 flex items-center gap-2">
              <History size={18} /> Recent Filings
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {activeVault.transactions.length === 0 ? (
                <p className="text-[#5d3a1a] italic text-center medieval-font py-4">This scroll is blank.</p>
              ) : (
                activeVault.transactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center border-b border-[#5d3a1a] pb-2 last:border-0">
                    <div className="max-w-[70%]">
                      <p className="medieval-font text-[#f4e4bc] truncate">{t.description}</p>
                      <p className="text-[10px] text-[#5d3a1a]">{new Date(t.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <p className={`cinzel-font font-bold ${t.type === 'gain' ? 'text-[#ffd700]' : 'text-[#ff4d4d]'}`}>
                      {t.type === 'gain' ? '+' : '-'}{t.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Side: The Vault Visualization */}
        <section className="lg:col-span-7 flex flex-col items-center">
          
          {/* Balance Display */}
          <div className="w-full mb-4 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-[#2c1e12] border-4 p-8 text-center rounded-lg shadow-inner flex flex-col items-center justify-center transition-all duration-500" style={{ borderColor: activeVault.theme.primary }}>
            <span className="text-[#8b4513] uppercase tracking-widest font-bold cinzel-font text-sm mb-2 opacity-60">Vault Contents</span>
            <div className="flex items-center gap-4">
              <ShieldAlert className="animate-pulse" size={32} style={{ color: activeVault.theme.accent }} />
              <div className="pirata-font text-7xl md:text-9xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] transition-all duration-500" style={{ color: activeVault.theme.accent }}>
                {activeVault.balance.toLocaleString()}
              </div>
              <ShieldAlert className="animate-pulse" size={32} style={{ color: activeVault.theme.accent }} />
            </div>
            <span className="cinzel-font font-bold mt-2" style={{ color: activeVault.theme.primary }}>PIECES OF TREASURE</span>
          </div>

          {/* Gold Pile Canvas/SVG Area */}
          <div className="w-full relative bg-[#1a120b] border-4 rounded-lg p-4 shadow-inner overflow-hidden" style={{ borderColor: activeVault.theme.secondary }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brick-wall-dark.png')]" />
            <GoldPile balance={activeVault.balance} palette={activeVault.theme.coinPalette} />
          </div>

          <div className="mt-8 text-[#5d3a1a] text-xs medieval-font text-center italic max-w-sm px-4">
            "Every coin accounted for. Every debt paid in blood or gold. The {activeVault.name} never forgets."
          </div>
        </section>

      </main>

      {/* Decorative Corners */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t-8 border-l-8 opacity-30 pointer-events-none" style={{ borderColor: activeVault.theme.secondary }} />
      <div className="fixed top-0 right-0 w-32 h-32 border-t-8 border-r-8 opacity-30 pointer-events-none" style={{ borderColor: activeVault.theme.secondary }} />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 opacity-30 pointer-events-none" style={{ borderColor: activeVault.theme.secondary }} />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 opacity-30 pointer-events-none" style={{ borderColor: activeVault.theme.secondary }} />
    </div>
  );
};

export default App;
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
