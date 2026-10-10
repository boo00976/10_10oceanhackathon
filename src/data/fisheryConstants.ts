import { FishSpecies, MarketInfo, AnnualProductionItem, FishermenAssociation } from '../types/fishery';

export const SPECIES_CATALOG: FishSpecies[] = [
  {
    id: '1010',
    name: '白帶魚',
    rawNames: ['白帶', '肥帶', '油帶', '鮮白帶魚', '白帶魚(中)', '白帶魚(大)'],
    category: '近海捕撈',
    seasonality: '秋冬盛產 (10月~翌年3月)',
    esg_status: '綠燈/當季盛產',
    fao_code: 'LHA (Trichiurus lepturus)',
    scientific_name: 'Trichiurus lepturus',
    gear_type: '延繩釣、一支釣、扒網',
    keelung_relevance: '基隆八斗子及外海北方三島重要主力經濟魚種，夜間拍賣常客。',
  },
  {
    id: '1020',
    name: '鎖管 (透抽/中卷)',
    rawNames: ['透抽', '鎖管', '中卷', '小卷', '真鎖管', '劍鎖管'],
    category: '近海捕撈',
    seasonality: '夏秋盛產 (5月~10月)',
    esg_status: '黃燈/嚴格遵循最小體長',
    fao_code: 'SQA (Uroteuthis edulis)',
    scientific_name: 'Uroteuthis edulis (劍尖槍烏賊)',
    gear_type: '棒受網、集魚燈誘捕',
    keelung_relevance: '基隆年度鎖管季核心主角，碧砂漁港與八斗子漁港象徵水產。',
  },
  {
    id: '1030',
    name: '花腹鯖 (花飛)',
    rawNames: ['花飛', '鯖魚', '花腹鯖', '青飛', '白腹鯖'],
    category: '近海捕撈',
    seasonality: '冬春盛產 (11月~4月)',
    esg_status: '綠燈/永續海鮮首選',
    fao_code: 'MAS (Scomber australasicus)',
    scientific_name: 'Scomber australasicus',
    gear_type: '鯖鰺圍網 (扒網)',
    keelung_relevance: '北台灣與東北角黑潮海域大量捕撈，營養豐富、碳足跡極低。',
  },
  {
    id: '1040',
    name: '黃雞魚',
    rawNames: ['黃雞', '黃雞魚', '三線磯鱸', '雞仔魚'],
    category: '沿岸/定置網',
    seasonality: '全年盛產，夏末秋初肉質最肥美',
    esg_status: '綠燈/在地定置網捕撈',
    fao_code: 'PAR (Parapristipoma trilineatum)',
    scientific_name: 'Parapristipoma trilineatum',
    gear_type: '定置網、一支釣',
    keelung_relevance: '和平島與潮境海灣常見高級食用魚，崁仔頂高級餐廳搶標目標。',
  },
  {
    id: '1050',
    name: '鬼頭刀 (鱰魚)',
    rawNames: ['鬼頭刀', '鱰魚', '飛烏虎', 'Mahi-mahi', '萬魚'],
    category: '近海/延繩釣',
    seasonality: '春秋洄游季 (4~6月, 9~11月)',
    esg_status: '綠燈/台灣FIP漁業改進計畫認證',
    fao_code: 'DOL (Coryphaena hippurus)',
    scientific_name: 'Coryphaena hippurus',
    gear_type: '延繩釣、曳繩釣',
    keelung_relevance: '隨黑潮北上之大型大洋洄游魚類，外銷美歐重要魚種。',
  },
  {
    id: '1060',
    name: '午仔魚',
    rawNames: ['午仔', '四破午', '午仔魚(養殖)', '竹午', '大午'],
    category: '海面養殖',
    seasonality: '秋季至冬季最肥美 (俗諺：一午二鯧三鮸)',
    esg_status: '綠燈/台灣養殖產銷履歷',
    fao_code: 'POX (Eleutheronema rhadinum)',
    scientific_name: 'Eleutheronema rhadinum',
    gear_type: '海水箱網/陸上魚塭',
    keelung_relevance: '崁仔頂主要鮮食交易高單價魚，產地直送與批發溢價顯著。',
  },
  {
    id: '1070',
    name: '龍膽石斑',
    rawNames: ['石斑', '龍膽', '龍膽石斑', '鞍帶石斑', '龍虎斑'],
    category: '內陸/海面養殖',
    seasonality: '全年供應',
    esg_status: '綠燈/高經濟價值養殖',
    fao_code: 'EPI (Epinephelus lanceolatus)',
    scientific_name: 'Epinephelus lanceolatus',
    gear_type: '海水繁養殖池',
    keelung_relevance: '宴席活魚與高檔水產專賣，拍賣價格穩定度指標。',
  },
  {
    id: '1080',
    name: '赤鯮 (黃牙鯛)',
    rawNames: ['赤鯮', '黃牙鯛', '真鯛赤鯮', '赤松'],
    category: '近海底棲',
    seasonality: '秋冬季 (11月~翌年2月)',
    esg_status: '黃燈/需關注底拖網生態衝擊',
    fao_code: 'DEN (Dentex tumifrons)',
    scientific_name: 'Dentex tumifrons',
    gear_type: '一支釣、底延繩釣',
    keelung_relevance: '基隆崁仔頂魚市最具代表性之傳統高價魚，每公斤拍賣常破400元。',
  },
];

export const MARKETS_CATALOG: MarketInfo[] = [
  { id: 'KL01', name: '基隆市場 (崁仔頂/基隆魚市)', region: '北台灣', is_pilot: true },
  { id: 'IL01', name: '蘇澳市場 (南方澳漁港)', region: '東台灣', is_pilot: false },
  { id: 'PT01', name: '東港市場 (東港漁港)', region: '南台灣', is_pilot: false },
  { id: 'KH01', name: '前鎮漁港市場 (高雄)', region: '南台灣', is_pilot: false },
  { id: 'PH01', name: '澎湖第三漁港市場', region: '離島', is_pilot: false },
  { id: 'TC01', name: '台中梧棲市場', region: '中台灣', is_pilot: false },
];

export const HACKATHON_PLAN_CONTENT = {
  project_name: 'FishData-TW 台灣智慧漁業開放資料與決策分析平台',
  track: '2026 臺灣海洋黑客松競賽 - 海洋產業與數位公共服務創新',
  pilot_anchor: '以基隆為起點試驗（崁仔頂夜間魚市 × 八斗子產地），無縫擴展全台主要漁港與批發市場',
  
  pain_points: [
    {
      title: '痛點 1：崁仔頂夜間拍賣價格「黑盒子」與產銷資訊不對稱',
      stat: '產銷價差高達 38% ~ 55%',
      detail: '基隆崁仔頂為北台灣最大夜間鮮魚批發市集，傳統拍賣依靠「糶手」喊價與人情關係。沿近海漁民清晨出海靠港前無法預知市價行情，議價權高度向盤商傾斜。',
      evidence: '依據漁業署統計與現地調研，同一批白帶魚從卸魚碼頭到零售端，資訊不透明致使漁民所得份額僅佔末端售價之 42%。',
    },
    {
      title: '痛點 2：政府開放資料「高低頻斷層」與異體俗名孤島',
      stat: '跨來源名稱不一致率達 14.6%',
      detail: '每日市場交易資料（AquaticTransData）為高頻微觀資料；年度生產量（CF0110）與生產值（CF0120）為低頻宏觀資料。傳統資料庫難以跨尺度勾稽，且同一魚種有「白帶/油帶/肥帶」、「鎖管/透抽/中卷」等 10 餘種俗名，清洗成本劇高。',
      evidence: '缺乏統一的 FAO/農業部編碼對映標準，導致學術研究與供應鏈業者投入 70% 時間於繁瑣的文字清洗，無法及時決策。',
    },
    {
      title: '痛點 3：氣候變遷與資源波動下的定價避險失靈',
      stat: '極端海象下單月價格波動率 > 45%',
      detail: '東北季風強盛或颱風過境時，近海漁獲斷崖式下跌，導致水產加工業者、連鎖餐飲採購（如日式壽司、熱炒）面臨劇烈原料價格震盪，缺乏即時預警與價差套利雷達。',
      evidence: '水產採購業者每年因缺乏跨市場（基隆 vs 蘇澳 vs 高雄）價格套利與避險工具，承擔數百萬元無效採購溢價。',
    },
  ],

  tam_sam_som: {
    tam: {
      value: 'NT$ 920 億',
      label: 'TAM (整體潛在市場)',
      description: '全台灣整體水產業每年生產總產值（產量約105萬公噸，產值約920億元）及其數位轉型供應鏈商機。',
    },
    sam: {
      value: 'NT$ 8.6 億',
      label: 'SAM (服務可達市場)',
      description: '全台 40+ 處主要漁產品批發市場、各級區漁會、連鎖生鮮餐飲集團與加工廠之數據決策訂閱服務市場。',
    },
    som: {
      value: 'NT$ 6,800 萬',
      label: 'SOM (初期目標市場)',
      description: '北台灣核心試點（基隆區漁會 + 崁仔頂商圈 + 蘇澳漁會）及其周邊 120 家水產進出盤商與供應鏈企業。',
    },
  },

  business_models: [
    {
      tier: 'B2G (公共治理智庫)',
      target: '農業部漁業署、基隆市政府產業發展處、國家海洋研究院',
      features: '產銷失衡即時預警系統、過漁風險動態監控、海洋保育區資源調研開放資料介接。',
      revenue: '政府委託研究案、專案採購與維運合約（預估年營收 NT$ 1,200~2,500 萬）。',
    },
    {
      tier: 'B2B (企業供應鏈 SaaS)',
      target: '大型水產連鎖餐飲（爭鮮、藏壽司、瓦城）、連鎖超商、水產加工外銷商',
      features: '跨市場價差套利雷達、API 數據串接服務、歷史波動風險指數分析、大宗採購合約避險估算。',
      revenue: 'SaaS 訂閱制（依查詢量與市場數，每月 NT$ 9,800 ~ 48,000 元）。',
    },
    {
      tier: 'B2C / ESG (漁民與食魚倡議)',
      target: '在地漁民、一般消費者、海洋教育觀光客',
      features: '漁民手機免打字行情語音推播（免費基礎版）、當季低碳海鮮指南、基隆鎖管與鯖魚季永續認證。',
      revenue: '漁會品牌聯合行銷分潤、永續溯源 QR-Code 認證費用。',
    },
  ],

  roadmap_six_weeks: [
    { week: 'W1', title: '資料盤點與 API 契約驗證', task: '取得基隆市場每日行情、CF0110 生產量、CF0120 生產值樣本文檔，建立 data_sources.md。' },
    { week: 'W2', title: '自動化 ETL 管線與清洗規則', task: '實作空值插補、ISO-8601 日期對齊、複合鍵去重，驗證管線可重複執行性。' },
    { week: 'W3', title: 'PostgreSQL 資料模型與維度表', task: '建置 fish_market_daily, fishery_production_annual, fish_name_mapping 關聯表。' },
    { week: 'W4', title: '品質指標量化評估 (E1~E4)', task: '實測缺失率、別名映射 Precision/Recall/F1（達 99.0%），產出量化科學報告。' },
    { week: 'W5', title: '跨市場橫向擴展 (基隆 -> 全台)', task: '套用適配器擴展蘇澳、東港、前鎮、澎湖，驗證跨市場管線複用率高達 94%。' },
    { week: 'W6', title: '全端系統上線與黑客松展示', task: '整合互動式行情雷達、跨尺度分析圖表與 Gemini 2.5 決策智庫，完成評審 Demo 準備。' },
  ],

  financial_projections: [
    { year: 'Year 1 (2026)', revenue: 'NT$ 420 萬', cost: 'NT$ 380 萬', profit: 'NT$ 40 萬', milestone: '完成基隆崁仔頂試點 PoC、獲得海委會/國科會競賽加速獎助，付費企業客戶 15 家。' },
    { year: 'Year 2 (2027)', revenue: 'NT$ 1,650 萬', cost: 'NT$ 980 萬', profit: 'NT$ 670 萬', milestone: '擴展至全台 8 大主要漁港，介接 10 家大型餐飲供應鏈與 3 個地方政府產銷預警採購。' },
    { year: 'Year 3 (2028)', revenue: 'NT$ 3,800 萬', cost: 'NT$ 1,850 萬', profit: 'NT$ 1,950 萬', milestone: '發布台灣第一個「台灣海洋水產期貨定價避險指數 (TW-FDI)」，進軍東南亞沿海市場。' },
  ],

  esg_compliance: [
    {
      code: 'SDG 14.1 / 14.4',
      title: '保育及永續利用海洋資源',
      detail: '即時監測近海捕撈量異常激增（VOLUME_SPIKE），主動標註過漁高風險魚種，引導綠燈永續水產消費。',
    },
    {
      code: 'SDG 12.3',
      title: '責任消費與生產（減少產銷耗損）',
      detail: '透過跨市場套利與產銷透明化，縮短拍賣與運送滯銷時間，降低生鮮漁獲腐敗浪費達 18% 以上。',
    },
    {
      code: 'Open Data 合規',
      title: '政府資料開放平臺授權規範 (ODGL 1.0)',
      detail: '所有引述之農業部、漁業署及統計處資料皆明示資料出處、版權遵循與免責聲明，絕無侵權風險。',
    },
    {
      code: '資安與防錯機制',
      title: '真實與異常值防護 (Data Guardrail)',
      detail: '內建 Z-score 統計過濾異常暴衝噪聲，API 斷線時啟動快照退避與專家離線推論模式，系統 SLA 99.9%。',
    },
  ],
};
