import React from 'react';
import { Waves, Activity, Sparkles, Database, BarChart3, Award, Bot, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  demoMode,
  setDemoMode,
  onRefreshData,
  isRefreshing,
}) => {
  const tabs = [
    { id: 'radar', label: '即時行情與比價雷達', icon: BarChart3, badge: '高頻微觀' },
    { id: 'data-eng', label: '資料工程與品質實驗室', icon: Database, badge: 'RQ1~4' },
    { id: 'macro-micro', label: '宏微觀跨尺度分析', icon: Activity, badge: 'CF0110/20' },
    { id: 'pitch-deck', label: '黑客松商業企劃專區', icon: Award, badge: '2026競賽' },
    { id: 'ai-advisor', label: 'Gemini 智慧海洋智庫', icon: Bot, badge: 'AI賦能' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-cyan-900/40 text-slate-100">
      {/* Top Banner: Hackathon & Pilot Announcement */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 px-4 py-1.5 border-b border-cyan-800/30 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-medium text-cyan-300">2026 臺灣海洋黑客松競賽專案</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-300 hidden sm:inline">以基隆市場（崁仔頂/八斗子）為核心試點，跨尺度串接全台開放資料</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors py-0.5 px-2 rounded cursor-pointer"
              title="重新同步開放資料快照"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="text-[11px] font-mono">Sync API</span>
            </button>

            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                demoMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{demoMode ? '評審簡報 Demo 模式: ON' : '切換評審展示模式'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  FishData<span className="text-cyan-400">-TW</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Keelung Pilot v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden md:block">
                台灣智慧漁業開放資料整合 · 品質評估 · 跨尺度產銷決策
              </p>
            </div>
          </div>

          {/* Navigation Items (Zero-pill, clean active borders) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
