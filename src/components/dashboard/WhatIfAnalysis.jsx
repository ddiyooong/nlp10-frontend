import { useState } from 'react';
import { Sliders, TrendingUp, TrendingDown, RotateCcw, Save, BarChart3, Play, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchSimulation } from '../../services/api';
import { toAPIDateFormat } from '../../utils/dataAdapter';

// 새로운 Feature 설정
const DEFAULT_FEATURE_VALUES = {
  '10Y_Yield': 4.2,
  'USD_Index': 103.5,
  'pdsi': -1.0,
  'spi30d': 0.0,
  'spi90d': 0.0,
};

const FEATURE_CONFIG = {
  '10Y_Yield': {
    label: '10년물 국채 금리',
    unit: '%',
    min: 0,
    max: 10,
    step: 0.1,
    format: (val) => `${val.toFixed(1)}%`
  },
  'USD_Index': {
    label: '달러 인덱스',
    unit: '',
    min: 80,
    max: 120,
    step: 0.5,
    format: (val) => val.toFixed(1)
  },
  'pdsi': {
    label: 'Palmer 가뭄 지수',
    unit: '',
    min: -6,
    max: 6,
    step: 0.1,
    format: (val) => val.toFixed(1)
  },
  'spi30d': {
    label: '30일 강수량 지수',
    unit: '',
    min: -3,
    max: 3,
    step: 0.1,
    format: (val) => val.toFixed(1)
  },
  'spi90d': {
    label: '90일 강수량 지수',
    unit: '',
    min: -3,
    max: 3,
    step: 0.1,
    format: (val) => val.toFixed(1)
  },
};

/**
 * What-if 분석 대시보드 컴포넌트
 * Feature 값을 조절하여 예측 가격 변화를 시뮬레이션
 * @param {Object} props
 * @param {Function} props.onSimulate - 시뮬레이션 실행 시 호출되는 콜백 (시뮬레이션 데이터 전달)
 * @param {number} props.baseForecast - 현재 예측 가격
 * @param {string} props.commodity - 품목명
 */
const WhatIfAnalysis = ({ onSimulate, baseForecast = 450, commodity = 'corn' }) => {
  const [featureValues, setFeatureValues] = useState({ ...DEFAULT_FEATURE_VALUES });
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  // Feature 값 업데이트 핸들러
  const handleFeatureChange = (featureKey, value) => {
    setFeatureValues(prev => ({
      ...prev,
      [featureKey]: parseFloat(value)
    }));
  };

  // 예측하기 핸들러
  const handleSimulate = async () => {
    try {
      setIsSimulating(true);
      setError(null);
      
      // 오늘 날짜를 base_date로 사용
      const today = new Date();
      const baseDate = toAPIDateFormat(today);
      
      // API 호출
      const result = await fetchSimulation(commodity, baseDate, featureValues);
      
      // 결과 저장
      setSimulationResult({
        originalForecast: result.original_forecast,
        simulatedForecast: result.simulated_forecast,
        change: result.change,
        changePercent: result.change_percent,
        featureImpacts: result.feature_impacts
      });
      
      // Dashboard로 시뮬레이션 데이터 전달
      if (onSimulate) {
        onSimulate({
          featureValues: { ...featureValues },
          result: {
            originalForecast: result.original_forecast,
            simulatedForecast: result.simulated_forecast,
            change: result.change,
            changePercent: result.change_percent
          }
        });
      }
    } catch (err) {
      console.error('Simulation failed:', err);
      setError(err.message || '시뮬레이션에 실패했습니다.');
    } finally {
      setIsSimulating(false);
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col" style={{ height: '600px' }}>
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="text-cyan-400" size={20} />
        <h3 className="text-white font-bold text-lg">
          What-if Analysis (예측 시뮬레이션)
        </h3>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        변수 값을 조절하여 예측 변화를 확인하세요
      </p>
      
      <div className="flex-1 overflow-y-auto"
        style={{ maxHeight: 'calc(100% - 120px)' }}
      >

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
              className={`border rounded-xl p-4 transition-all ${
                isChanged 
                  ? 'bg-cyan-900/20 border-cyan-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <label className={`text-sm font-bold transition-colors ${
                  isChanged ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  {config.label}
                </label>
                <span className={`text-sm font-mono font-bold transition-colors ${
                  isChanged ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  {config.format(currentValue)}
                </span>
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
          disabled={isSimulating}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-bold shadow-lg hover:shadow-cyan-500/50"
        >
          <Play size={18} />
          {isSimulating ? '시뮬레이션 중...' : '예측하기'}
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-rose-400 font-bold text-sm mb-1">시뮬레이션 오류</p>
            <p className="text-rose-300 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* 예측 결과 비교 섹션 */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 mb-6">
        {isSimulating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-slate-400 text-sm">시뮬레이션 중...</p>
          </div>
        ) : simulationResult ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">현재 예측</p>
                <p className="text-2xl font-bold text-slate-300 font-mono">
                  ${simulationResult.originalForecast.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">시뮬레이션 예측</p>
                <p className="text-2xl font-bold font-mono text-cyan-400 mb-1">
                  ${simulationResult.simulatedForecast.toFixed(2)}
                </p>
                {simulationResult.change !== 0 && (
                  <div className={`flex items-center gap-1 text-xs font-bold ${
                    simulationResult.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.change > 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    <span>
                      {simulationResult.change > 0 ? '+' : ''}
                      ${simulationResult.change.toFixed(2)} ({simulationResult.changePercent > 0 ? '+' : ''}
                      {simulationResult.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Play size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm">
              변수를 조절한 후 <span className="text-cyan-400 font-bold">"예측하기"</span> 버튼을 눌러
            </p>
            <p className="text-slate-400 text-sm">
              시뮬레이션 결과를 확인하세요
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default WhatIfAnalysis;

