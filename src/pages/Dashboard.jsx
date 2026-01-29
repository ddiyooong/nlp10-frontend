import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, X } from 'lucide-react';

// Components
import { 
  Header, 
  ForecastChart, 
  KeyFactors, 
  ReasoningReport, 
  MarketMetrics, 
  NewsFeed, 
  ChatBot 
} from '../components';

// Utils
import { generateChartData, calculateAccuracy } from '../utils/formatters';

/**
 * AgriFlow AI 메인 대시보드 컴포넌트
 * 농산물 선물 가격 예측 대시보드
 */
const Dashboard = () => {
  // 차트 데이터 (Mock)
  const [data] = useState(() => generateChartData());

  // 선택된 날짜 상태 (null = 오늘 기준, 값이 있으면 해당 날짜 기준)
  const [selectedDate, setSelectedDate] = useState(null);

  // 모델 정확도 계산
  const accuracy = useMemo(() => calculateAccuracy(data), [data]);

  // 선택된 날짜의 데이터 가져오기
  const selectedDateData = useMemo(() => {
    if (!selectedDate) return null;
    return data.find(d => d.date === selectedDate);
  }, [selectedDate, data]);

  // 오늘 가격 가져오기 (비교용)
  const todayPrice = useMemo(() => {
    const today = data.find(d => d.isToday);
    return today?.actual || today?.forecast || 0;
  }, [data]);

  // 날짜 선택 핸들러
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // 날짜 선택 해제 (오늘 기준으로 리셋)
  const handleResetDate = () => {
    setSelectedDate(null);
  };

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

        {/* 1. 시계열 예측 차트 */}
        <ForecastChart 
          data={data} 
          accuracy={accuracy}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* 2. XAI 대시보드: 핵심 변수 + AI 리포트 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KeyFactors selectedDate={selectedDate} />
          <ReasoningReport selectedDate={selectedDate} />
        </section>

        {/* 3. 상세 변수 + 뉴스 피드 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MarketMetrics />
          <NewsFeed />
        </section>
      </main>

      {/* AI 챗봇 */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;

