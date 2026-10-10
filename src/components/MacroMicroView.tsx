import React, { useState } from 'react';
import { AnnualProductionItem, FishermenAssociation } from '../types/fishery';
import { BarChart, Landmark } from 'lucide-react';

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

  const totalCountyProduction = countyRecords.reduce((acc, curr) => acc + curr.production_mt, 0);
  const totalCountyValue = countyRecords.reduce((acc, curr) => acc + curr.production_val_million, 0);
  const totalCountyFishers = countyRecords.reduce((acc, curr) => acc + curr.fisher_population, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121216] border-2 border-[#e60012] p-5 shadow-[6px_6px_0px_#000000] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full p5-stripes pointer-events-none opacity-40" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="bg-[#e60012] text-black font-black px-1.5 py-0.2 -skew-x-12">
                MACRO // 03
              </span>
              <span className="text-[#ffe600] font-bold">CF0110 × CF0120 × 114年漁業統計年報</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase font-['Plus_Jakarta_Sans']">
              宏觀產業結構與高頻市場行情的互補性研究 (RQ4)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              破解「市場交易量 ≠ 當地生產量」與「拍賣批發價 ≠ 漁民產地實收價」的學術分析邊界。
            </p>
          </div>

          {/* County Selector (P5X style) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase">COUNTY:</span>
            <div className="inline-flex bg-black p-1 border border-zinc-700">
              {['基隆市', '宜蘭縣', '高雄市', '屏東縣', '澎湖縣'].map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={`px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                    selectedCounty === county
                      ? 'bg-[#e60012] text-white shadow-[2px_2px_0px_#ffffff]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {county} {county === '基隆市' && '(試點)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Caution Callout */}
      <div className="bg-black border-2 border-[#ffe600] p-4.5 font-mono text-xs shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2 text-[#ffe600] font-black mb-1">
          <span className="bg-[#ffe600] text-black px-1.5 py-0.2 -skew-x-12">CAUTION</span>
          <span>跨尺度研究限制與因果推論防錯聲明</span>
        </div>
        <p className="text-zinc-300 leading-relaxed font-sans text-xs">
          微觀每日拍賣資料反映的是「短期供需與季節鮮食行情」，受外縣市魚貨進口調度影響；宏觀年度統計反映的是「行政轄區註冊漁船年產量」。
          本平台採用兩者作為「供給端趨勢（產量增減）」與「需求端價格彈性」的交叉驗證依據，而非直接等同加總。
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#121216] border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_#000000]">
          <span className="text-xs text-zinc-400 block mb-1 uppercase">// ANNUAL PRODUCTION (CF0110)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {totalCountyProduction.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">MT (公噸)</span>
          </div>
          <span className="text-[11px] text-[#ffe600] mt-1 block">
            {selectedCounty === '基隆市' ? '近海漁獲佔比 89.4%' : '含各漁業類別彙總'}
          </span>
        </div>

        <div className="bg-[#121216] border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_#000000]">
          <span className="text-xs text-zinc-400 block mb-1 uppercase">// ANNUAL VALUE (CF0120)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#e60012]">
              NT$ {totalCountyValue.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">百萬元</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            折合新台幣 {Number((totalCountyValue / 10).toFixed(1))} 億元
          </span>
        </div>

        <div className="bg-[#121216] border-2 border-zinc-800 p-4 shadow-[4px_4px_0px_#000000]">
          <span className="text-xs text-zinc-400 block mb-1 uppercase">// FISHER POPULATION (114)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#00e676]">
              {totalCountyFishers.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">人</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            以各級區漁會登記服務人口為骨幹
          </span>
        </div>
      </div>

      {/* Production Breakdown Table */}
      <div className="bg-[#121216] border-2 border-zinc-800 p-5 shadow-[6px_6px_0px_#000000]">
        <h3 className="font-black text-white text-base mb-4 font-mono uppercase flex items-center gap-2">
          <BarChart className="w-4 h-4 text-[#e60012]" />
          <span>{selectedCounty} 漁業類別結構剖析 (CF0110 / CF0120 實測結構)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black text-zinc-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">漁業分類 (FISHERY TYPE)</th>
                <th className="py-3 px-4">產量 (公噸)</th>
                <th className="py-3 px-4">產值 (百萬元 NTD)</th>
                <th className="py-3 px-4">漁戶人口數</th>
                <th className="py-3 px-4">代表主要魚種</th>
                <th className="py-3 px-4">產業特色與產地脈絡</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {countyRecords.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60">
                  <td className="py-3 px-4 font-bold text-white font-sans">{item.fishery_type}</td>
                  <td className="py-3 px-4 text-[#ffe600] font-black">{item.production_mt.toLocaleString()} MT</td>
                  <td className="py-3 px-4 text-[#e60012] font-black">NT$ {item.production_val_million}M</td>
                  <td className="py-3 px-4 text-zinc-300">{item.fisher_population.toLocaleString()} 人</td>
                  <td className="py-3 px-4 font-sans text-zinc-200">{item.main_species.join('、')}</td>
                  <td className="py-3 px-4 font-sans text-zinc-400">{item.highlights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fishermen Association Network Section (G74) */}
      <div className="bg-[#121216] border-2 border-zinc-800 p-5 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <div>
            <h3 className="font-black text-white text-base font-mono uppercase flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#e60012]" />
              <span>漁會組織基本資料網絡 (API UNITID=G74)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              各級漁會是行情資訊落地的最後一哩路，支持漁民手機免打字行情推播與產銷履歷驗證。
            </p>
          </div>
          <span className="text-xs font-mono text-[#ffe600] font-bold">G74 MOA API</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associations.map((fa) => {
            const isPilot = fa.county === '基隆市';
            return (
              <div
                key={fa.id}
                className={`p-4 border transition-all ${
                  isPilot
                    ? 'bg-black border-[#e60012] shadow-[4px_4px_0px_#e60012]'
                    : 'bg-[#18181c] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-sm text-white flex items-center gap-1.5 font-mono">
                    <span>{fa.name}</span>
                    {isPilot && (
                      <span className="text-[10px] bg-[#e60012] text-black font-black px-1.5 py-0.2 -skew-x-12">
                        PILOT
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-zinc-400 font-mono">{fa.county}</span>
                </div>

                <div className="text-xs text-zinc-300 space-y-1 font-mono">
                  <div>會員人數：<span className="text-white font-bold">{fa.members.toLocaleString()} 人</span></div>
                  <div>作業漁船數：<span className="text-white font-bold">{fa.boats.toLocaleString()} 艘</span></div>
                  <div className="text-[11px] text-zinc-400 font-sans truncate">地址：{fa.address}</div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[11px]">
                  <span className="text-zinc-500 block mb-1 font-mono">// SERVICES:</span>
                  <div className="flex flex-wrap gap-1">
                    {fa.services.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 bg-black border border-zinc-800 text-zinc-300 text-[10px] font-mono"
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
