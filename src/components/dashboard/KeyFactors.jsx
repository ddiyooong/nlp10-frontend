import { Layers } from 'lucide-react';
import { getFactorsByDate } from '../../data/mockData';

/**
 * 핵심 변수 기여도 컴포넌트
 * TFT 모델의 Feature Importance 시각화
 * @param {Object} props
 * @param {string|null} props.selectedDate - 선택된 날짜 (null이면 오늘 기준)
 * @param {Array|null} props.factors - API에서 가져온 factors 데이터 (없으면 Mock 사용)
 */
const KeyFactors = ({ selectedDate, factors: propFactors }) => {
  // API 데이터가 있으면 사용, 없으면 Mock 데이터 사용
  const factors = propFactors || getFactorsByDate(selectedDate);
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl lg:col-span-1">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="text-amber-400" size={20} />
        <h3 className="text-white font-bold text-lg">
          핵심 변수 기여도 (Top Factors)
          {selectedDate && (
            <span className="text-xs text-indigo-400 ml-2">({selectedDate})</span>
          )}
        </h3>
      </div>
      <div className="space-y-6">
        {factors.map((factor, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-bold">{factor.label}</span>
              <span className="text-emerald-400 font-mono">{factor.val}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
              <div 
                className={`h-full ${factor.color}`} 
                style={{ width: `${factor.val}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-500">{factor.desc}</p>
              <span className="text-[9px] text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {factor.group}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyFactors;

