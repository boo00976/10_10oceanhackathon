import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, HelpCircle, Shield, TrendingUp, Fish, Terminal } from 'lucide-react';

interface GeminiAdvisorViewProps {
  initialPrompt?: string;
  initialType?: string;
}

export const GeminiAdvisorView: React.FC<GeminiAdvisorViewProps> = ({
  initialPrompt = '',
  initialType = 'MARKET_ANALYSIS',
}) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || '請針對基隆崁仔頂市場目前白帶魚與鎖管價格異常波動，分析海象成因並提出盤商與漁民避險策略。'
  );
  const [promptType, setPromptType] = useState<string>(initialType);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sourceTag, setSourceTag] = useState<string>('GEMINI_2_5_FLASH');

  const presetQuestions = [
    {
      label: '評審犀利答辯：漁民為何願意用此系統？',
      type: 'JUDGE_DEFENSE',
      text: '黑客松評審提問：「很多傳統老漁民根本不上網或不識字，你們如何證明這套系統在基隆漁民之間真能推廣得動？」，請提供極具說服力的架構師答辯策略。',
    },
    {
      label: '評審質疑：政府開放資料若中斷或漏抓怎麼辦？',
      type: 'JUDGE_DEFENSE',
      text: '評審提問：「農業部開放資料 API 經常維護中斷或格式變動，你們的系統如何保證高可用性與資安防錯？」，請依據 E1~E4 與系統架構提出防禦機制。',
    },
    {
      label: 'B2B 變現模式：連鎖餐飲如何願意付費？',
      type: 'BUSINESS_MODEL',
      text: '請從大型連鎖餐飲（如日式壽司、海鮮熱炒）的採購痛點出發，論證他們為何願意每年付費訂閱 FishData-TW 的批發價差雷達與避險 API。',
    },
    {
      label: '產銷異常診斷：北方三島白帶魚海況成因',
      type: 'MARKET_ANALYSIS',
      text: '分析基隆八斗子漁港與崁仔頂市場中，「白帶魚」在秋冬受東北季風浪況影響之價量相關性，並給予產銷調節建議。',
    },
  ];

  const handleSendQuery = async (customPrompt?: string, customType?: string) => {
    const qText = customPrompt || prompt;
    const qType = customType || promptType;
    if (!qText.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: qText,
          type: qType,
          context: {
            pilot: 'Keelung Fish Market (崁仔頂 / 八斗子)',
            competition: '2026 臺灣海洋黑客松競賽',
            species: '白帶魚, 鎖管, 花腹鯖, 黃雞魚',
            data_sources: 'AquaticTransData, CF0110, CF0120, G74',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.reply);
        setSourceTag(data.source || 'GEMINI_2_5_FLASH');
      } else {
        setResponse(`抱歉，分析過程中發生錯誤：${data.error || '請稍候重試'}`);
      }
    } catch (err) {
      setResponse(`網路請求異常：${(err as Error).message}，已啟用離線備份分析指南。`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>Gemini 2.5 Flash 驅動 · 智慧海洋產業與競賽答辯智庫</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI 決策顧問與黑客松評審答辯模擬器
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              融合海洋經濟學、農業部開放資料口徑與黑客松評審心法，產出高價值落地策略。
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">模型：</span>
            <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              gemini-2.5-flash
            </span>
          </div>
        </div>
      </div>

      {/* Preset Strategy Question Buttons */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
          快速預載：黑客松評審高頻犀利問題與產銷診斷指令
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(q.text);
                setPromptType(q.type);
                handleSendQuery(q.text, q.type);
              }}
              className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 hover:border-cyan-700/60 border border-slate-800 text-xs transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300 group-hover:text-cyan-200">
                  {q.label}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-80" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">{q.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-xl">
        <label className="text-xs font-semibold text-slate-300 block">
          自訂提問或向顧問諮詢（例如：某魚種成因、評審問答防禦、商業推廣策略）：
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="輸入您的問題或黑客松情境..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            支援 Markdown 格式結構化回覆 · 內建評審評判邏輯
          </div>
          <button
            onClick={() => handleSendQuery()}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? 'AI 推論生成中...' : '送出諮詢'}</span>
          </button>
        </div>
      </div>

      {/* AI Response Display Card */}
      {(isLoading || response) && (
        <div className="bg-slate-900/90 border border-cyan-800/80 rounded-2xl p-6 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                海洋智庫專家剖析報告
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              來源：{sourceTag}
            </span>
          </div>

          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-cyan-300 animate-pulse">
                Gemini 2.5 Flash 正在分析台灣海洋產銷時序與評審模型...
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap space-y-2">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
