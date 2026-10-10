import React, { useState } from 'react';
import { AnnualProductionItem, FishermenAssociation } from '../types/fishery';
import { Activity, BarChart, Users, Anchor, ChevronRight, Landmark } from 'lucide-react';

interface MacroMicroViewProps {
  annualData: AnnualProductionItem[];
  associations: FishermenAssociation[];
}

export const MacroMicroView: React.FC<MacroMicroViewProps> = ({
  annualData,
  associations,
}) => {
  const [selectedCounty, setSelectedCounty] = useState<string>('基隆市');

  // Filter for selected county
  const countyRecords = annualData.filter((d) => d.county === selectedCounty);
  const keelungData = annualData.filter((d) => d.county === '基隆市');

  const totalCountyProduction = countyRecords.reduce((acc, curr) => acc + curr.production_mt, 0);
  const totalCountyValue = countyRecords.reduce((acc, curr) => acc + curr.production_val_million, 0);
  const totalCountyFishers = countyRecords.reduce((acc, curr) => acc + curr.fisher_population, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>跨尺度宏微觀數據勾稽 · CF0110 生產量 × CF0120 生產值 × 114年漁業統計年報</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              宏觀產業結構與高頻市場行情的互補性研究 (RQ4)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              破解「市場交易量 ≠ 當地生產量」與「拍賣批發價 ≠ 漁民產地實收價」的學術分析鴻溝。
            </p>
          </div>

          {/* County Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">觀測縣市：</span>
            <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
              {['基隆市', '宜蘭縣', '高雄市', '屏東縣', '澎湖縣'].map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedCounty === county
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {county} {county === '基隆市' && '(試點)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Scale Reconciling Insight Banner */}
      <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-2xl p-4.5">
        <h4 className="font-bold text-cyan-300 text-sm mb-1 flex items-center gap-2">
          <span>跨尺度研究限制與因果推論防錯聲明（嚴格遵守學術合規）</span>
        </h4>
        <p className="text-xs text-cyan-200/80 leading-relaxed">
          微觀每日拍賣資料反映的是「短期供需與季節鮮食行情」，受冷鏈調度、外縣市魚貨進口影響；而宏觀年度統計反映的是「行政轄區註冊漁船與養殖登記之年產量與產值」。
          本平台採用兩者作為「供給端趨勢（產量增減）」與「需求端價格彈性」的交叉驗證依據，而非直接等同加總，符合嚴謹資料科學範式。
        </p>
      </div>

      {/* Selected County Macro Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">年度漁業總產量 (CF0110)</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-white font-['JetBrains_Mono']">
              {totalCountyProduction.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">公噸 (MT)</span>
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block">
            {selectedCounty === '基隆市' ? '近海漁獲佔比 89.4%' : '含各漁業類別彙總'}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">年度漁業總產值 (CF0120)</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-cyan-400 font-['JetBrains_Mono']">
              NT$ {totalCountyValue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">百萬元</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            折合新台幣 {Number((totalCountyValue / 10).toFixed(1))} 億元
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">登記漁戶人口規模 (114年報)</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-amber-300 font-['JetBrains_Mono']">
              {totalCountyFishers.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">人</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            以基隆區漁會及主要港口服務對象為骨幹
          </span>
        </div>
      </div>

      {/* Production Breakdown Breakdown Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <BarChart className="w-4 h-4 text-cyan-400" />
          <span>{selectedCounty} 漁業類別結構剖析 (CF0110/CF0120 實測結構)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">漁業分類 (Fishery Type)</th>
                <th className="py-3 px-4">產量 (公噸)</th>
                <th className="py-3 px-4">產值 (百萬元 NTD)</th>
                <th className="py-3 px-4">漁戶人口數</th>
                <th className="py-3 px-4">代表主要魚種</th>
                <th className="py-3 px-4">產業特色與產地脈絡</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {countyRecords.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-cyan-300 font-sans">{item.fishery_type}</td>
                  <td className="py-3 px-4 text-white font-bold">{item.production_mt.toLocaleString()} MT</td>
                  <td className="py-3 px-4 text-amber-300 font-bold">NT$ {item.production_val_million}M</td>
                  <td className="py-3 px-4 text-slate-300">{item.fisher_population.toLocaleString()} 人</td>
                  <td className="py-3 px-4 font-sans text-slate-200">{item.main_species.join('、')}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{item.highlights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fishermen Association Network Section (G74) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span>漁會組織基本資料網絡 (API UnitId=G74: 資料協作與落地服務端)</span>
            </h3>
            <p className="text-xs text-slate-400">
              各級漁會是行情資訊落地的最後一哩路，支持漁民手機免打字語音廣播與產銷履歷驗證。
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">G74 漁業署官方資料集</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associations.map((fa) => {
            const isPilot = fa.county === '基隆市';
            return (
              <div
                key={fa.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPilot
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{fa.name}</span>
                    {isPilot && (
                      <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                        試點示範
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">{fa.county}</span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>會員人數：<span className="text-white font-bold">{fa.members.toLocaleString()} 人</span></div>
                  <div>作業漁船數：<span className="text-white font-bold">{fa.boats.toLocaleString()} 艘</span></div>
                  <div className="text-[11px] text-slate-400 font-sans truncate">地址：{fa.address}</div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500 block mb-1">核心產銷功能：</span>
                  <div className="flex flex-wrap gap-1">
                    {fa.services.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
