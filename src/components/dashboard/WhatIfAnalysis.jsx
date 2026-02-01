import { useState } from 'react';
import { Sliders, TrendingUp, TrendingDown, RotateCcw, Save, BarChart3, Play } from 'lucide-react';
import { 
  DEFAULT_FEATURE_VALUES, 
  FEATURE_CONFIG, 
  calculateWhatIfForecast 
} from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * What-if 분석 대시보드 컴포넌트
 * Feature 값을 조절하여 예측 가격 변화를 시뮬레이션
 * @param {Object} props
 * @param {Function} props.onSimulate - 시뮬레이션 실행 시 호출되는 콜백 (시뮬레이션 데이터 전달)
 */
const WhatIfAnalysis = ({ onSimulate }) => {
  const [featureValues, setFeatureValues] = useState({ ...DEFAULT_FEATURE_VALUES });
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // 현재 예측 가격 (Mock - 실제로는 API에서 가져와야 함)
  const baseForecast = 452.30;

  // Feature 값 업데이트 핸들러
  const handleFeatureChange = (featureKey, value) => {
    setFeatureValues(prev => ({
      ...prev,
      [featureKey]: parseFloat(value)
    }));
  };

  // 예측하기 핸들러
  const handleSimulate = () => {
    const result = calculateWhatIfForecast(featureValues, baseForecast);
    setSimulationResult(result);
    
    // Dashboard로 시뮬레이션 데이터 전달
    if (onSimulate) {
      onSimulate({
        featureValues: { ...featureValues },
        result: result
      });
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    setFeatureValues({ ...DEFAULT_FEATURE_VALUES });
    setSimulationResult(null);
    if (onSimulate) {
      onSimulate(null); // 시뮬레이션 초기화
    }
  };

  // 시나리오 저장 핸들러
  const handleSaveScenario = () => {
    if (!simulationResult) return;
    
    const scenario = {
      id: Date.now(),
      name: `시나리오 ${savedScenarios.length + 1}`,
      featureValues: { ...featureValues },
      result: { ...simulationResult },
      timestamp: new Date().toISOString()
    };
    setSavedScenarios(prev => [...prev, scenario]);
  };

  // 비교용 차트 데이터 생성
  const comparisonChartData = (() => {
    if (!showComparison || savedScenarios.length === 0) return null;

    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return dates.map((date, idx) => {
      const data = {
        date,
        original: baseForecast + (idx * 0.5), // Mock 추세
      };

      savedScenarios.forEach((scenario, sIdx) => {
        const scenarioForecast = scenario.result.simulatedForecast;
        data[`scenario${sIdx + 1}`] = scenarioForecast + (idx * 0.5);
      });

      return data;
    });
  })();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="text-cyan-400" size={20} />
        <h3 className="text-white font-bold text-lg">
          What-if Analysis (예측 시뮬레이션)
        </h3>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        변수 값을 조절하여 예측 변화를 확인하세요
      </p>

      {/* Feature 슬라이더 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.keys(FEATURE_CONFIG).map((featureKey) => {
          const config = FEATURE_CONFIG[featureKey];
          const currentValue = featureValues[featureKey];
          const defaultValue = DEFAULT_FEATURE_VALUES[featureKey];
          const isChanged = currentValue !== defaultValue;

          return (
            <div
              key={featureKey}
              className={`bg-slate-800/50 border rounded-xl p-4 ${
                isChanged ? 'border-cyan-500/50' : 'border-slate-700/50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-300">
                  {config.label}
                </label>
                <div className="flex items-center gap-2">
                  {isChanged && (
                    <span className="text-xs text-cyan-400">변경됨</span>
                  )}
                  <span className="text-sm font-mono text-emerald-400">
                    {config.format(currentValue)}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={currentValue}
                onChange={(e) => handleFeatureChange(featureKey, e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{config.format(config.min)}</span>
                <span className="text-slate-400">현재: {config.format(defaultValue)}</span>
                <span>{config.format(config.max)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleSimulate}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-bold shadow-lg hover:shadow-cyan-500/50"
        >
          <Play size={18} />
          예측하기
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-bold"
        >
          <RotateCcw size={16} />
          초기화
        </button>
        {simulationResult && (
          <button
            onClick={handleSaveScenario}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-bold"
          >
            <Save size={16} />
            시나리오 저장
          </button>
        )}
        {savedScenarios.length > 0 && (
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold ${
              showComparison
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <BarChart3 size={16} />
            시나리오 비교 {showComparison ? '숨기기' : '보기'}
          </button>
        )}
      </div>

      {/* 예측 결과 비교 섹션 (시뮬레이션 실행 후에만 표시) */}
      {simulationResult && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">현재 예측</p>
              <p className="text-2xl font-bold text-slate-300 font-mono">
                ${baseForecast.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">시뮬레이션 예측</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold font-mono text-cyan-400">
                  ${simulationResult.simulatedForecast.toFixed(2)}
                </p>
                {simulationResult.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    simulationResult.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.change > 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {simulationResult.change > 0 ? '+' : ''}
                    ${simulationResult.change.toFixed(2)} ({simulationResult.changePercent > 0 ? '+' : ''}
                    {simulationResult.changePercent.toFixed(2)}%)
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">변화량</p>
              <p className={`text-xl font-bold font-mono ${
                simulationResult.change === 0 
                  ? 'text-slate-500' 
                  : simulationResult.change > 0 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
              }`}>
                {simulationResult.change === 0 
                  ? '변화 없음' 
                  : `${simulationResult.change > 0 ? '+' : ''}${simulationResult.change.toFixed(2)}`
                }
              </p>
            </div>
          </div>

          {/* Feature별 기여도 */}
          {simulationResult.featureImpacts.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 uppercase font-bold mb-3">
                Feature별 기여도
              </p>
              <div className="space-y-2">
                {simulationResult.featureImpacts.map((impact, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      {FEATURE_CONFIG[impact.feature].label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {impact.valueChange > 0 ? '+' : ''}
                        {impact.valueChange.toFixed(2)}
                      </span>
                      <span className={`text-sm font-mono font-bold ${
                        impact.contribution > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {impact.contribution > 0 ? '+' : ''}
                        ${impact.contribution.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 저장된 시나리오 목록 */}
      {savedScenarios.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase font-bold mb-3">
            저장된 시나리오 ({savedScenarios.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-300">{scenario.name}</span>
                  <span className={`text-xs font-mono font-bold ${
                    scenario.result.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {scenario.result.change > 0 ? '+' : ''}
                    ${scenario.result.change.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  예측: ${scenario.result.simulatedForecast.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 비교 차트 */}
      {showComparison && comparisonChartData && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-bold mb-4">
            시나리오 비교 차트
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  orientation="right"
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#020617', 
                    borderColor: '#334155', 
                    borderRadius: '12px' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="original" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="현재 예측"
                  dot={false}
                />
                {savedScenarios.map((scenario, idx) => (
                  <Line
                    key={scenario.id}
                    type="monotone"
                    dataKey={`scenario${idx + 1}`}
                    stroke={idx === 0 ? '#06b6d4' : idx === 1 ? '#8b5cf6' : '#f59e0b'}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={scenario.name}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfAnalysis;

