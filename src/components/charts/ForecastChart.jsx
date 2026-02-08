import { 
  ResponsiveContainer, ComposedChart, Area, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import { Target, CheckCircle2 } from 'lucide-react';

/**
 * 가격 예측 차트 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 차트 데이터 (시뮬레이션 또는 원본)
 * @param {Array} props.originalData - 원본 차트 데이터 (시뮬레이션 비교용)
 * @param {string} props.accuracy - 모델 정확도 (%)
 * @param {string|null} props.selectedDate - 선택된 날짜
 * @param {Function} props.onDateSelect - 날짜 선택 핸들러
 * @param {boolean} props.isSimulation - 시뮬레이션 모드 여부
 */
const ForecastChart = ({ data, originalData, accuracy, selectedDate, onDateSelect, isSimulation = false }) => {
  const todayData = data.find(d => d.isToday);
  
  // activeDot 클릭 핸들러 (recharts 이벤트 형식)
  const handleActiveDotClick = (event, payload) => {
    if (!onDateSelect || !payload) return;
    
    // 미래 날짜만 선택 가능
    if (payload.payload && payload.payload.isFuture) {
      onDateSelect(payload.payload.date);
    }
  };
  
  // 선택된 날짜 Dot 컴포넌트
  const SelectedDot = (props) => {
    const { cx, cy, payload } = props;
    
    // 선택된 날짜가 아니면 표시하지 않음
    if (!payload || !payload.isFuture || payload.date !== selectedDate) return null;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#818cf8"
        stroke="#fff"
        strokeWidth={3}
      />
    );
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col" style={{ height: '600px' }}>
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="text-emerald-400" />
              옥수수 선물 가격 예측 (Corn Futures)
            </h2>
            {isSimulation && (
              <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-cyan-400">
                  시뮬레이션 모드
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">
                모델 정확도 {accuracy}%
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            {isSimulation 
              ? 'What-if 시뮬레이션 결과: 변수 조절에 따른 미래 60일 예측'
              : '과거 30일 모델 검증 (보라색) + 향후 60일 추세 전망 (청록색)'
            }
          </p>
        </div>

        {/* 범례 */}
        <div className="flex gap-4 text-xs font-bold bg-slate-950 p-2 rounded-lg border border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 px-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span className="text-slate-300">실제 가격 (Actual)</span>
          </div>
          <div className="flex items-center gap-2 px-2 border-l border-slate-800">
            <div className="w-3 h-0.5 border-t border-dashed border-purple-400"></div>
            <span className="text-purple-300">과거 모델 예측</span>
          </div>
          {isSimulation && (
            <div className="flex items-center gap-2 px-2 border-l border-slate-800">
              <div className="w-3 h-0.5 border-t border-dashed border-indigo-400"></div>
              <span className="text-indigo-300">원본 예측</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-2 border-l border-slate-800">
            <div className="w-3 h-0.5 border-t border-dashed border-cyan-400"></div>
            <span className="text-cyan-300">
              {isSimulation ? '시뮬레이션 예측' : 'AI 예측'}
            </span>
          </div>
          <div className="flex items-center gap-2 px-2 border-l border-slate-800">
            <div className="w-3 h-3 bg-indigo-500/20 border border-indigo-500/20 rounded-sm"></div>
            <span className="text-slate-400">90% 신뢰구간</span>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={data} 
            margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} minTickGap={30} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} orientation="right" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }} 
              itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}
              formatter={(value, name, props) => {
                if (name === 'actual') return [`$${value}`, '실제 가격'];
                if (name === 'ai_past') return [`$${value} (오차: ${props.payload.errorRate}%)`, '과거 AI 예측'];
                if (name === 'forecast') return [`$${value}`, '미래 AI 예측'];
                if (name === 'ci_upper') return [`$${value}`, '상위 90% (Upper)'];
                if (name === 'ci_lower') return [`$${value}`, '하위 90% (Lower)'];
                return [value, name];
              }}
            />
            <ReferenceLine 
              x={todayData?.date} 
              stroke="#F59E0B" 
              strokeDasharray="3 3" 
              label={{ position: 'top', value: 'TODAY', fill: '#F59E0B', fontSize: 10, fontWeight: 'bold' }} 
            />
            {/* 선택된 날짜 표시 */}
            {selectedDate && (
              <ReferenceLine 
                x={selectedDate} 
                stroke="#818cf8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ position: 'top', value: 'SELECTED', fill: '#818cf8', fontSize: 10, fontWeight: 'bold' }} 
              />
            )}
            <Area type="monotone" dataKey="ci_upper" stroke="none" fill="url(#ciGradient)" />
            <Area type="monotone" dataKey="ci_lower" stroke="none" fill="#020617" />
            
            {/* 원본 예측 라인 (시뮬레이션 모드일 때만) */}
            {isSimulation && originalData && (
              <Line 
                type="monotone" 
                data={originalData}
                dataKey="forecast" 
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={<SelectedDot />}
                activeDot={{
                  r: 8,
                  fill: '#818cf8',
                  stroke: '#fff',
                  strokeWidth: 2,
                  cursor: 'pointer',
                  onClick: handleActiveDotClick
                }}
                name="원본 예측"
              />
            )}
            
            {/* 시뮬레이션/예측 라인 */}
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke={isSimulation ? "#06b6d4" : "#818cf8"}
              strokeWidth={isSimulation ? 3 : 2}
              strokeDasharray={isSimulation ? "8 4" : "5 5"}
              dot={isSimulation ? false : <SelectedDot />}
              activeDot={isSimulation ? false : {
                r: 8,
                fill: '#818cf8',
                stroke: '#fff',
                strokeWidth: 2,
                cursor: 'pointer',
                onClick: handleActiveDotClick
              }}
              name={isSimulation ? "시뮬레이션 예측" : "forecast"}
            />
            <Line type="monotone" dataKey="ai_past" stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 4" dot={false} name="ai_past" connectNulls={true} />
            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={false} name="actual" connectNulls={true} />
          </ComposedChart>
        </ResponsiveContainer>
        {onDateSelect && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            💡 미래 날짜를 클릭하면 해당 날짜의 예측 데이터를 확인할 수 있습니다.
          </p>
        )}
      </div>
    </section>
  );
};

export default ForecastChart;

