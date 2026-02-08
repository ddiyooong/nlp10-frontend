import { BarChart3, AlertCircle, DollarSign, TrendingUp, Droplets, Cloud, Sun, Zap } from 'lucide-react';
import MetricCard from './MetricCard';

// Feature ID와 아이콘, 그룹 매핑
const METRIC_CONFIG = {
  '10Y_Yield': { icon: TrendingUp, group: 'Finance' },
  'USD_Index': { icon: DollarSign, group: 'Currency' },
  'pdsi': { icon: Droplets, group: 'Climate' },
  'spi30d': { icon: Cloud, group: 'Climate' },
  'spi90d': { icon: Sun, group: 'Climate' },
  'VIX': { icon: Zap, group: 'Volatility' },
  'close': { icon: BarChart3, group: 'Price' },
  'volume': { icon: BarChart3, group: 'Price' },
};

// Impact 값을 High/Medium/Low로 변환
const normalizeImpact = (impact) => {
  if (impact === 'positive' || impact === 'negative') return 'High';
  if (impact === 'neutral') return 'Low';
  return impact; // 이미 High/Medium/Low인 경우
};

/**
 * 상세 변수 현황 그리드 컴포넌트
 * 8개의 시장 지표를 4열 그리드로 표시
 * @param {Object} props
 * @param {Array|null} props.metrics - API에서 가져온 metrics 데이터
 */
const MarketMetrics = ({ metrics }) => {
  // API 응답을 MetricCard가 요구하는 형식으로 변환
  const adaptedMetrics = metrics
    ?.filter(metric => {
      // 뉴스 PCA 관련 항목 제외
      const metricId = metric.metric_id?.toLowerCase() || '';
      return !metricId.includes('news_pca') && !metricId.includes('newspca');
    })
    ?.map(metric => {
      const config = METRIC_CONFIG[metric.metric_id] || { icon: BarChart3, group: 'Other' };
      
      // 소수점 4자리까지 표시
      const formattedValue = typeof metric.numeric_value === 'number' 
        ? metric.numeric_value.toFixed(4)
        : metric.value;
      
      return {
        icon: config.icon,
        label: metric.label,
        value: formattedValue,
        trend: Math.abs(metric.trend || 0),
        sub: `Current: ${formattedValue}`,
        impact: normalizeImpact(metric.impact),
        group: config.group,
      };
    });

  return (
    <div className="xl:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-slate-400" size={18} />
        <h3 className="text-white font-bold">상세 변수 현황 (Market Indicators)</h3>
      </div>
      
      {!adaptedMetrics || adaptedMetrics.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 text-sm mb-1">시장 지표 데이터가 없습니다</p>
          <p className="text-slate-600 text-xs">API 연동이 필요합니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adaptedMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketMetrics;




