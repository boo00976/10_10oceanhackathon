/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketRadarView } from './components/MarketRadarView';
import { DataEngineeringView } from './components/DataEngineeringView';
import { MacroMicroView } from './components/MacroMicroView';
import { PitchDeckView } from './components/PitchDeckView';
import { GeminiAdvisorView } from './components/GeminiAdvisorView';
import { FishPriceRecord, MarketInfo, FishSpecies, AnnualProductionItem, FishermenAssociation, DataQualityReport } from './types/fishery';
import { SPECIES_CATALOG, MARKETS_CATALOG } from './data/fisheryConstants';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('radar');
  const [demoMode, setDemoMode] = useState<boolean>(true); // Default ON for hackathon judges!
  const [prices, setPrices] = useState<FishPriceRecord[]>([]);
  const [markets, setMarkets] = useState<MarketInfo[]>(MARKETS_CATALOG);
  const [species, setSpecies] = useState<FishSpecies[]>(SPECIES_CATALOG);
  const [annualData, setAnnualData] = useState<AnnualProductionItem[]>([]);
  const [associations, setAssociations] = useState<FishermenAssociation[]>([]);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTestingPipeline, setIsTestingPipeline] = useState<boolean>(false);

  // Gemini state bridge from other tabs
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiType, setAiType] = useState<string>('MARKET_ANALYSIS');

  // Load all foundational data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Prices
      const pRes = await fetch('/api/fish/prices');
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.data) {
          setPrices(pData.data);
          if (pData.markets) setMarkets(pData.markets);
          if (pData.species) setSpecies(pData.species);
        }
      }

      // 2. Fetch Annual Production
      const prodRes = await fetch('/api/fish/annual-production');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.data) setAnnualData(prodData.data);
      }

      // 3. Fetch Fishermen Associations
      const faRes = await fetch('/api/fish/associations');
      if (faRes.ok) {
        const faData = await faRes.json();
        if (faData.data) setAssociations(faData.data);
      }

      // 4. Fetch Quality Report
      const qRes = await fetch('/api/fish/quality-report');
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.data) setQualityReport(qData.data);
      }
    } catch (err) {
      console.warn('Using client memory cache fallback:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunPipelineTest = async () => {
    setIsTestingPipeline(true);
    try {
      await fetch('/api/fish/connectivity-test');
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingPipeline(false);
    }
  };

  const handleOpenAiAdvisor = (termOrTopic: string, promptType: string) => {
    setAiPrompt(`請針對目前專案核心議題（${termOrTopic}），以 2026 臺灣海洋黑客松評審標準提供深入成因分析與防禦策略。`);
    setAiType(promptType);
    setActiveTab('ai-advisor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Noto_Sans_TC',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        onRefreshData={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Judge Demo Alert Helper (Visible when demo mode is ON) */}
        {demoMode && (
          <div className="mb-6 bg-gradient-to-r from-amber-950/50 via-slate-900 to-cyan-950/50 border border-amber-500/30 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black font-mono">
                評審快速指引
              </span>
              <p className="text-slate-300">
                本展示依據「2026 臺灣海洋黑客松」評審標準設計：包含<strong className="text-white">【技術面】</strong>真實資料工程 ETL、E1~E4 指標實測、基隆跨市場比價；與<strong className="text-white">【企劃面】</strong>痛點數據佐證、TAM/SAM/SOM、3年財務預測及 SDG 14 永續海洋。
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('pitch-deck')}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
              >
                直接查看商業企劃 Deck
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Live Market & Arbitrage Radar */}
        {activeTab === 'radar' && (
          <MarketRadarView
            prices={prices}
            markets={markets}
            species={species}
            demoMode={demoMode}
            onOpenAiAdvisor={handleOpenAiAdvisor}
          />
        )}

        {/* Tab 2: Data Engineering & Quality Lab (RQ1~RQ4, E1~E4) */}
        {activeTab === 'data-eng' && qualityReport && (
          <DataEngineeringView
            qualityReport={qualityReport}
            onRunTest={handleRunPipelineTest}
            isTesting={isTestingPipeline}
          />
        )}

        {/* Tab 3: Macro-Micro Cross Scale (CF0110/CF0120) */}
        {activeTab === 'macro-micro' && (
          <MacroMicroView
            annualData={annualData}
            associations={associations}
          />
        )}

        {/* Tab 4: Hackathon Pitch Deck & Business Plan */}
        {activeTab === 'pitch-deck' && (
          <PitchDeckView onOpenAiAdvisor={handleOpenAiAdvisor} />
        )}

        {/* Tab 5: Gemini AI Strategy Advisor */}
        {activeTab === 'ai-advisor' && (
          <GeminiAdvisorView
            initialPrompt={aiPrompt}
            initialType={aiType}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold">
              <span>FishData-TW 台灣智慧漁業開放資料與決策分析平台</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">
                2026 臺灣海洋黑客松
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              資料來源：農業部農業資料開放平臺 (AquaticTransData、CF0110 漁業生產量、CF0120 漁業生產值、G74 漁會統計、民國114年漁業統計年報)。
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>遵循政府資料開放授權條款 (ODGL 1.0)</span>
            <span>·</span>
            <span>基隆區漁會試點示範</span>
            <span>·</span>
            <span>SDG 14 水下生命永續</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
