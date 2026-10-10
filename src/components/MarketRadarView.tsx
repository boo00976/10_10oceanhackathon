import React, { useState, useMemo } from 'react';
import { FishPriceRecord, MarketInfo, FishSpecies } from '../types/fishery';
import { ArrowUpRight, ArrowDownRight, Fish, MapPin, Calendar, Download, Scale, ShieldAlert, Zap, Compass, Calculator } from 'lucide-react';

interface MarketRadarViewProps {
  prices: FishPriceRecord[];
  markets: MarketInfo[];
  species: FishSpecies[];
}

export const MarketRadarView: React.FC<MarketRadarViewProps> = ({
  prices,
  markets,
  species,
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

  // Detect recent anomalies (Z-score algorithm)
  const recentAnomalies = useMemo(() => {
    return currentFishRecords
      .filter((r) => r.anomaly_flag !== 'NORMAL')
      .sort((a, b) => b.trade_date.localeCompare(a.trade_date));
  }, [currentFishRecords]);

  // SVG Chart Dimensions
  const chartWidth = 840;
  const chartHeight = 290;
  const padding = { top: 30, right: 35, bottom: 45, left: 60 };
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

  // P5X Signature Palette for Markets
  const marketColors: Record<string, string> = {
    KL01: '#e60012', // P5 Crimson Red (Keelung Anchor)
    IL01: '#ffe600', // Acid Yellow (Suao)
    PT01: '#ffffff', // Stark White (Donggang)
    KH01: '#00e5ff', // Neon Cyan (Kaohsiung)
    PH01: '#00e676', // Acid Green (Penghu)
    TC01: '#ff007f', // Magenta (Taichung)
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
    a.download = `FishData-P5X_${currentFish.name}_行情_${latestDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* P5X Hero Header Banner */}
      <div className="bg-[#121216] border-2 border-[#e60012] p-5 relative overflow-hidden shadow-[6px_6px_0px_#000000]">
        <div className="absolute top-0 right-0 w-64 h-full p5-stripes pointer-events-none opacity-40" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="bg-[#e60012] text-black font-black px-1.5 py-0.2 -skew-x-12">
                MARKET RADAR // 01
              </span>
              <span className="text-[#ffe600] font-black">
                基隆崁仔頂／八斗子高頻行情
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400 font-mono">08:00 AM UPDATE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white font-['Plus_Jakarta_Sans'] uppercase">
              批發交易行情與跨市場比價雷達
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              鎖定北部沿近海能捕撈之主力魚種 · 結合前一交易日漲跌與 Z-Score 統計預警算法。
            </p>
          </div>

          {/* Time range selector & Export */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase">TIME RANGE:</span>
            <div className="inline-flex bg-black p-1 border border-zinc-700">
              {[7, 14, 24].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedRangeDays(days)}
                  className={`px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                    selectedRangeDays === days
                      ? 'bg-[#e60012] text-white shadow-[2px_2px_0px_#ffffff]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {days} DAYS
                </button>
              ))}
            </div>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f25] hover:bg-[#e60012] hover:text-white text-zinc-200 text-xs font-black border border-zinc-700 transition cursor-pointer -skew-x-6"
            >
              <Download className="w-3.5 h-3.5 text-[#ffe600]" />
              <span>EXPORT CSV</span>
            </button>
          </div>
        </div>

        {/* Species Horizontal Selector with Concise North/South Naming (P5X Style) */}
        <div className="pt-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-3 bg-[#e60012] inline-block -skew-x-12" />
              <span>北部能捕撈之主力魚種（簡短南北叫法）：</span>
            </span>
            {currentFish.north_south_names && (
              <span className="text-xs bg-black text-[#ffe600] border border-[#ffe600] px-2 py-0.5 font-mono font-bold -skew-x-6">
                當前魚種叫法：{currentFish.north_south_names}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {species.map((fish) => {
              const isSelected = fish.id === selectedFishId;
              return (
                <button
                  key={fish.id}
                  onClick={() => setSelectedFishId(fish.id)}
                  className={`flex flex-col text-left p-3 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#e60012] text-white border-white shadow-[4px_4px_0px_#ffffff]'
                      : 'bg-[#18181c] border-zinc-800 text-zinc-300 hover:border-[#e60012] hover:bg-[#202026]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-sm tracking-tight text-white">{fish.name}</span>
                    <Fish className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ffe600]' : 'text-zinc-500'}`} />
                  </div>

                  {/* Concise Northern vs Southern Name Pill */}
                  {fish.north_south_names && (
                    <div
                      className={`text-[11px] font-bold font-mono px-1.5 py-0.5 my-0.5 truncate ${
                        isSelected
                          ? 'bg-black text-[#ffe600]'
                          : 'bg-black/60 text-[#ffe600] border border-zinc-800'
                      }`}
                    >
                      {fish.north_south_names}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                    <span className="truncate">{fish.category.split(' ')[0]}</span>
                    <span className={isSelected ? 'text-white font-bold' : 'text-zinc-500'}>
                      {fish.esg_status.split('/')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards Row (P5X Bold Angled Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Keelung Auction Price */}
        <div className="bg-[#121216] border-2 border-zinc-800 hover:border-[#e60012] p-4.5 relative overflow-hidden shadow-[4px_4px_0px_#000000] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="font-bold text-white uppercase">// KEELUNG AUCTION PRICE</span>
            <span className="bg-[#e60012] text-white px-1.5 py-0.2 text-[10px] font-black font-mono">
              KL01 崁仔頂
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">
              NT$ {keelungAvgPrice}
            </span>
            <span className="text-xs text-zinc-400 font-mono">/ KG</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono font-bold">
            <span
              className={`flex items-center px-1.5 py-0.2 ${
                priceChange >= 0
                  ? 'bg-[#e60012] text-white'
                  : 'bg-[#00e676] text-black font-black'
              }`}
            >
              {priceChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {priceChange >= 0 ? `+${priceChange}` : priceChange} ({priceChangePct}%)
            </span>
            <span className="text-zinc-500 text-[11px]">較前一有效交易日</span>
          </div>
        </div>

        {/* Card 2: Daily Volume */}
        <div className="bg-[#121216] border-2 border-zinc-800 hover:border-[#e60012] p-4.5 relative overflow-hidden shadow-[4px_4px_0px_#000000] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="font-bold text-white uppercase">// DAILY VOLUME</span>
            <span className="text-[10px] text-zinc-500 font-mono">批發到港量</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">
              {keelungVolume.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400 font-mono">KG</span>
          </div>
          <div className="mt-2 text-xs font-mono flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 bg-[#00e676] inline-block" />
            <span className="text-[11px]">正常靠港卸魚量 · 供需均衡</span>
          </div>
        </div>

        {/* Card 3: Arbitrage Spread */}
        <div className="bg-[#121216] border-2 border-zinc-800 hover:border-[#ffe600] p-4.5 relative overflow-hidden shadow-[4px_4px_0px_#000000] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="font-bold text-white uppercase">// ARBITRAGE SPREAD</span>
            <Scale className="w-4 h-4 text-[#ffe600]" />
          </div>
          {arbitrageAnalysis ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#ffe600] font-mono tracking-tighter">
                  +NT$ {arbitrageAnalysis.diff}
                </span>
                <span className="text-xs text-[#ffe600] font-mono font-bold">({arbitrageAnalysis.diffPct}%)</span>
              </div>
              <div className="mt-2 text-xs font-mono text-zinc-300 truncate">
                基隆高於 <span className="text-white font-black">{arbitrageAnalysis.lowestMarket.split(' (')[0]}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 font-mono">計算比對中...</div>
          )}
        </div>

        {/* Card 4: Z-Score Anomaly Indicator */}
        <div className="bg-[#121216] border-2 border-zinc-800 hover:border-[#e60012] p-4.5 relative overflow-hidden shadow-[4px_4px_0px_#000000] transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="font-bold text-white uppercase">// Z-SCORE VOLATILITY</span>
            <ShieldAlert className="w-4 h-4 text-[#e60012]" />
          </div>
          <div className="flex items-baseline gap-2">
            {recentAnomalies.length > 0 ? (
              <span className="text-2xl font-black text-[#e60012] font-mono tracking-tight flex items-center gap-1">
                <Zap className="w-5 h-5 text-[#e60012] fill-current" />
                <span>{recentAnomalies.length} ALERTS</span>
              </span>
            ) : (
              <span className="text-2xl font-black text-[#00e676] font-mono tracking-tight">
                NORMAL (95%)
              </span>
            )}
          </div>
          <div className="mt-2 text-xs font-mono text-zinc-400 truncate">
            {recentAnomalies.length > 0
              ? `${recentAnomalies[0].trade_date} 偏離基線 > 2.5σ`
              : '過去 14 天價格於標準差區間內'}
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section (P5X Black/Red/Yellow Visuals) */}
      <div className="bg-[#121216] border-2 border-zinc-800 p-5 shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-5 bg-[#e60012] -skew-x-12" />
            <h3 className="font-black text-white text-base tracking-tight font-mono uppercase">
              {currentFish.name} // 價格時序趨勢雷達
            </h3>
          </div>

          <div className="inline-flex bg-black p-1 border border-zinc-700">
            <button
              onClick={() => setActiveChartTab('compare')}
              className={`px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                activeChartTab === 'compare'
                  ? 'bg-[#e60012] text-white shadow-[2px_2px_0px_#ffffff]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              跨市場均價對比 (ALL MARKETS)
            </button>
            <button
              onClick={() => setActiveChartTab('band')}
              className={`px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                activeChartTab === 'band'
                  ? 'bg-[#e60012] text-white shadow-[2px_2px_0px_#ffffff]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              基隆 上/中/下價區間帶
            </button>
          </div>
        </div>

        {/* Legend */}
        {activeChartTab === 'compare' ? (
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono mb-4 text-zinc-300">
            {markets.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 -skew-x-12"
                  style={{ backgroundColor: marketColors[m.id] || '#94a3b8' }}
                />
                <span className={m.id === 'KL01' ? 'font-black text-[#e60012]' : ''}>
                  {m.name.split(' (')[0]} {m.id === 'KL01' && '(基隆核心)'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-5 text-xs font-mono mb-4 text-zinc-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#e60012]" />
              <span className="font-bold text-white">上價 (頂級鮮貨)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#ffe600]" />
              <span className="font-bold text-white">平均價 (成交均價)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#00e5ff]" />
              <span className="font-bold text-white">下價 (加工或次級)</span>
            </div>
          </div>
        )}

        {/* SVG Responsive Container */}
        <div className="relative overflow-x-auto bg-[#0a0a0c] p-2 border border-zinc-800">
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
                    stroke="#222228"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    fill="#777785"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    NT${priceAtY}
                  </text>
                </g>
              );
            })}

            {/* Date X-Axis */}
            {sortedDates.map((date, idx) => {
              if (sortedDates.length > 10 && idx % 2 !== 0 && idx !== sortedDates.length - 1) return null;
              const x = getX(idx);
              const isHovered = hoveredDate === date;
              return (
                <g key={date}>
                  <line
                    x1={x}
                    y1={padding.top + innerHeight}
                    x2={x}
                    y2={padding.top + innerHeight + 6}
                    stroke="#444450"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={padding.top + innerHeight + 20}
                    fill={isHovered ? '#ffe600' : '#888896'}
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {date.slice(5)}
                  </text>
                </g>
              );
            })}

            {/* Price lines */}
            {activeChartTab === 'compare' ? (
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
                      strokeWidth={isKeelung ? '3.5' : '1.5'}
                    />
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
                          stroke="#000000"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })
            ) : (
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
                    <polygon
                      points={bandPolygon}
                      fill="#e60012"
                      fillOpacity="0.18"
                    />
                    <polyline
                      points={highPoints.join(' ')}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <polyline
                      points={lowPointsReversed.reverse().join(' ')}
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="2"
                    />
                    <polyline
                      points={avgPoints}
                      fill="none"
                      stroke="#ffe600"
                      strokeWidth="3.5"
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

        {/* Hover inspection box */}
        {hoveredDate && marketDateMap[hoveredDate] && (
          <div className="mt-3 p-3 bg-black border border-[#e60012] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ffe600]" />
              <span className="font-black text-white">{hoveredDate}</span>
              <span className="text-zinc-500">// 當日行情：</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {markets.map((m) => {
                const rec = marketDateMap[hoveredDate][m.id];
                if (!rec) return null;
                return (
                  <div key={m.id} className="flex items-center gap-1.5">
                    <span className="text-zinc-400">{m.name.split(' (')[0]}:</span>
                    <span
                      className="font-black"
                      style={{ color: marketColors[m.id] || '#ffffff' }}
                    >
                      NT${rec.avg_price}
                    </span>
                    <span className="text-[10px] text-zinc-500">({rec.trade_volume}kg)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* P5X Stylized Algorithm Specification Card */}
      <div className="bg-[#121216] border-2 border-[#e60012] p-5 shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-mono">
            <div className="bg-[#e60012] text-white p-1 -skew-x-12">
              <Calculator className="w-4 h-4 skew-x-12" />
            </div>
            <h3 className="text-base font-black text-white tracking-tight uppercase">
              ALGORITHM CORE // 漲跌與異常預警算法詳解
            </h3>
          </div>
          <span className="text-xs font-mono text-[#ffe600] font-bold">
            STATISTICAL MODEL SPEC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Formula 1 */}
          <div className="bg-black p-4 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#e60012] text-sm">// 01 DAILY RETURN</span>
              <span className="text-[10px] text-zinc-500">前一交易日基準</span>
            </div>
            <div className="p-2.5 bg-[#18181c] border border-zinc-700 font-mono text-[11px] text-white font-bold">
              ΔP = P_t - P_prev<br />
              漲跌幅(%) = (ΔP / P_prev) × 100%
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              排除傳統公休日（農曆初二、十六休市與每週一休市）的假性斷點，精準錨定前一實際有效拍賣日之成交均價。
            </p>
          </div>

          {/* Formula 2 */}
          <div className="bg-black p-4 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#ffe600] text-sm">// 02 ROLLING Z-SCORE</span>
              <span className="text-[10px] text-zinc-500">時序異常檢測</span>
            </div>
            <div className="p-2.5 bg-[#18181c] border border-zinc-700 font-mono text-[11px] text-white font-bold">
              Z = (P_t - μ_14) / σ_14<br />
              觸發門檻：|Z| ≥ 2.5σ
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              計算 14 天滾動平均與標準差；若偏離大於 2.5 個標準差（常態機率 &lt; 1%），標定為海象惡劣停捕暴漲或大卸魚爆量。
            </p>
          </div>

          {/* Formula 3 */}
          <div className="bg-black p-4 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-sm">// 03 ARBITRAGE SPREAD</span>
              <span className="text-[10px] text-zinc-500">跨市場套利</span>
            </div>
            <div className="p-2.5 bg-[#18181c] border border-zinc-700 font-mono text-[11px] text-white font-bold">
              Spread = P_KL - min(P_others)<br />
              套利率(%) = (Spread / min) × 100%
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              以基隆崁仔頂市場為消費地核心，計算與南方澳、前鎮等產地之冷鏈差價，超過 15 元/kg 提示跨市場調度套利機會。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
