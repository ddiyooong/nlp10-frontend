/**
 * API Service Layer
 * 백엔드 API와 통신하는 서비스 함수들
 */

const BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_BASE_URL || 'http://localhost:8000');

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<Object>} API 응답 데이터
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const startTime = Date.now();
  
  // 요청 로그
  console.group(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);
  console.log('📤 URL:', url);
  if (options.body) {
    console.log('📦 Request Body:', JSON.parse(options.body));
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      console.error(`❌ Response Status: ${response.status} ${response.statusText}`);
      console.error(`⏱️ Duration: ${duration}ms`);
      console.groupEnd();
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 응답 로그
    console.log(`✅ Response Status: ${response.status}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log('📥 Response Data:', data);
    console.groupEnd();
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ API Request Failed`);
    console.error(`⏱️ Duration: ${duration}ms`);
    console.error('Error:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * 예측 데이터 + 과거 실제 가격 조회
 * GET /api/predictions
 * 자동으로 오늘-30일 ~ 오늘+60일 범위의 예측 + 과거 30일 실제 가격 반환
 * @param {string} commodity - 품목명 (예: "corn")
 * @returns {Promise<Object>} { predictions: [], historical_prices: [] }
 */
export const fetchPredictions = async (commodity) => {
  const params = new URLSearchParams({ commodity });
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

/**
 * 뉴스 목록 조회
 * GET /api/newsdb
 * @param {number} skip - 페이지네이션 offset (기본값: 0)
 * @param {number} limit - 조회 개수 (기본값: 10)
 * @returns {Promise<Array>} 뉴스 데이터 배열
 */
export const fetchNews = async (skip = 0, limit = 10) => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  
  return apiRequest(`/api/newsdb?${params}`);
};

/**
 * What-If 시뮬레이션
 * POST /api/simulate
 * @param {string} commodity - 품목명
 * @param {string} baseDate - 기준 날짜 (YYYY-MM-DD)
 * @param {Object} featureOverrides - 변경할 Feature들
 * @returns {Promise<Object>} 시뮬레이션 결과
 */
export const fetchSimulation = async (commodity, baseDate, featureOverrides) => {
  return apiRequest('/api/simulate', {
    method: 'POST',
    body: JSON.stringify({
      commodity,
      base_date: baseDate,
      feature_overrides: featureOverrides,
    }),
  });
};

/**
 * 시장 지표 조회
 * GET /api/market-metrics
 * @param {string} commodity - 품목명
 * @param {string} date - 조회 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 시장 지표 데이터
 */
export const fetchMarketMetrics = async (commodity, date) => {
  const params = new URLSearchParams({
    commodity,
    date,
  });
  
  return apiRequest(`/api/market-metrics?${params}`);
};
