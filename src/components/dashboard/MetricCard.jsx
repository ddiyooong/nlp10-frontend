import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * 단일 지표 카드 컴포넌트
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide 아이콘 컴포넌트
 * @param {string} props.label - 지표 라벨
 * @param {string} props.value - 현재 값
 * @param {number} props.trend - 변화율 (%)
 * @param {string} props.sub - 보조 설명
 * @param {string} props.impact - 영향력 수준 (High, Medium, Low)
 * @param {string} props.group - 그룹 분류
 */
const MetricCard = ({ icon: Icon, label, value, trend, sub, impact, group }) => {
  const impactColors = { 
    'High': 'text-rose-400 bg-rose-500/10', 
    'Medium': 'text-amber-400 bg-amber-500/10', 
    'Low': 'text-slate-400 bg-slate-700/50' 
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all h-full relative overflow-hidden">
      {/* Group Label */}
      <div className="absolute top-0 right-0 px-2 py-1 bg-slate-950/50 rounded-bl-lg border-b border-l border-slate-800 text-[9px] font-mono text-slate-500">
        {group}
      </div>

      <div className="flex items-start gap-3 mt-1">
        <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400 shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase truncate pr-4">{label}</p>
          <p className="text-lg font-bold text-white leading-tight mt-0.5">{value}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-3">
        <p className="text-[10px] text-slate-500">{sub}</p>
        <div className="text-right flex flex-col items-end gap-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${impactColors[impact]}`}>
            {impact}
          </span>
          <span className={`text-xs font-bold flex items-center ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(trend)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

