/**
 * API Service Layer
 * 백엔드 API와 통신하는 서비스 함수들
 */

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<Object>} API 응답 데이터
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * 예측 데이터 목록 조회
 * GET /api/predictions
 * @param {string} commodity - 품목명 (예: "Corn")
 * @param {string} startDate - 조회 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 조회 종료일 (YYYY-MM-DD)
 * @returns {Promise<Array>} 예측 데이터 배열
 */
export const fetchPredictions = async (commodity, startDate, endDate) => {
  const params = new URLSearchParams({
    commodity,
    start_date: startDate,
    end_date: endDate,
  });

  return apiRequest(`/api/predictions?${params}`);
};

/**
 * 특정 날짜의 예측 데이터 상세 조회
 * GET /api/predictions/{target_date}
 * @param {string} commodity - 품목명
 * @param {string} targetDate - 조회 대상 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 예측 데이터 객체
 */
export const fetchPredictionDetail = async (commodity, targetDate) => {
  const params = new URLSearchParams({ commodity });
  return apiRequest(`/api/predictions/${targetDate}?${params}`);
};

/**
 * 특정 날짜의 예측 설명(분석) 조회
 * GET /api/explanations/{target_date}
 * @param {string} commodity - 품목명
 * @param {string} targetDate - 조회 대상 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 설명 데이터 객체
 */
export const fetchExplanation = async (commodity, targetDate) => {
  const params = new URLSearchParams({ commodity });
  return apiRequest(`/api/explanations/${targetDate}?${params}`);
};

/**
 * 새로운 예측 데이터 생성
 * POST /api/predictions
 * @param {Object} predictionData - 예측 데이터
 * @returns {Promise<Object>} 생성된 데이터 객체
 */
export const createPrediction = async (predictionData) => {
  return apiRequest('/api/predictions', {
    method: 'POST',
    body: JSON.stringify(predictionData),
  });
};

/**
 * 새로운 설명 데이터 생성
 * POST /api/explanations
 * @param {Object} explanationData - 설명 데이터
 * @returns {Promise<Object>} 생성된 데이터 객체
 */
export const createExplanation = async (explanationData) => {
  return apiRequest('/api/explanations', {
    method: 'POST',
    body: JSON.stringify(explanationData),
  });
};
