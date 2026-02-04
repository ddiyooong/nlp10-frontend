import { History, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getSimilarPatterns } from '../../data/mockData';

/**
 * 유사 패턴 과거 사례 분석 컴포넌트
 * 현재 시장 상황과 유사한 과거 패턴을 찾아 분석 결과를 제공
 */
const SimilarPatterns = () => {
  const { currentPatternRange, similarPatterns } = getSimilarPatterns();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <History className="text-purple-400" size={20} />
        <h3 className="text-white font-bold text-lg">
          유사 패턴 과거 사례 분석 (Similar Historical Patterns)
        </h3>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        현재 패턴과 유사한 과거 사례를 분석하여 미래 가격 전망에 참고할 수 있습니다.
      </p>

      <div className="space-y-4">
        {similarPatterns.map((pattern) => (
          <div
            key={pattern.rank}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* 왼쪽: 순위 및 기간 정보 */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 shrink-0">
                  <span className="text-purple-400 font-bold text-lg">#{pattern.rank}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-slate-500" size={14} />
                    <span className="text-xs text-slate-400">
                      {pattern.periodStart} ~ {pattern.periodEnd}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-slate-300">
                      당시 가격: <span className="font-mono text-emerald-400">${pattern.priceStart.toFixed(2)}</span>
                      {' → '}
                      <span className="font-mono text-indigo-400">${pattern.priceEnd.toFixed(2)}</span>
                    </span>
                    {pattern.priceChange > 0 ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <TrendingUp size={12} />
                        +{pattern.priceChange.toFixed(2)}%
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                        <TrendingDown size={12} />
                        {pattern.priceChange.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pattern.keyFactors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽: 유사도 및 결과 */}
              <div className="flex flex-col items-end gap-3 md:min-w-[200px]">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 uppercase font-bold">유사도</span>
                    <span className="text-lg font-bold text-purple-400 font-mono">
                      {pattern.similarity.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${pattern.similarity}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">이후 60일 결과</p>
                  <div className="flex items-center gap-1 justify-end">
                    {pattern.outcomeAfter60Days > 0 ? (
                      <>
                        <TrendingUp className="text-emerald-400" size={16} />
                        <span className="text-sm font-bold text-emerald-400">
                          +{pattern.outcomeAfter60Days.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="text-rose-400" size={16} />
                        <span className="text-sm font-bold text-rose-400">
                          {pattern.outcomeAfter60Days.toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-600 text-center">
        현재 분석 기간: {currentPatternRange}
      </div>
    </div>
  );
};

export default SimilarPatterns;


