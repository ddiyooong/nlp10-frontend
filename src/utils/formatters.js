/**
 * 날짜 포맷 유틸리티
 */

/**
 * Date 객체를 M/D 형식 문자열로 변환
 * @param {Date} date - 변환할 날짜 객체
 * @returns {string} M/D 형식 문자열 (예: "1/29")
 */
export const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;

/**
 * 차트 데이터 생성 (Mock Data)
 * 과거 30일 + 미래 60일 데이터 생성
 * @returns {Array} 차트 데이터 배열
 */
export const generateChartData = () => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30);
  
  let currentPrice = 450;
  
  for (let i = 0; i <= 90; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const isFuture = d > today;
    const isToday = d.toDateString() === today.toDateString();
    
    const volatility = isFuture ? 8 : 5;
    const change = (Math.random() - 0.48) * volatility;
    currentPrice += change;

    const point = {
      date: formatDate(d),
      isFuture,
      isToday,
      forecast: null,
      ci_upper: null,
      ci_lower: null,
      actual: null,
      ai_past: null,
      errorRate: null, 
    };

    if (isFuture) {
      point.forecast = Number(currentPrice.toFixed(2));
      const uncertainty = (i - 30) * 0.8 + 5; 
      point.ci_upper = Number((currentPrice + uncertainty).toFixed(2));
      point.ci_lower = Number((currentPrice - uncertainty).toFixed(2));
    } else {
      point.actual = Number(currentPrice.toFixed(2));
      const error = (Math.random() - 0.5) * 6; 
      point.ai_past = Number((currentPrice + error).toFixed(2));
      point.errorRate = (Math.abs(point.actual - point.ai_past) / point.actual * 100).toFixed(2);
      if (isToday) point.forecast = point.actual;
    }
    data.push(point);
  }
  return data;
};

/**
 * 모델 정확도 계산
 * @param {Array} data - 차트 데이터 배열
 * @returns {string} 정확도 (소수점 1자리)
 */
export const calculateAccuracy = (data) => {
  const pastData = data.filter(d => !d.isFuture);
  if (pastData.length === 0) return '0';
  const totalError = pastData.reduce((acc, curr) => acc + parseFloat(curr.errorRate || 0), 0);
  const avgError = totalError / pastData.length;
  return (100 - avgError).toFixed(1);
};

/**
 * 시뮬레이션 데이터 생성
 * 원본 데이터를 기반으로 시뮬레이션 결과를 반영한 미래 예측 데이터 생성
 * @param {Array} originalData - 원본 차트 데이터
 * @param {Object} simulationResult - 시뮬레이션 결과 (change, changePercent 포함)
 * @returns {Array} 시뮬레이션 데이터 배열
 */
export const generateSimulationData = (originalData, simulationResult) => {
  // 안전성 체크: 새로운 API 구조 확인
  if (!simulationResult || 
      !simulationResult.predictions || 
      !Array.isArray(simulationResult.predictions)) {
    console.warn('Invalid simulation result:', simulationResult);
    return originalData;
  }

  // predictions 배열을 날짜별 Map으로 변환
  const predictionMap = new Map();
  simulationResult.predictions.forEach(pred => {
    predictionMap.set(pred.date, pred);
  });
  
  return originalData.map((point) => {
    const newPoint = { ...point };
    
    // 미래 데이터만 시뮬레이션 결과 반영
    if (point.isFuture && point.apiDate) {
      const simPrediction = predictionMap.get(point.apiDate);
      
      if (simPrediction) {
        // API에서 받은 시뮬레이션 가격 직접 사용
        newPoint.forecast = Number(simPrediction.simulated_price.toFixed(2));
        
        // 신뢰구간은 변화율 비율로 조정
        if (point.ci_upper && simPrediction.original_price > 0) {
          const ratio = simPrediction.simulated_price / simPrediction.original_price;
          newPoint.ci_upper = Number((point.ci_upper * ratio).toFixed(2));
        }
        if (point.ci_lower && simPrediction.original_price > 0) {
          const ratio = simPrediction.simulated_price / simPrediction.original_price;
          newPoint.ci_lower = Number((point.ci_lower * ratio).toFixed(2));
        }
        
        // 시뮬레이션 데이터임을 표시
        newPoint.isSimulation = true;
      }
    }
    
    return newPoint;
  });
};



