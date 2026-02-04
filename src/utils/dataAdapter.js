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
 * Mock 데이터로 과거 실제 가격 생성
 * @param {Date} date - 날짜
 * @param {number} index - 인덱스
 * @param {number} basePrice - 기준 가격
 * @returns {Object} { actual, ai_past, errorRate }
 */
const generateMockActual = (date, index, basePrice) => {
  const seed = date.getTime();
  const pseudoRandom = (Math.sin(seed) * 10000) % 1;
  const change = (pseudoRandom - 0.48) * 5;
  const actual = Number((basePrice + change).toFixed(2));
  
  const error = (pseudoRandom - 0.5) * 6;
  const ai_past = Number((actual + error).toFixed(2));
  const errorRate = (Math.abs(actual - ai_past) / actual * 100).toFixed(2);
  
  return { actual, ai_past, errorRate };
};

/**
 * API 예측 데이터를 차트 데이터로 변환
 * @param {string} commodity - 품목명
 * @param {Date} startDate - 시작 날짜
 * @param {Date} endDate - 종료 날짜
 * @returns {Promise<Array>} 차트 데이터 배열
 */
export const fetchChartData = async (commodity = 'Corn', startDate, endDate) => {
  try {
    const apiStartDate = toAPIDateFormat(startDate);
    const apiEndDate = toAPIDateFormat(endDate);
    
    // API에서 예측 데이터 가져오기
    const predictions = await fetchPredictions(commodity, apiStartDate, apiEndDate);
    
    // 날짜별로 데이터 매핑 (API 데이터가 없을 수도 있음)
    const predictionMap = new Map();
    predictions.forEach(pred => {
      predictionMap.set(pred.target_date, pred);
    });
    
    // 전체 날짜 범위에 대한 차트 데이터 생성
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(startDate);
    let basePrice = 450; // 초기 가격
    
    while (currentDate <= endDate) {
      const apiDate = toAPIDateFormat(currentDate);
      const displayDate = formatDate(currentDate);
      const isFuture = currentDate > today;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      const prediction = predictionMap.get(apiDate);
      
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
      
      if (prediction) {
        // API 데이터가 있는 경우
        if (isFuture) {
          point.forecast = prediction.price_pred;
          point.ci_upper = prediction.conf_upper;
          point.ci_lower = prediction.conf_lower;
          basePrice = prediction.price_pred;
        } else {
          // 과거 데이터: 실제 가격은 Mock 생성
          const mockData = generateMockActual(currentDate, data.length, basePrice);
          point.actual = mockData.actual;
          point.ai_past = mockData.ai_past;
          point.errorRate = mockData.errorRate;
          basePrice = mockData.actual;
          
          if (isToday) {
            point.forecast = prediction.price_pred;
          }
        }
      } else {
        // API 데이터가 없는 경우: Mock 데이터 생성
        if (isFuture) {
          const change = (Math.random() - 0.48) * 8;
          basePrice += change;
          point.forecast = Number(basePrice.toFixed(2));
          const uncertainty = (data.length * 0.8) + 5;
          point.ci_upper = Number((basePrice + uncertainty).toFixed(2));
          point.ci_lower = Number((basePrice - uncertainty).toFixed(2));
        } else {
          const mockData = generateMockActual(currentDate, data.length, basePrice);
          point.actual = mockData.actual;
          point.ai_past = mockData.ai_past;
          point.errorRate = mockData.errorRate;
          basePrice = mockData.actual;
        }
      }
      
      data.push(point);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    // 에러 발생 시 빈 배열 반환 (컴포넌트에서 fallback 처리)
    return [];
  }
};

/**
 * API 예측 데이터의 topX_factor 필드를 KeyFactors 형식으로 변환
 * @param {Object} prediction - API 예측 데이터
 * @returns {Array} KeyFactors 형식 배열
 */
export const adaptKeyFactors = (prediction) => {
  if (!prediction) return null;
  
  const factors = [];
  const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
  
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
 * @returns {Object} { summary, impactNews }
 */
export const adaptReasoningReport = (explanation) => {
  if (!explanation || !explanation.content) return null;
  
  // content를 파싱하여 summary와 impactNews로 분리
  // (백엔드에서 구조화된 데이터를 제공한다고 가정)
  // 만약 content가 단순 텍스트라면, 전체를 summary로 사용
  
  return {
    summary: explanation.content,
    impactNews: [], // 백엔드에서 뉴스 데이터를 별도로 제공하지 않으면 빈 배열
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
      factors: adaptKeyFactors(prediction),
      reasoning: adaptReasoningReport(explanation),
    };
  } catch (error) {
    console.error('Failed to fetch date detail:', error);
    return null;
  }
};
