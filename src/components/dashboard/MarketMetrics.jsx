import { BarChart3 } from 'lucide-react';
import MetricCard from './MetricCard';
import { MARKET_METRICS } from '../../data/mockData';

/**
 * 상세 변수 현황 그리드 컴포넌트
 * 8개의 시장 지표를 4열 그리드로 표시
 */
const MarketMetrics = () => {
  return (
    <div className="xl:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-slate-400" size={18} />
        <h3 className="text-white font-bold">상세 변수 현황 (Market Indicators)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKET_METRICS.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default MarketMetrics;




