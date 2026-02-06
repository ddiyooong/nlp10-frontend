import { BrainCircuit, FileText, Zap, AlertCircle } from 'lucide-react';

/**
 * AI 예측 근거 리포트 컴포넌트
 * Executive Summary + 고영향 뉴스 분석
 * @param {Object} props
 * @param {string|null} props.selectedDate - 선택된 날짜 (null이면 오늘 기준)
 * @param {Object|null} props.reasoning - API에서 가져온 reasoning 데이터
 */
const ReasoningReport = ({ selectedDate, reasoning }) => {
  const summary = reasoning?.summary;
  const impactNews = reasoning?.impactNews || [];
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl lg:col-span-2 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <BrainCircuit className="text-emerald-400" size={20} />
        <h3 className="text-white font-bold text-lg">
          AI 예측 근거 리포트 (Reasoning)
          {selectedDate && (
            <span className="text-xs text-indigo-400 ml-2">({selectedDate})</span>
          )}
        </h3>
      </div>
      
      {!reasoning || !summary ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 text-sm mb-1">분석 데이터가 없습니다</p>
          <p className="text-slate-600 text-xs">
            {selectedDate ? '선택한 날짜의 분석을 불러올 수 없습니다' : 'API 연동이 필요합니다'}
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-6">
          {/* Executive Summary */}
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
            <div className="flex gap-3">
              <FileText className="text-slate-500 shrink-0 mt-1" size={18} />
              <div>
                <h4 className="text-emerald-400 font-bold text-sm mb-1 uppercase">
                  Executive Summary
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          </div>

          {/* 고영향 뉴스 분석 */}
          {impactNews.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                고영향 뉴스 분석 (Top 3 Impact)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {impactNews.map((news, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-500 font-bold">{news.source}</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Impact Score: {news.impact_score}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-200 mb-2">{news.title}</h5>
                    <div className="flex items-start gap-2">
                      <BrainCircuit size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-indigo-200/80 leading-snug">
                        <span className="font-bold text-indigo-400">AI Analysis:</span>{' '}
                        {news.analysis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReasoningReport;

