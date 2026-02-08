/**
 * Data Adapter
 * API 응답 데이터를 UI 컴포넌트 형식으로 변환
 */

import { formatDate } from './formatters';
import { fetchPredictions, fetchPredictionDetail, fetchExplanation } from '../services/api';

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 * @param {Date} date - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
export const toAPIDateFormat = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식을 M/D 형식으로 변환
 * @param {string} apiDate - API 날짜 (YYYY-MM-DD)
 * @returns {string} M/D 형식
 */
export const toDisplayDateFormat = (apiDate) => {
  const [year, month, day] = apiDate.split('-');
  return `${parseInt(month)}/${parseInt(day)}`;
};


/**
 * API 예측 데이터를 차트 데이터로 변환
 * @param {string} commodity - 품목명 (예: "corn")
 * @returns {Promise<Array>} 차트 데이터 배열
 */
export const fetchChartData = async (commodity = 'corn') => {
  try {
    // API에서 예측 데이터 + 실제 가격 가져오기
    const response = await fetchPredictions(commodity);
    const { predictions = [], historical_prices = [] } = response;
    
    // 예측 데이터를 날짜별로 매핑
    const predictionMap = new Map();
    predictions.forEach(pred => {
      predictionMap.set(pred.target_date, pred);
    });
    
    // 실제 가격 데이터를 날짜별로 매핑
    const actualPriceMap = new Map();
    historical_prices.forEach(price => {
      actualPriceMap.set(price.date, price.actual_price);
    });
    
    // 차트 데이터 생성
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 전체 날짜 목록 생성 (예측 + 실제 가격 모두 포함)
    const allDates = new Set([
      ...predictions.map(p => p.target_date),
      ...historical_prices.map(p => p.date)
    ]);
    
    // 날짜 정렬
    const sortedDates = Array.from(allDates).sort();
    
    sortedDates.forEach(apiDate => {
      const [year, month, day] = apiDate.split('-');
      const currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const displayDate = toDisplayDateFormat(apiDate);
      const isFuture = currentDate > today;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      const prediction = predictionMap.get(apiDate);
      const actualPrice = actualPriceMap.get(apiDate);
      
      const point = {
        date: displayDate,
        apiDate: apiDate,
        isFuture,
        isToday,
        forecast: null,
        ci_upper: null,
        ci_lower: null,
        actual: null,
        ai_past: null,
        errorRate: null,
      };
      
      // 실제 가격 설정 (과거 데이터만)
      if (!isFuture && actualPrice !== undefined) {
        point.actual = actualPrice;
      }
      
      // 예측 데이터 설정
      if (prediction) {
        if (isFuture || isToday) {
          // 미래/오늘: forecast로 표시
          point.forecast = prediction.price_pred;
          point.ci_upper = prediction.conf_upper;
          point.ci_lower = prediction.conf_lower;
        } else {
          // 과거: ai_past로 표시 (모델의 과거 예측)
          point.ai_past = prediction.price_pred;
          
          // 실제 가격과 비교하여 오차율 계산
          if (point.actual !== null && point.ai_past !== null) {
            point.errorRate = ((Math.abs(point.actual - point.ai_past) / point.actual) * 100).toFixed(2);
          }
        }
      }
      
      data.push(point);
    });
    
    // 날짜순 정렬
    data.sort((a, b) => a.apiDate.localeCompare(b.apiDate));
    
    return data;
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    // 에러 발생 시 빈 배열 반환 (컴포넌트에서 fallback 처리)
    return [];
  }
};

/**
 * API 데이터(예측/설명)를 KeyFactors 형식으로 변환
 * 우선순위: explanation.top_factors > prediction.topX_factor
 * @param {Object} prediction - API 예측 데이터
 * @param {Object} explanation - API 설명 데이터 (Optional)
 * @returns {Array} KeyFactors 형식 배열
 */
export const adaptKeyFactors = (prediction, explanation = null) => {
  const factors = [];
  const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
  
  // 1순위: Explanation의 top_factors 사용 (ratio 기반)
  if (explanation && explanation.top_factors && explanation.top_factors.length > 0) {
    explanation.top_factors.slice(0, 5).forEach((factor, i) => {
      factors.push({
        label: factor.name,
        group: factor.category, // 카테고리 표시
        val: Math.round(factor.ratio * 100), // ratio를 퍼센트로 변환
        color: colors[i % colors.length],
        desc: `기여도: ${(factor.ratio * 100).toFixed(1)}%`
      });
    });
    
    return factors;
  }
  
  // 2순위: Prediction의 topX_factor 사용 (기존 로직 fallback)
  if (!prediction) return null;
  
  for (let i = 1; i <= 5; i++) {
    const factorKey = `top${i}_factor`;
    const impactKey = `top${i}_impact`;
    
    if (prediction[factorKey] && prediction[impactKey] !== undefined) {
      factors.push({
        label: prediction[factorKey],
        group: `Factor ${i}`,
        val: Math.round(prediction[impactKey] * 100), // 0-1 스케일을 0-100으로 변환
        color: colors[(i - 1) % colors.length],
        desc: `영향도: ${(prediction[impactKey] * 100).toFixed(1)}%`
      });
    }
  }
  
  // 영향도 순으로 정렬
  factors.sort((a, b) => b.val - a.val);
  
  return factors.length > 0 ? factors : null;
};

/**
 * API 설명 데이터를 ReasoningReport 형식으로 변환
 * @param {Object} explanation - API 설명 데이터
 * @returns {Object} { summary, impactNews, topFactors, categorySummary, llmModel }
 */
export const adaptReasoningReport = (explanation) => {
  if (!explanation || !explanation.content) return null;
  
  return {
    summary: explanation.content,
    impactNews: explanation.impact_news || [], // 고영향 뉴스 (구조 변경)
    topFactors: explanation.top_factors || [], // 상위 영향 요인 (새로 추가)
    categorySummary: explanation.category_summary || [], // 카테고리별 영향도 (새로 추가)
    llmModel: explanation.llm_model || 'Unknown'
  };
};

/**
 * 특정 날짜의 상세 데이터 가져오기
 * @param {string} commodity - 품목명
 * @param {string} targetDate - 대상 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} { prediction, factors, reasoning }
 */
export const fetchDateDetail = async (commodity, targetDate) => {
  try {
    const [prediction, explanation] = await Promise.all([
      fetchPredictionDetail(commodity, targetDate),
      fetchExplanation(commodity, targetDate).catch(() => null), // 설명이 없을 수 있음
    ]);
    
    return {
      prediction,
      factors: adaptKeyFactors(prediction, explanation), // explanation 전달
      reasoning: adaptReasoningReport(explanation),
    };
  } catch (error) {
    console.error('Failed to fetch date detail:', error);
    return null;
  }
};
