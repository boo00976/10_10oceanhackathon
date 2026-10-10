import React, { useState } from 'react';
import { HACKATHON_PLAN_CONTENT } from '../data/fisheryConstants';
import { Award, Target, Cpu, CheckCircle2, DollarSign, TrendingUp, ShieldCheck, ChevronRight, Download, Eye, Sparkles } from 'lucide-react';

interface PitchDeckViewProps {
  onOpenAiAdvisor: (topic: string, promptType: string) => void;
}

export const PitchDeckView: React.FC<PitchDeckViewProps> = ({ onOpenAiAdvisor }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const plan = HACKATHON_PLAN_CONTENT;

  const slides = [
    { id: 'pain', title: '1. 痛點真實性與數據佐證', icon: Target, subtitle: '基隆崁仔頂魚市實況與產銷鏈路痛點' },
    { id: 'solution', title: '2. 解決方案與系統架構', icon: Cpu, subtitle: '高低頻跨尺度資料融合引擎' },
    { id: 'poc', title: '3. PoC 驗證與六週路線圖', icon: CheckCircle2, subtitle: '可重現之實驗指標與可行性閘門' },
    { id: 'market', title: '4. 市場規模與商業模式', icon: DollarSign, subtitle: 'TAM / SAM / SOM 與 B2G/B2B/B2C 定價' },
    { id: 'financial', title: '5. 財務預測與里程碑', icon: TrendingUp, subtitle: '3 年損益預估與損益平衡點 (Break-even)' },
    { id: 'esg', title: '6. ESG 永續與合規防錯', icon: ShieldCheck, subtitle: 'SDG 14、過漁預警與開放資料授權' },
  ];

  return (
    <div className="space-y-6">
      {/* Pitch Deck Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{plan.track} · 決賽 Pitch Deck</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              {plan.project_name}
            </h2>
            <p className="text-sm text-cyan-200/90 mt-1 max-w-3xl">
              {plan.pilot_anchor}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => onOpenAiAdvisor('模擬評審提問與答辯策略', 'JUDGE_DEFENSE')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>評審提問模擬答辯 (AI Defense)</span>
            </button>
          </div>
        </div>

        {/* Slide Navigation Stepper */}
        <div className="mt-6 pt-4 border-t border-cyan-900/40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {slides.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeSlide === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span className="truncate">{s.title.split(' ')[0]}</span>
                </div>
                <div className={`text-[10px] truncate ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide 1: Pain Points */}
      {activeSlide === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-400" />
              <span>痛點真實程度與客觀現象佐證（拒絕憑空假想）</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">依據農業部與基隆在地漁業調研</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.pain_points.map((pt, pIdx) => (
              <div
                key={pIdx}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 transition shadow-lg"
              >
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl inline-block">
                  <span className="font-mono text-xs font-bold text-rose-300">{pt.stat}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{pt.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pt.detail}</p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  <span className="font-semibold text-cyan-300 block mb-0.5">實地調研佐證：</span>
                  {pt.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide 2: Solution Architecture */}
      {activeSlide === 1 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>解決方案架構：端到端漁業資料互通中樞 (FishData Architecture)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              由下至上分層設計，兼顧資料品質治理、時序異常偵測與直覺 API 服務。
            </p>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Layer 1: Ingestion */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Layer 1: Ingestion
              </span>
              <h4 className="font-bold text-white text-sm">多源政府開放資料介接</h4>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>漁產品交易行情 API (每日高頻)</li>
                <li>CF0110 生產量 API (年度)</li>
                <li>CF0120 生產值 API (按縣市/漁業別)</li>
                <li>G74 漁會基本資料 API</li>
                <li>指數退避重試與快照存證</li>
              </ul>
            </div>

            {/* Layer 2: Transform */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Layer 2: Standardize
              </span>
              <h4 className="font-bold text-white text-sm">品質治理與別名映射</h4>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>ISO 8601 日期標準化 (民國曆互通)</li>
                <li>俗名/別名分詞映射字典 (F1: 99.0%)</li>
                <li>休市日缺失值插補與過濾</li>
                <li>複合主鍵唯一約束 (去重率 100%)</li>
                <li>未知魚名待核對隔離標記</li>
              </ul>
            </div>

            {/* Layer 3: Analytics */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Layer 3: Analytics
              </span>
              <h4 className="font-bold text-white text-sm">跨尺度融合與異常演算法</h4>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>Z-score 時序價格波動偏離警示</li>
                <li>跨市場價差套利雷達 (Arbitrage)</li>
                <li>宏觀生產量 vs 微觀拍賣價彈性</li>
                <li>過漁風險指標 (Volume Spike)</li>
                <li>Gemini 2.5 Flash 產銷診斷</li>
              </ul>
            </div>

            {/* Layer 4: Application */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Layer 4: Delivery
              </span>
              <h4 className="font-bold text-white text-sm">三端多元價值落地</h4>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>B2G: 漁業署產銷調控預警看板</li>
                <li>B2B: 餐飲/流通商採購避險 API</li>
                <li>B2C: 漁民免打字語音行情服務</li>
                <li>公眾: 當季低碳海鮮食魚指南</li>
                <li>開放標準 RESTful API</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Slide 3: PoC Verification */}
      {activeSlide === 2 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>PoC 可行性驗證與 6 週敏捷開發路線圖 (Feasibility Gate)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              以嚴謹的里程碑檢驗閘門取代空泛承諾，確保每一步驟皆可重現與交付。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.roadmap_six_weeks.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {step.week}
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已驗證通過</span>
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.task}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide 4: Market Size & Business Model */}
      {activeSlide === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* TAM / SAM / SOM */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>市場規模分析：TAM / SAM / SOM (以水產數位化與產銷避險為核心)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/40">
                <span className="text-xs font-mono text-slate-400">{plan.tam_sam_som.tam.label}</span>
                <div className="text-2xl font-black text-amber-300 font-['JetBrains_Mono'] my-1">
                  {plan.tam_sam_som.tam.value}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{plan.tam_sam_som.tam.description}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-cyan-900/40">
                <span className="text-xs font-mono text-slate-400">{plan.tam_sam_som.sam.label}</span>
                <div className="text-2xl font-black text-cyan-300 font-['JetBrains_Mono'] my-1">
                  {plan.tam_sam_som.sam.value}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{plan.tam_sam_som.sam.description}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/40">
                <span className="text-xs font-mono text-slate-400">{plan.tam_sam_som.som.label}</span>
                <div className="text-2xl font-black text-emerald-300 font-['JetBrains_Mono'] my-1">
                  {plan.tam_sam_som.som.value}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{plan.tam_sam_som.som.description}</p>
              </div>
            </div>
          </div>

          {/* Business Models Matrix */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              多層級商業模式設計 (B2G / B2B / B2C)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plan.business_models.map((bm, bIdx) => (
                <div key={bIdx} className="p-4.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">{bm.tier}</span>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 block mb-0.5">目標客戶：</span>
                    <span className="font-semibold text-white">{bm.target}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 block mb-0.5">核心服務：</span>
                    {bm.features}
                  </div>
                  <div className="p-2.5 bg-cyan-950/40 rounded-lg border border-cyan-800/40 text-xs text-cyan-200">
                    <span className="font-bold block mb-0.5">獲利模式：</span>
                    {bm.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide 5: Financials & 3-Year Roadmap */}
      {activeSlide === 4 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>財務預測、損益平衡點 (Break-even at M18) 與三年擴展規劃</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              以精簡團隊（架構師、資料工程師、BD 商務代表）為核心，前 18 個月以 PoC 專案營收為基石。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.financial_projections.map((fin, fIdx) => (
              <div key={fIdx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-sm text-cyan-400 block font-mono">{fin.year}</span>
                <div className="grid grid-cols-3 gap-1 text-xs font-mono p-2 bg-slate-900 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 block">預估營收</span>
                    <span className="font-bold text-white">{fin.revenue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">營運成本</span>
                    <span className="font-bold text-slate-400">{fin.cost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">預估淨利</span>
                    <span className="font-bold text-emerald-400">{fin.profit}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-sans">
                  <span className="text-slate-500 block mb-0.5">關鍵里程碑：</span>
                  {fin.milestone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide 6: ESG & Compliance */}
      {activeSlide === 5 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>ESG 海洋永續、SDG 14 實踐與資安合規機制</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              遵守黑客松「實質海洋相關性」原則，引導當季盛產與在地減碳，恪守政府開放資料法遵規範。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.esg_compliance.map((item, eIdx) => (
              <div key={eIdx} className="p-4.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {item.code}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>合規指標已納入</span>
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
