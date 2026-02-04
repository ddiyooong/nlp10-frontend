import { useState, useMemo, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, X } from 'lucide-react';

// Components
import { 
  Header, 
  ForecastChart, 
  KeyFactors, 
  ReasoningReport, 
  MarketMetrics, 
  NewsFeed,
  SimilarPatterns,
  WhatIfAnalysis
} from '../components';

// Utils
import { generateChartData, calculateAccuracy, generateSimulationData } from '../utils/formatters';
import { fetchChartData, fetchDateDetail, toAPIDateFormat } from '../utils/dataAdapter';

/**
 * AgriFlow AI 메인 대시보드 컴포넌트
 * 농산물 선물 가격 예측 대시보드
 */
const Dashboard = () => {
  // 차트 데이터
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 시뮬레이션 데이터 상태
  const [simulationData, setSimulationData] = useState(null);

  // 선택된 날짜 상태 (null = 오늘 기준, 값이 있으면 해당 날짜 기준)
  const [selectedDate, setSelectedDate] = useState(null);
  
  // 선택된 날짜의 상세 데이터 (API에서 가져온 factors, reasoning)
  const [dateDetail, setDateDetail] = useState(null);
  
  // 품목명 (현재는 Corn 고정, 추후 상태로 관리 가능)
  const [commodity] = useState('Corn');

  // 초기 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 날짜 범위 설정: 과거 30일 ~ 미래 60일
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 60);
        
        // API에서 차트 데이터 가져오기
        const chartData = await fetchChartData(commodity, startDate, endDate);
        
        if (chartData.length === 0) {
          // API 실패 시 Mock 데이터로 fallback
          console.warn('API data not available, using mock data');
          setData(generateChartData());
        } else {
          setData(chartData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message);
        // 에러 발생 시 Mock 데이터로 fallback
        setData(generateChartData());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [commodity]);
  
  // 모델 정확도 계산
  const accuracy = useMemo(() => calculateAccuracy(data), [data]);
  
  // 표시할 차트 데이터 (시뮬레이션이 있으면 시뮬레이션 데이터, 없으면 원본)
  const chartData = useMemo(() => {
    if (simulationData) {
      return generateSimulationData(data, simulationData);
    }
    return data;
  }, [data, simulationData]);

  // 선택된 날짜의 데이터 가져오기
  const selectedDateData = useMemo(() => {
    if (!selectedDate) return null;
    return chartData.find(d => d.date === selectedDate);
  }, [selectedDate, chartData]);
  
  // 시뮬레이션 핸들러
  const handleSimulation = (simData) => {
    setSimulationData(simData);
    // 시뮬레이션이 초기화되면 선택된 날짜도 초기화
    if (!simData) {
      setSelectedDate(null);
    }
  };

  // 오늘 가격 가져오기 (비교용)
  const todayPrice = useMemo(() => {
    const today = data.find(d => d.isToday);
    return today?.actual || today?.forecast || 0;
  }, [data]);

  // 날짜 선택 핸들러
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    
    // 선택된 날짜의 상세 데이터 가져오기
    const selectedPoint = data.find(d => d.date === date);
    if (selectedPoint && selectedPoint.apiDate) {
      try {
        const detail = await fetchDateDetail(commodity, selectedPoint.apiDate);
        setDateDetail(detail);
      } catch (err) {
        console.error('Failed to fetch date detail:', err);
        setDateDetail(null);
      }
    }
  };

  // 날짜 선택 해제 (오늘 기준으로 리셋)
  const handleResetDate = () => {
    setSelectedDate(null);
    setDateDetail(null);
  };
  
  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-400">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1600px] mx-auto p-6 space-y-8">
        {/* 선택된 날짜 예측 정보 카드 */}
        {selectedDate && selectedDateData && (
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            {/* 닫기 버튼 */}
            <button
              onClick={handleResetDate}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* 날짜 정보 */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <Calendar className="text-indigo-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">선택된 예측 날짜</p>
                  <p className="text-2xl font-bold text-white">{selectedDate}</p>
                </div>
              </div>
              
              {/* 구분선 */}
              <div className="hidden md:block w-px h-16 bg-slate-700"></div>
              
              {/* 예측 가격 */}
              <div className="flex-1 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">예측 가격</p>
                  <p className="text-2xl font-bold text-indigo-400">${selectedDateData.forecast?.toFixed(2)}</p>
                  {todayPrice > 0 && (
                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                      selectedDateData.forecast > todayPrice ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {selectedDateData.forecast > todayPrice ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {((selectedDateData.forecast - todayPrice) / todayPrice * 100).toFixed(2)}% vs 오늘
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">상한 (90%)</p>
                  <p className="text-lg font-bold text-emerald-400">${selectedDateData.ci_upper?.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">하한 (90%)</p>
                  <p className="text-lg font-bold text-rose-400">${selectedDateData.ci_lower?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. 시계열 예측 차트 + What-if 분석 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <div className="xl:col-span-2">
            <ForecastChart 
              data={chartData}
              originalData={simulationData ? data : null}
              accuracy={accuracy}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              isSimulation={!!simulationData}
            />
          </div>
          <div className="xl:col-span-1">
            <WhatIfAnalysis onSimulate={handleSimulation} />
          </div>
        </section>

        {/* 2. 분석 그룹: 핵심 변수 + AI 리포트 + 유사 패턴 */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <KeyFactors 
              selectedDate={selectedDate} 
              factors={dateDetail?.factors}
            />
            <ReasoningReport 
              selectedDate={selectedDate} 
              reasoning={dateDetail?.reasoning}
            />
          </div>
          <SimilarPatterns />
        </section>

        {/* 3. 상세 변수 + 뉴스 피드 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MarketMetrics />
          <NewsFeed />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

