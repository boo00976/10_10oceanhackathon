import React from 'react';
import { RefreshCw, BarChart3, Database, Activity, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefreshData,
  isRefreshing,
}) => {
  const tabs = [
    { id: 'radar', code: '01', label: '即時行情與市場雷達', en: 'MARKET RADAR', icon: BarChart3 },
    { id: 'data-eng', code: '02', label: '資料工程與品質實驗室', en: 'ETL QUALITY LAB', icon: Database },
    { id: 'macro-micro', code: '03', label: '宏微觀生產量產值分析', en: 'MACRO CROSS-SCALE', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c0c0e] border-b-2 border-[#e60012] text-white shadow-[0_6px_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
      {/* Top Graphic Caution Stripe (P5X signature black & yellow/red tape) */}
      <div className="bg-[#e60012] text-black px-4 py-1 text-xs font-black tracking-wider flex items-center justify-between font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="bg-black text-[#ffe600] px-1.5 py-0.2 text-[10px] uppercase font-black -skew-x-12">
            TAIWAN OCEAN HACKATHON
          </span>
          <span className="text-white font-black tracking-widest text-[11px] hidden sm:inline">
            // FISHDATA-TW · PHANTOM X PROTOCOL · KEELUNG ANCHOR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-white uppercase hidden md:inline">
            PILOT: 崁仔頂 / 八斗子夜間鮮魚拍賣
          </span>
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-black text-[#ffe600] hover:bg-[#ffe600] hover:text-black transition-colors px-2.5 py-0.5 rounded-none font-black text-[11px] cursor-pointer -skew-x-12"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* P5X Stylized Brand Logo */}
          <div
            onClick={() => setActiveTab('radar')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Iconic Flame / Mask Box */}
            <div className="w-11 h-11 bg-[#e60012] text-white flex items-center justify-center -skew-x-12 shadow-[3px_3px_0px_#ffffff] group-hover:bg-[#ffe600] group-hover:text-black transition-all">
              <Flame className="w-6 h-6 skew-x-12" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase font-['Plus_Jakarta_Sans'] text-white">
                  FISH<span className="text-[#e60012] group-hover:text-[#ffe600] transition-colors">DATA</span>
                  <span className="text-xs bg-white text-black px-1.5 py-0.2 ml-1.5 font-mono font-black not-italic -skew-x-12">
                    P5X
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase hidden sm:block">
                智慧漁業開放資料 // 即時市場雷達與算法中樞
              </p>
            </div>
          </div>

          {/* Dynamic Slanted Navigation Tabs (Persona 5 style) */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 font-black transition-all cursor-pointer -skew-x-12 ${
                    isActive
                      ? 'bg-[#e60012] text-white shadow-[4px_4px_0px_#ffffff]'
                      : 'bg-[#18181c] text-zinc-300 hover:bg-[#25252b] hover:text-white border border-zinc-800'
                  }`}
                >
                  <div className="skew-x-12 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-1 py-0.2 font-black ${
                        isActive ? 'bg-black text-[#ffe600]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {tab.code}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#ffe600]' : 'text-zinc-400'}`} />
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold tracking-tight">
                        {tab.label}
                      </div>
                      <div className={`text-[9px] font-mono uppercase tracking-wider hidden lg:block ${isActive ? 'text-black font-black' : 'text-zinc-500'}`}>
                        {tab.en}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
