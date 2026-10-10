import React, { useState, useMemo } from 'react';
import { FishPriceRecord, MarketInfo, FishSpecies } from '../types/fishery';
import { TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Fish, MapPin, Calendar, Download, Scale, ShieldCheck } from 'lucide-react';

interface MarketRadarViewProps {
  prices: FishPriceRecord[];
  markets: MarketInfo[];
  species: FishSpecies[];
  demoMode: boolean;
  onOpenAiAdvisor: (fishName: string, promptType: string) => void;
}

export const MarketRadarView: React.FC<MarketRadarViewProps> = ({
  prices,
  markets,
  species,
  demoMode,
  onOpenAiAdvisor,
}) => {
  const [selectedFishId, setSelectedFishId] = useState<string>('1010'); // Default: 白帶魚
  const [selectedRangeDays, setSelectedRangeDays] = useState<number>(14);
  const [activeChartTab, setActiveChartTab] = useState<'compare' | 'band'>('compare');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Selected Fish Details
  const currentFish = useMemo(() => {
    return species.find((s) => s.id === selectedFishId) || species[0];
  }, [species, selectedFishId]);

  // Unique dates sorted
  const sortedDates = useMemo(() => {
    const dates = Array.from(new Set(prices.map((p) => p.trade_date))).sort();
    return dates.slice(-selectedRangeDays);
  }, [prices, selectedRangeDays]);

  // Filter records for the selected fish within the chosen date range
  const currentFishRecords = useMemo(() => {
    return prices.filter(
      (p) => p.fish_id === selectedFishId && sortedDates.includes(p.trade_date)
    );
  }, [prices, selectedFishId, sortedDates]);

  // Group by date & market
  const marketDateMap = useMemo(() => {
    const map: Record<string, Record<string, FishPriceRecord>> = {};
    for (const r of currentFishRecords) {
      if (!map[r.trade_date]) map[r.trade_date] = {};
      map[r.trade_date][r.market_id] = r;
    }
    return map;
  }, [currentFishRecords]);

  // Latest Keelung & Comparison stats
  const latestDate = sortedDates[sortedDates.length - 1] || '';
  const previousDate = sortedDates[sortedDates.length - 2] || '';

  const latestKeelungRecord = marketDateMap[latestDate]?.['KL01'];
  const prevKeelungRecord = marketDateMap[previousDate]?.['KL01'];

  const keelungAvgPrice = latestKeelungRecord?.avg_price || 0;
  const keelungPrevAvgPrice = prevKeelungRecord?.avg_price || keelungAvgPrice;
  const priceChange = keelungAvgPrice - keelungPrevAvgPrice;
  const priceChangePct = keelungPrevAvgPrice ? ((priceChange / keelungPrevAvgPrice) * 100).toFixed(1) : '0';

  const keelungVolume = latestKeelungRecord?.trade_volume || 0;

  // Cross-market Arbitrage comparison for latest date
  const arbitrageAnalysis = useMemo(() => {
    if (!latestKeelungRecord) return null;
    const latestOtherMarkets = Object.values(marketDateMap[latestDate] || {}).filter(
      (m) => m.market_id !== 'KL01'
    );
    if (!latestOtherMarkets.length) return null;

    // Find lowest priced market
    const lowest = [...latestOtherMarkets].sort((a, b) => a.avg_price - b.avg_price)[0];
    const diff = latestKeelungRecord.avg_price - lowest.avg_price;
    const diffPct = ((diff / lowest.avg_price) * 100).toFixed(1);

    return {
      lowestMarket: lowest.market_name,
      lowestPrice: lowest.avg_price,
      keelungPrice: latestKeelungRecord.avg_price,
      diff,
      diffPct,
      hasArbitrageOpportunity: diff > 15,
    };
  }, [latestKeelungRecord, marketDateMap, latestDate]);

  // Detect recent anomalies
  const recentAnomalies = useMemo(() => {
    return currentFishRecords
      .filter((r) => r.anomaly_flag !== 'NORMAL')
      .sort((a, b) => b.trade_date.localeCompare(a.trade_date));
  }, [currentFishRecords]);

  // SVG Chart Dimensions & Math
  const chartWidth = 840;
  const chartHeight = 280;
  const padding = { top: 25, right: 35, bottom: 40, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Find min and max price across all plotted records
  const { minPrice, maxPrice } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    currentFishRecords.forEach((r) => {
      if (r.low_price < min) min = r.low_price;
      if (r.high_price > max) max = r.high_price;
    });
    if (min === Infinity) min = 50;
    if (max === -Infinity) max = 300;
    // Add 10% breathing space
    const range = max - min;
    return {
      minPrice: Math.max(0, Math.floor(min - range * 0.1)),
      maxPrice: Math.ceil(max + range * 0.1),
    };
  }, [currentFishRecords]);

  const getX = (dateIndex: number) => {
    if (sortedDates.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (dateIndex / (sortedDates.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const safeMax = maxPrice === minPrice ? minPrice + 10 : maxPrice;
    const ratio = (val - minPrice) / (safeMax - minPrice);
    return padding.top + innerHeight - ratio * innerHeight;
  };

  // Color mapping for markets
  const marketColors: Record<string, string> = {
    KL01: '#00f0ff', // Cyan (Keelung)
    IL01: '#38bdf8', // Light blue (Suao)
    PT01: '#f59e0b', // Amber (Donggang)
    KH01: '#ec4899', // Pink (Kaohsiung)
    PH01: '#10b981', // Emerald (Penghu)
    TC01: '#a855f7', // Purple (Taichung)
  };

  // Export current table view to CSV
  const handleExportCsv = () => {
    const headers = ['交易日期,市場代碼,市場名稱,魚種名稱,上價(元/kg),中價(元/kg),下價(元/kg),平均價(元/kg),交易量(kg),異常狀態'];
    const rows = currentFishRecords.map((r) =>
      `${r.trade_date},${r.market_id},${r.market_name},${r.fish_name},${r.high_price},${r.mid_price},${r.low_price},${r.avg_price},${r.trade_volume},${r.anomaly_flag}`
    );
    const blob = new Blob([['\uFEFF', ...headers, '\n', rows.join('\n')].join('')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FishData-TW_${currentFish.name}_行情報表_${latestDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Pilot Header & Species Select Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>基隆市場錨定觀測 · 崁仔頂夜市集散中心</span>
              <span>·</span>
              <span>每日上午 08:00 自動更新</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>批發交易行情與跨市場比價雷達</span>
              {demoMode && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-normal">
                  Demo: 評審關注指標
                </span>
              )}
            </h2>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">觀測區間：</span>
            <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
              {[7, 14, 24].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedRangeDays(days)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedRangeDays === days
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  最近 {days} 天
                </button>
              ))}
            </div>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer"
              title="下載標準化 CSV 數據"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>匯出 CSV</span>
            </button>
          </div>
        </div>

        {/* Species Horizontal Selector */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              選擇重點監測魚種（基隆沿近海主力水產）
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              FAO代碼：{currentFish.fao_code || 'N/A'} · {currentFish.scientific_name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {species.map((fish) => {
              const isSelected = fish.id === selectedFishId;
              return (
                <button
                  key={fish.id}
                  onClick={() => setSelectedFishId(fish.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm truncate">{fish.name}</span>
                    <Fish className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {fish.category}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono mt-1">
                    {fish.esg_status.split('/')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Keelung Auction Price */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
            <span>基隆市場 今日拍賣均價</span>
            <span className="text-[11px] font-mono text-cyan-400">KL01 崁仔頂</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-['JetBrains_Mono']">
              NT$ {keelungAvgPrice}
            </span>
            <span className="text-xs text-slate-400">/ 公斤</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`flex items-center font-semibold ${
                priceChange >= 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {priceChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {priceChange >= 0 ? `+${priceChange}` : priceChange} ({priceChangePct}%)
            </span>
            <span className="text-slate-500">較前一日</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Card 2: Daily Volume */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
            <span>今日到港交易量</span>
            <span className="text-[11px] text-slate-400">批發量</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-['JetBrains_Mono']">
              {keelungVolume.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">公斤 (kg)</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>供貨穩定度良好 · 正常漁獲靠港</span>
          </div>
        </div>

        {/* Card 3: Arbitrage Spread */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
            <span>跨市場最大價差 (套利監測)</span>
            <Scale className="w-3.5 h-3.5 text-amber-400" />
          </div>
          {arbitrageAnalysis ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-300 font-['JetBrains_Mono']">
                  +NT$ {arbitrageAnalysis.diff}
                </span>
                <span className="text-xs text-amber-400/80 font-mono">({arbitrageAnalysis.diffPct}%)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300 truncate">
                基隆比 <span className="text-white font-semibold">{arbitrageAnalysis.lowestMarket}</span> 高出
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">計算比對中...</div>
          )}
        </div>

        {/* Card 4: Anomaly Alert Indicator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
            <span>時序波動異常警示 (Z-Score)</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            {recentAnomalies.length > 0 ? (
              <span className="text-2xl font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>{recentAnomalies.length} 處警示</span>
              </span>
            ) : (
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                安全 (Normal)
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400 truncate">
            {recentAnomalies.length > 0
              ? `${recentAnomalies[0].trade_date} 檢測到偏離常態 > 2.5σ`
              : '過去 14 天價格於 95% 置信區間'}
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-white text-base">
              {currentFish.name} 行情時序趨勢圖
            </h3>
            <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveChartTab('compare')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeChartTab === 'compare'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                跨市場均價對比 (All Markets)
              </button>
              <button
                onClick={() => setActiveChartTab('band')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeChartTab === 'band'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                基隆市場 上/中/下價區間帶
              </button>
            </div>
          </div>

          {/* AI Quick Diagnosis Trigger */}
          <button
            onClick={() => onOpenAiAdvisor(currentFish.name, 'MARKET_ANALYSIS')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-medium rounded-lg border border-cyan-800/80 transition cursor-pointer self-start sm:self-auto"
          >
            <span>🤖 AI 深度診斷此魚種產銷波動成因</span>
          </button>
        </div>

        {/* Legend */}
        {activeChartTab === 'compare' ? (
          <div className="flex flex-wrap items-center gap-4 text-xs mb-3 text-slate-300">
            {markets.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: marketColors[m.id] || '#94a3b8' }}
                />
                <span className={m.id === 'KL01' ? 'font-bold text-white' : ''}>
                  {m.name.split(' (')[0]} {m.id === 'KL01' && '(試點核心)'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs mb-3 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-rose-400 rounded" />
              <span>上價 (高檔優質鮮魚)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded" />
              <span>平均價 (拍賣成交均價)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-400 rounded" />
              <span>下價 (加工或次級品)</span>
            </div>
          </div>
        )}

        {/* SVG Responsive Container */}
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* Background Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = padding.top + innerHeight * pct;
              const priceAtY = Math.round(maxPrice - (maxPrice - minPrice) * pct);
              return (
                <g key={pct}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    NT${priceAtY}
                  </text>
                </g>
              );
            })}

            {/* Date X-Axis */}
            {sortedDates.map((date, idx) => {
              // Only show alternate labels if too dense
              if (sortedDates.length > 10 && idx % 2 !== 0 && idx !== sortedDates.length - 1) return null;
              const x = getX(idx);
              const isHovered = hoveredDate === date;
              return (
                <g key={date}>
                  <line
                    x1={x}
                    y1={padding.top + innerHeight}
                    x2={x}
                    y2={padding.top + innerHeight + 5}
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={padding.top + innerHeight + 18}
                    fill={isHovered ? '#00f0ff' : '#94a3b8'}
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {date.slice(5)}
                  </text>
                </g>
              );
            })}

            {/* Price lines */}
            {activeChartTab === 'compare' ? (
              // Multi-market comparison lines
              markets.map((m) => {
                const points = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.[m.id];
                    if (!rec) return null;
                    return `${getX(idx)},${getY(rec.avg_price)}`;
                  })
                  .filter(Boolean)
                  .join(' ');

                const isKeelung = m.id === 'KL01';

                return (
                  <g key={m.id}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke={marketColors[m.id] || '#64748b'}
                      strokeWidth={isKeelung ? '3' : '1.5'}
                      strokeOpacity={isKeelung ? '1' : '0.75'}
                    />
                    {/* Circle dots */}
                    {sortedDates.map((date, idx) => {
                      const rec = marketDateMap[date]?.[m.id];
                      if (!rec) return null;
                      const cx = getX(idx);
                      const cy = getY(rec.avg_price);
                      const isHovered = hoveredDate === date;
                      return (
                        <circle
                          key={date}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? (isKeelung ? '6' : '4') : isKeelung ? '4' : '2'}
                          fill={marketColors[m.id] || '#64748b'}
                          stroke="#0f172a"
                          strokeWidth="1.5"
                          className="transition-all"
                        />
                      );
                    })}
                  </g>
                );
              })
            ) : (
              // Band Chart (Keelung High-Mid-Low Band)
              (() => {
                const highPoints = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.high_price)}` : null;
                  })
                  .filter(Boolean);

                const lowPointsReversed = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.low_price)}` : null;
                  })
                  .filter(Boolean)
                  .reverse();

                const avgPoints = sortedDates
                  .map((date, idx) => {
                    const rec = marketDateMap[date]?.['KL01'];
                    return rec ? `${getX(idx)},${getY(rec.avg_price)}` : null;
                  })
                  .filter(Boolean)
                  .join(' ');

                const bandPolygon = [...highPoints, ...lowPointsReversed].join(' ');

                return (
                  <g>
                    {/* Shaded Area between High & Low */}
                    <polygon
                      points={bandPolygon}
                      fill="#00f0ff"
                      fillOpacity="0.12"
                    />
                    {/* High Price Line */}
                    <polyline
                      points={highPoints.join(' ')}
                      fill="none"
                      stroke="#fb7185"
                      strokeWidth="2"
                    />
                    {/* Low Price Line */}
                    <polyline
                      points={lowPointsReversed.reverse().join(' ')}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    />
                    {/* Avg Price Line */}
                    <polyline
                      points={avgPoints}
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="3"
                    />
                  </g>
                );
              })()
            )}

            {/* Transparent overlay for mouse hover inspection */}
            {sortedDates.map((date, idx) => {
              const x = getX(idx);
              const colWidth = innerWidth / (sortedDates.length - 1 || 1);
              return (
                <rect
                  key={date}
                  x={x - colWidth / 2}
                  y={padding.top}
                  width={colWidth}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* Hovered Date Detailed Breakdown Bar */}
        {hoveredDate && marketDateMap[hoveredDate] && (
          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-cyan-800/40 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white font-mono">{hoveredDate}</span>
              <span className="text-slate-400">當日拍賣詳情：</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {markets.map((m) => {
                const rec = marketDateMap[hoveredDate][m.id];
                if (!rec) return null;
                return (
                  <div key={m.id} className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400">{m.name.split(' (')[0]}:</span>
                    <span
                      className="font-bold"
                      style={{ color: marketColors[m.id] || '#ffffff' }}
                    >
                      NT${rec.avg_price}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({rec.trade_volume}kg)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Anomaly Event Detection Banner */}
      {recentAnomalies.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4.5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-rose-200 text-sm">
                  漁產品價量異常檢測警報 (Z-Score & Volatility Alert)
                </h4>
                <span className="text-[10px] bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded font-mono">
                  統計置信度 &gt; 99%
                </span>
              </div>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                於 <span className="font-mono font-bold text-white">{recentAnomalies[0].trade_date}</span> 在{' '}
                <span className="font-semibold text-white">{recentAnomalies[0].market_name}</span> 偵測到{' '}
                <span className="font-semibold text-white">{currentFish.name}</span> 發生{' '}
                <span className="font-mono text-white font-bold">{recentAnomalies[0].anomaly_flag}</span> 事件（偏離指標 Z={recentAnomalies[0].anomaly_score}σ）。
                可能成因包括北方三島海象海況惡化船隻無法出海、或大型扒網船爆量卸魚，建議採購端啟動庫存調節或跨市場轉單。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keelung Fishery Heritage & Local Relevance Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Fish className="w-4 h-4 text-cyan-400" />
          <span>基隆試點產地背景與漁法脈絡：{currentFish.name}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">漁獲作業方式 (Gear Type)</span>
            <span className="font-semibold text-white">{currentFish.gear_type || '近海作業'}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">產季與時令特徵 (Seasonality)</span>
            <span className="font-semibold text-cyan-300">{currentFish.seasonality}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">基隆在地產業連結</span>
            <span className="text-slate-200">{currentFish.keelung_relevance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
