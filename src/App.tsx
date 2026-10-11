/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketRadarView } from './components/MarketRadarView';
import { DataEngineeringView } from './components/DataEngineeringView';
import { MacroMicroView } from './components/MacroMicroView';
import { VesselRadarView } from './components/VesselRadarView';
import { FishPriceRecord, MarketInfo, FishSpecies, AnnualProductionItem, FishermenAssociation, DataQualityReport } from './types/fishery';
import { SPECIES_CATALOG, MARKETS_CATALOG } from './types/fisheryConstants';
import { getFishPrices, ANNUAL_PRODUCTION_DATA, FISHERMEN_ASSOCIATIONS, DATA_QUALITY_METRICS } from './services/fisheryService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('radar'); // Default: 即時行情與市場雷達 (Market Radar)
  const [prices, setPrices] = useState<FishPriceRecord[]>(() => getFishPrices());
  const [markets, setMarkets] = useState<MarketInfo[]>(MARKETS_CATALOG);
  const [species, setSpecies] = useState<FishSpecies[]>(SPECIES_CATALOG);
  const [annualData, setAnnualData] = useState<AnnualProductionItem[]>(ANNUAL_PRODUCTION_DATA);
  const [associations, setAssociations] = useState<FishermenAssociation[]>(FISHERMEN_ASSOCIATIONS);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(DATA_QUALITY_METRICS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTestingPipeline, setIsTestingPipeline] = useState<boolean>(false);

  // Load or sync data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // 嘗試調用 API；若純前端模式則直接同步本地服務數據
      const pRes = await fetch('/api/fish/prices');
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.data) {
          setPrices(pData.data);
          if (pData.markets) setMarkets(pData.markets);
          if (pData.species) setSpecies(pData.species);
        }
      } else {
        setPrices(getFishPrices());
      }
    } catch {
      setPrices(getFishPrices());
      setAnnualData(ANNUAL_PRODUCTION_DATA);
      setAssociations(FISHERMEN_ASSOCIATIONS);
      setQualityReport(DATA_QUALITY_METRICS);
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

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100 flex flex-col font-['Noto_Sans_TC',sans-serif] selection:bg-[#e60012] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Live Market & Arbitrage Radar (P5X Market Radar) */}
        {activeTab === 'radar' && (
          <MarketRadarView
            prices={prices}
            markets={markets}
            species={species}
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

        {/* Tab 4: Vessel Radar (GFW AIS Telemetry - main.py Python integration) */}
        {activeTab === 'vessel' && (
          <VesselRadarView
            onLinkToMarketRadar={() => setActiveTab('radar')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e12] border-t-2 border-[#e60012] text-zinc-400 py-6 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-black">
              <span>FISHDATA-TW // PHANTOM X PROTOCOL</span>
              <span className="text-[10px] bg-[#e60012] text-black px-1.5 py-0.2 font-black -skew-x-12">
                2026 TAIWAN OCEAN
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              資料來源：農業部水產品交易行情 API (AquaticTransData)、CF0110 漁業生產量、CF0120 漁業生產值、G74 漁會統計、民國114年漁業統計年報。
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="text-zinc-300">ODGL 1.0 合規</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[#ffe600] font-bold">基隆崁仔頂試點</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white">南北俗名對齊演算法</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
