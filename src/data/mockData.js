import { 
  Scale, Layers, Fuel, DollarSign, 
  FlaskConical, Anchor, Droplets, Gauge 
} from 'lucide-react';

/**
 * TFT 모델 핵심 변수 기여도 데이터
 */
export const KEY_FACTORS = [
  { 
    label: "RSI (14) & Momentum", 
    group: "Oscillators", 
    val: 85, 
    color: "bg-emerald-500", 
    desc: "과매수 구간 진입 신호 포착" 
  },
  { 
    label: "MA (20, 60)", 
    group: "Moving Averages", 
    val: 78, 
    color: "bg-indigo-500", 
    desc: "단기/중기 이평선 골든크로스" 
  },
  { 
    label: "Open/Close Volatility", 
    group: "Raw Price (HLC)", 
    val: 65, 
    color: "bg-amber-500", 
    desc: "장중 변동성 확대" 
  },
  { 
    label: "WTI Crude Oil", 
    group: "Exogenous Vars", 
    val: 45, 
    color: "bg-rose-500", 
    desc: "에너지 비용 상승 압력" 
  },
];

/**
 * 고영향 뉴스 분석 데이터
 */
export const IMPACT_ANALYSIS_NEWS = [
  { 
    source: "Bloomberg", 
    title: "미 중서부 기습 폭염 경보, 수확량 전망치 하향 조정", 
    impact: 92, 
    analysis: "공급망 충격(Supply Shock) 우려가 선물 매수세를 직접적으로 자극함." 
  },
  { 
    source: "CFTC Report", 
    title: "헤지펀드 옥수수 선물 순매수(Net Long) 포지션 2주 연속 확대", 
    impact: 88, 
    analysis: "스마트 머니(기관)의 자금이 상승 쪽으로 쏠리며 추세 강도를 높임." 
  },
  { 
    source: "Reuters", 
    title: "연준(Fed) 금리 동결 시사, 달러 인덱스 약세 전환", 
    impact: 75, 
    analysis: "달러 약세로 인한 미국산 곡물의 수출 가격 경쟁력 회복 기대감." 
  }
];

/**
 * 시장 상세 변수 데이터 (8개 지표)
 */
export const MARKET_METRICS = [
  // 1. Market Sentiment & Position
  { icon: Scale, label: "Net Long (순매수)", value: "15.4K", trend: 5.2, sub: "Contracts", impact: "High", group: "Sentiment" },
  { icon: Layers, label: "Open Interest", value: "1.2M", trend: 1.8, sub: "Total Vol", impact: "Medium", group: "Liquidity" },
  
  // 2. Macro & External
  { icon: Fuel, label: "WTI Crude Oil", value: "$75.50", trend: 3.2, sub: "Energy Cost", impact: "High", group: "Macro" },
  { icon: DollarSign, label: "Dollar Index", value: "104.2", trend: -0.5, sub: "DXY", impact: "Medium", group: "Macro" },
  
  // 3. Fundamentals (Supply/Demand)
  { icon: FlaskConical, label: "Ethanol Prod.", value: "1.05M", trend: 2.1, sub: "Barrels/Day", impact: "High", group: "Demand" },
  { icon: Anchor, label: "Baltic Dry Index", value: "1,450", trend: -4.5, sub: "Freight Cost", impact: "Low", group: "Logistics" },
  
  // 4. Weather & Crop
  { icon: Droplets, label: "Brazil Rain", value: "12.4mm", trend: -15.4, sub: "Mato Grosso", impact: "High", group: "Weather" },
  { icon: Gauge, label: "Crop Condition", value: "68%", trend: -2.0, sub: "Good/Excl.", impact: "High", group: "Quality" },
];

/**
 * 뉴스 피드 데이터 (확장)
 */
export const NEWS_ITEMS = [
  { id: "n001", source: "WSJ", title: "아르헨티나 항만 파업으로 곡물 선적 지연", sentiment: "pos", time: "12h ago", date: "2026-01-29", content: "아르헨티나 주요 항만에서 노동자 파업이 시작되면서 곡물 선적이 지연되고 있습니다. 이는 전 세계 곡물 공급망에 영향을 미칠 것으로 예상됩니다." },
  { id: "n002", source: "CNBC", title: "중국, 전략 비축유 확보 위해 옥수수 수입 확대", sentiment: "pos", time: "1d ago", date: "2026-01-28", content: "중국 정부가 전략 비축 목적으로 옥수수 수입을 대폭 확대한다고 발표했습니다. 이는 글로벌 옥수수 수요 증가로 이어질 전망입니다." },
  { id: "n003", source: "FT", title: "바이오에탄올 의무 혼합 비율 상향 논의", sentiment: "pos", time: "1d ago", date: "2026-01-28", content: "미국 환경보호청(EPA)이 바이오에탄올 의무 혼합 비율 상향을 검토 중입니다. 이는 옥수수 수요 증가로 이어질 것으로 예상됩니다." },
  { id: "n004", source: "Reuters", title: "우크라이나 곡물 협정 연장 불확실성 지속", sentiment: "neg", time: "2d ago", date: "2026-01-27", content: "우크라이나 곡물 수출 협정의 연장 여부가 불확실한 상황입니다. 협정 만료 시 글로벌 곡물 공급에 부정적 영향을 미칠 수 있습니다." },
  { id: "n005", source: "Bloomberg", title: "브라질 옥수수 수확량 전망치 상향 조정", sentiment: "pos", time: "3d ago", date: "2026-01-26", content: "브라질 농업부가 올해 옥수수 수확량 전망치를 상향 조정했습니다. 기상 조건이 양호하여 작황이 예상보다 좋을 것으로 전망됩니다." },
  { id: "n006", source: "WSJ", title: "미국 중서부 폭염 경보, 작물 스트레스 우려", sentiment: "neg", time: "4d ago", date: "2026-01-25", content: "미국 중서부 지역에 폭염 경보가 발령되면서 옥수수 작물에 스트레스가 가해질 우려가 있습니다. 수확량 감소 가능성이 제기되고 있습니다." },
  { id: "n007", source: "CNBC", title: "에탄올 생산량 증가로 옥수수 수요 급증", sentiment: "pos", time: "5d ago", date: "2026-01-24", content: "에탄올 생산량이 증가하면서 옥수수 수요가 급증하고 있습니다. 에너지 가격 상승으로 바이오연료에 대한 관심이 높아지고 있습니다." },
  { id: "n008", source: "Reuters", title: "러시아 곡물 수출 증가, 시장 공급 확대", sentiment: "neg", time: "6d ago", date: "2026-01-23", content: "러시아의 곡물 수출이 증가하면서 글로벌 시장 공급이 확대되고 있습니다. 이는 가격 하락 압력으로 작용할 수 있습니다." },
  { id: "n009", source: "FT", title: "인도 옥수수 수출 제한 조치 발표", sentiment: "pos", time: "7d ago", date: "2026-01-22", content: "인도 정부가 옥수수 수출 제한 조치를 발표했습니다. 국내 공급 안정화를 위한 조치로, 글로벌 공급 감소로 이어질 수 있습니다." },
  { id: "n010", source: "Bloomberg", title: "CFTC, 옥수수 선물 거래 규제 강화 검토", sentiment: "neg", time: "8d ago", date: "2026-01-21", content: "CFTC가 옥수수 선물 거래 규제 강화를 검토 중입니다. 투기 거래 제한으로 시장 유동성 감소 가능성이 있습니다." },
  { id: "n011", source: "WSJ", title: "중국 옥수수 재고 감소, 수입 필요성 증가", sentiment: "pos", time: "9d ago", date: "2026-01-20", content: "중국의 옥수수 재고가 감소하면서 수입 필요성이 증가하고 있습니다. 이는 글로벌 옥수수 가격 상승 요인으로 작용할 수 있습니다." },
  { id: "n012", source: "CNBC", title: "바이오연료 정책 변화, 옥수수 수요 전망 긍정적", sentiment: "pos", time: "10d ago", date: "2026-01-19", content: "바이오연료 정책 변화로 옥수수 수요 전망이 긍정적으로 전환되고 있습니다. 정부의 친환경 에너지 정책이 옥수수 시장에 호재로 작용할 것으로 예상됩니다." },
  { id: "n013", source: "Reuters", title: "아르헨티나 가뭄 우려, 옥수수 생산량 하향 조정", sentiment: "neg", time: "11d ago", date: "2026-01-18", content: "아르헨티나의 가뭄 우려로 옥수수 생산량 전망치가 하향 조정되었습니다. 기상 조건 악화가 작물 생육에 영향을 미치고 있습니다." },
  { id: "n014", source: "FT", title: "유럽 옥수수 수입 증가, 공급망 다각화 노력", sentiment: "pos", time: "12d ago", date: "2026-01-17", content: "유럽이 옥수수 수입을 증가시키면서 공급망 다각화를 추진하고 있습니다. 이는 옥수수 수요 증가로 이어질 것으로 예상됩니다." },
  { id: "n015", source: "Bloomberg", title: "옥수수 가격 변동성 증가, 투자자 주의 필요", sentiment: "neg", time: "13d ago", date: "2026-01-16", content: "옥수수 가격 변동성이 증가하면서 투자자들의 주의가 필요합니다. 시장 불확실성이 높아지고 있어 신중한 접근이 요구됩니다." },
  { id: "n016", source: "WSJ", title: "미국 옥수수 재고 증가, 가격 하락 압력", sentiment: "neg", time: "14d ago", date: "2026-01-15", content: "미국 옥수수 재고가 증가하면서 가격 하락 압력이 가해지고 있습니다. 공급 과잉 우려가 제기되고 있습니다." },
  { id: "n017", source: "CNBC", title: "동남아시아 옥수수 수요 증가, 수입 확대", sentiment: "pos", time: "15d ago", date: "2026-01-14", content: "동남아시아 지역의 옥수수 수요가 증가하면서 수입이 확대되고 있습니다. 사료 산업 성장이 주요 원인으로 분석됩니다." },
  { id: "n018", source: "Reuters", title: "옥수수 수출국 간 경쟁 심화, 가격 경쟁력 중요", sentiment: "neg", time: "16d ago", date: "2026-01-13", content: "옥수수 수출국 간 경쟁이 심화되면서 가격 경쟁력이 중요해지고 있습니다. 수출 가격 하락 압력이 가해지고 있습니다." },
  { id: "n019", source: "FT", title: "기후 변화로 옥수수 재배 지역 변화 예상", sentiment: "neg", time: "17d ago", date: "2026-01-12", content: "기후 변화로 인해 옥수수 재배 지역이 변화할 것으로 예상됩니다. 전통적 재배 지역의 생산성 저하 우려가 있습니다." },
  { id: "n020", source: "Bloomberg", title: "옥수수 유전자 개선 기술 발전, 수확량 증가 기대", sentiment: "pos", time: "18d ago", date: "2026-01-11", content: "옥수수 유전자 개선 기술이 발전하면서 수확량 증가가 기대됩니다. 새로운 품종 개발로 생산성 향상이 예상됩니다." },
  { id: "n021", source: "WSJ", title: "옥수수 운송비 상승, 물류 비용 증가", sentiment: "neg", time: "19d ago", date: "2026-01-10", content: "옥수수 운송비가 상승하면서 물류 비용이 증가하고 있습니다. 해상 운임 상승이 주요 원인으로 분석됩니다." },
  { id: "n022", source: "CNBC", title: "옥수수 가공 산업 성장, 부가가치 제품 수요 증가", sentiment: "pos", time: "20d ago", date: "2026-01-09", content: "옥수수 가공 산업이 성장하면서 부가가치 제품에 대한 수요가 증가하고 있습니다. 식품 산업의 옥수수 활용이 확대되고 있습니다." },
];

/**
 * 날짜 문자열을 시드로 변환 (일관된 랜덤 생성용)
 */
const dateToSeed = (dateString) => {
  if (!dateString) return 0;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * 시드 기반 랜덤 생성기
 */
const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

/**
 * 날짜별 핵심 변수 기여도 데이터 생성
 * @param {string|null} dateString - 날짜 문자열 (예: "1/30") 또는 null (오늘 기준)
 * @returns {Array} KEY_FACTORS 형식의 배열
 */
export const getFactorsByDate = (dateString) => {
  if (!dateString) return KEY_FACTORS;
  
  const seed = dateToSeed(dateString);
  const random = seededRandom(seed);
  
  const baseFactors = [
    { label: "RSI (14) & Momentum", group: "Oscillators", color: "bg-emerald-500" },
    { label: "MA (20, 60)", group: "Moving Averages", color: "bg-indigo-500" },
    { label: "Open/Close Volatility", group: "Raw Price (HLC)", color: "bg-amber-500" },
    { label: "WTI Crude Oil", group: "Exogenous Vars", color: "bg-rose-500" },
  ];
  
  const descriptions = [
    ["과매수 구간 진입 신호 포착", "과매도 구간 진입 신호 포착", "중립 구간 유지"],
    ["단기/중기 이평선 골든크로스", "단기/중기 이평선 데드크로스", "이평선 교차 대기 중"],
    ["장중 변동성 확대", "장중 변동성 축소", "변동성 정상 범위"],
    ["에너지 비용 상승 압력", "에너지 비용 하락 압력", "에너지 비용 안정"],
  ];
  
  return baseFactors.map((factor, idx) => {
    const val = Math.floor(30 + random() * 60); // 30-90 범위
    const descIndex = Math.floor(random() * descriptions[idx].length);
    
    return {
      ...factor,
      val,
      desc: descriptions[idx][descIndex],
    };
  }).sort((a, b) => b.val - a.val); // 값 기준 내림차순 정렬
};

/**
 * 날짜별 AI 예측 근거 리포트 데이터 생성
 * @param {string|null} dateString - 날짜 문자열 (예: "1/30") 또는 null (오늘 기준)
 * @returns {Object} { summary, impactNews }
 */
export const getReasoningByDate = (dateString) => {
  if (!dateString) {
    return {
      summary: "현재 시장은 이동평균(Moving Averages) 상의 골든크로스와 오실레이터(Oscillators)의 과매수 신호가 혼재되어 있습니다. TFT 모델은 단기 추세(Trend) 요인을 78% 비중으로 반영하여 상승 지속을 예측하고 있습니다.",
      impactNews: IMPACT_ANALYSIS_NEWS,
    };
  }
  
  const seed = dateToSeed(dateString);
  const random = seededRandom(seed);
  
  const summaries = [
    "현재 시장은 이동평균(Moving Averages) 상의 골든크로스와 오실레이터(Oscillators)의 과매수 신호가 혼재되어 있습니다. TFT 모델은 단기 추세(Trend) 요인을 78% 비중으로 반영하여 상승 지속을 예측하고 있습니다.",
    "시장은 기술적 지표들이 혼재된 신호를 보이고 있습니다. 이동평균선은 상승 추세를 유지하나, 오실레이터는 과매수 구간에 진입했습니다. TFT 모델은 변동성(Volatility) 요인을 65% 비중으로 반영하여 단기 조정 가능성을 예측합니다.",
    "현재 시장은 강한 상승 모멘텀을 보이고 있습니다. 모든 주요 기술적 지표가 상승 신호를 보이며, 외생 변수(Exogenous Variables)도 긍정적입니다. TFT 모델은 추세(Trend) 요인을 85% 비중으로 반영하여 지속적인 상승을 예측합니다.",
    "시장은 하락 압력을 받고 있습니다. 이동평균선이 하향 전환되었고, 오실레이터도 약세 신호를 보입니다. TFT 모델은 외생 변수(Exogenous Variables) 요인을 70% 비중으로 반영하여 추가 하락 가능성을 예측합니다.",
  ];
  
  const newsTemplates = [
    { source: "Bloomberg", title: "미 중서부 기습 폭염 경보, 수확량 전망치 하향 조정", impact: 92, analysis: "공급망 충격(Supply Shock) 우려가 선물 매수세를 직접적으로 자극함." },
    { source: "CFTC Report", title: "헤지펀드 옥수수 선물 순매수(Net Long) 포지션 2주 연속 확대", impact: 88, analysis: "스마트 머니(기관)의 자금이 상승 쪽으로 쏠리며 추세 강도를 높임." },
    { source: "Reuters", title: "연준(Fed) 금리 동결 시사, 달러 인덱스 약세 전환", impact: 75, analysis: "달러 약세로 인한 미국산 곡물의 수출 가격 경쟁력 회복 기대감." },
    { source: "WSJ", title: "브라질 가뭄 심화, 옥수수 생산량 우려", impact: 85, analysis: "주요 생산국의 생산량 감소 우려가 글로벌 공급 불안정성을 높임." },
    { source: "CNBC", title: "에탄올 수요 급증, 옥수수 가격 상승 압력", impact: 80, analysis: "바이오연료 정책 변화로 인한 수요 증가가 가격 상승 요인으로 작용." },
  ];
  
  const summaryIndex = Math.floor(random() * summaries.length);
  const selectedNews = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < 3; i++) {
    let idx;
    do {
      idx = Math.floor(random() * newsTemplates.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    
    const news = { ...newsTemplates[idx] };
    news.impact = Math.floor(70 + random() * 25); // 70-95 범위
    selectedNews.push(news);
  }
  
  selectedNews.sort((a, b) => b.impact - a.impact);
  
  return {
    summary: summaries[summaryIndex],
    impactNews: selectedNews,
  };
};

/**
 * 유사 패턴 과거 사례 분석 데이터 생성
 * 현재 패턴과 유사한 과거 사례를 반환
 * @returns {Object} { commodityId, currentPatternRange, similarPatterns }
 */
export const getSimilarPatterns = () => {
  // 현재 날짜 기준으로 과거 30일 범위 설정
  const today = new Date();
  const currentStart = new Date(today);
  currentStart.setDate(currentStart.getDate() - 30);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Mock 유사 패턴 데이터
  const similarPatterns = [
    {
      rank: 1,
      similarity: 87.2,
      periodStart: "2024-07-01",
      periodEnd: "2024-07-30",
      priceStart: 420.50,
      priceEnd: 445.20,
      priceChange: 5.87,
      outcomeAfter60Days: 8.2,
      keyFactors: ["폭염 경보", "에탄올 수요 급증", "순매수 확대"]
    },
    {
      rank: 2,
      similarity: 82.5,
      periodStart: "2023-03-15",
      periodEnd: "2023-04-14",
      priceStart: 435.80,
      priceEnd: 452.30,
      priceChange: 3.78,
      outcomeAfter60Days: 6.5,
      keyFactors: ["금리 동결", "달러 약세", "작물 조건 악화"]
    },
    {
      rank: 3,
      similarity: 78.9,
      periodStart: "2022-09-10",
      periodEnd: "2022-10-10",
      priceStart: 410.20,
      priceEnd: 428.60,
      priceChange: 4.49,
      outcomeAfter60Days: 5.3,
      keyFactors: ["공급망 불안", "수출 제한", "기관 매수"]
    }
  ];

  return {
    commodityId: "corn",
    currentPatternRange: `${formatDate(currentStart)} ~ ${formatDate(today)}`,
    similarPatterns
  };
};

/**
 * What-if 분석용 기본 Feature 값
 * 현재 시장 지표를 기반으로 설정
 */
export const DEFAULT_FEATURE_VALUES = {
  WTI: 75.50,
  DXY: 104.2,
  NET_LONG: 15400,
  ETHANOL_PROD: 1.05
};

/**
 * Feature별 가중치 및 영향 계수
 * 각 Feature가 가격에 미치는 영향도를 정의
 */
const FEATURE_WEIGHTS = {
  WTI: {
    weight: 0.15, // 전체 영향의 15%
    sensitivity: 0.8, // WTI $1 변화당 가격 변화 ($0.8)
    direction: 1 // 양의 상관관계
  },
  DXY: {
    weight: 0.12,
    sensitivity: -0.6, // DXY 1 포인트 변화당 가격 변화 ($-0.6, 역상관)
    direction: -1
  },
  NET_LONG: {
    weight: 0.20,
    sensitivity: 0.002, // 1000 계약 변화당 가격 변화 ($2)
    direction: 1
  },
  ETHANOL_PROD: {
    weight: 0.18,
    sensitivity: 12.0, // 0.1M barrels/day 변화당 가격 변화 ($12)
    direction: 1
  }
};

/**
 * What-if 분석: Feature 값 변경에 따른 예측 가격 계산
 * @param {Object} featureOverrides - 변경할 Feature 값들
 * @param {number} baseForecast - 기본 예측 가격
 * @returns {Object} { simulatedForecast, change, changePercent, featureImpacts }
 */
export const calculateWhatIfForecast = (featureOverrides = {}, baseForecast = 452.30) => {
  const featureImpacts = [];
  let totalChange = 0;

  // 각 Feature별 영향 계산
  Object.keys(FEATURE_WEIGHTS).forEach((featureKey) => {
    const currentValue = DEFAULT_FEATURE_VALUES[featureKey];
    const newValue = featureOverrides[featureKey] !== undefined 
      ? featureOverrides[featureKey] 
      : currentValue;
    
    if (newValue !== currentValue) {
      const config = FEATURE_WEIGHTS[featureKey];
      const valueChange = newValue - currentValue;
      const impact = valueChange * config.sensitivity * config.direction;
      
      featureImpacts.push({
        feature: featureKey,
        contribution: impact,
        valueChange: valueChange,
        currentValue: currentValue,
        newValue: newValue
      });
      
      totalChange += impact;
    }
  });

  const simulatedForecast = baseForecast + totalChange;
  const change = simulatedForecast - baseForecast;
  const changePercent = (change / baseForecast) * 100;

  // 영향도 순으로 정렬
  featureImpacts.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return {
    originalForecast: baseForecast,
    simulatedForecast: Math.max(0, simulatedForecast), // 음수 방지
    change: change,
    changePercent: changePercent,
    featureImpacts: featureImpacts
  };
};

/**
 * Feature별 범위 및 단위 정보
 */
export const FEATURE_CONFIG = {
  WTI: {
    label: "WTI Crude Oil",
    unit: "$",
    min: 60,
    max: 90,
    step: 0.5,
    format: (val) => `$${val.toFixed(2)}`
  },
  DXY: {
    label: "Dollar Index",
    unit: "",
    min: 100,
    max: 110,
    step: 0.1,
    format: (val) => val.toFixed(1)
  },
  NET_LONG: {
    label: "Net Long (순매수)",
    unit: "",
    min: 5000,
    max: 25000,
    step: 500,
    format: (val) => `${(val / 1000).toFixed(1)}K`
  },
  ETHANOL_PROD: {
    label: "Ethanol Production",
    unit: "M",
    min: 0.8,
    max: 1.2,
    step: 0.01,
    format: (val) => `${val.toFixed(2)}M`
  }
};

