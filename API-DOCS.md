# API-DOCS


---

## 1. Predictions (가격 예측)

### 🟢 Create Prediction
새로운 가격 예측 데이터를 생성합니다.

- **URL:** `POST /api/predictions`
- **Request Body:** `application/json`

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `target_date` | string (date) | 예측 대상 날짜 (예: "2026-02-03") |
| `commodity` | string | 품목명 |
| `price_pred` | number | 예측 가격 |
| `conf_lower` | number | 신뢰 구간 하한값 |
| `conf_upper` | number | 신뢰 구간 상한값 |
| `top1_factor` | string | 주요 영향 요인 1 |
| `top1_impact` | number | 요인 1의 영향도 |
| ... | ... | (top2~top5 동일 형식) |

- **Response (200 OK):**
  - 생성된 데이터 객체 (`id`, `created_at` 필드 포함)

---

### 🔵 Get Predictions
특정 기간 내의 품목별 예측 리스트를 조회합니다.

- **URL:** `GET /api/predictions`
- **Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
| :--- | :--- | :---: | :--- |
| `commodity` | string | ✅ | 조회할 품목명 |
| `start_date` | string (date) | ✅ | 조회 시작일 (YYYY-MM-DD) |
| `end_date` | string (date) | ✅ | 조회 종료일 (YYYY-MM-DD) |

- **Response (200 OK):**
  - 예측 데이터 객체들의 배열 (`Array[]`)

---

### 🔵 Get Prediction By Date
특정 날짜와 품목을 기준으로 단일 예측 데이터를 조회합니다.

- **URL:** `GET /api/predictions/{target_date}`
- **Path Parameters:**
  - `target_date`: 조회 타겟 날짜 (YYYY-MM-DD)
- **Query Parameters:**
  - `commodity`: 품목명 (Required)

---

## 2. Explanations (예측 분석 설명)

### 🟢 Create Explanation
예측 결과에 대한 상세 분석 내용(LLM 생성 등)을 저장합니다.

- **URL:** `POST /api/explanations`
- **Request Body:** `application/json`

```json
{
  "pred_id": 0,
  "content": "이 품목은 유가 상승의 영향으로...",
  "llm_model": "gpt-4o"
}
```

### 🔵 Get Explanation By Date
날짜와 품목을 기준으로 해당 예측 데이터에 대한 상세 분석 설명을 조회합니다.

- **Endpoint:** `GET /api/explanations/{target_date}`
- **Content-Type:** `application/json`

#### 1. Parameters
| 구분 | 파라미터명 | 타입 | 필수 여부 | 설명 |
| :--- | :--- | :--- | :---: | :--- |
| **Path** | `target_date` | `string($date)` | ✅ | 조회 대상 날짜 (예: `2026-02-03`) |
| **Query** | `commodity` | `string` | ✅ | 품목명 (예: `Corn`, `Soybean` 등) |

#### 2. Responses
**✅ 200: Successful Response**
- **Description:** 해당 날짜와 품목에 일치하는 분석 데이터를 반환합니다.
- **Body:**
```json
{
  "id": 0,           // Explanation 고유 ID
  "pred_id": 0,      // 연결된 예측 데이터(Prediction) ID
  "content": "string", // 상세 분석 내용 (LLM 생성 텍스트 등)
  "llm_model": "string", // 분석에 사용된 모델명
  "created_at": "2026-02-03T13:57:58.415Z" // 생성 일시
}
```

---

## 현재 데이터 연동 상태 분석

### ✅ API 연동 완료
1. **예측 가격 데이터** - `/api/predictions`
   - 차트 그래프 (과거 30일 + 미래 60일)
   - 예측 가격, 신뢰구간 상/하한

2. **핵심 변수 기여도** - `/api/predictions` 응답의 `top1_factor ~ top5_factor`
   - KeyFactors 컴포넌트에 표시

3. **AI 예측 근거** - `/api/explanations/{target_date}`
   - ReasoningReport 컴포넌트의 Executive Summary

---

## ⚠️ Mock 데이터 사용 중 (API 구현 필요)

아래 기능들은 현재 프론트엔드 Mock 데이터를 사용하고 있습니다. 백엔드 API 구현이 필요합니다.

---

## 3. Market Metrics (시장 지표)

### 🔵 Get Market Metrics
**현재 상태:** Mock 데이터 (`MARKET_METRICS`)  
**필요한 API:** 실시간 시장 지표 조회

- **URL:** `GET /api/market-metrics`
- **Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
| :--- | :--- | :---: | :--- |
| `commodity` | string | ✅ | 품목명 |
| `date` | string (date) | ❌ | 조회 날짜 (기본값: 오늘) |

- **Response (200 OK):**

```json
{
  "commodity": "Corn",
  "date": "2026-02-03",
  "metrics": [
    {
      "metric_id": "net_long",
      "label": "Net Long (순매수)",
      "value": "15.4K",
      "numeric_value": 15400,
      "trend": 5.2,
      "impact": "High",
    },
    {
      "metric_id": "open_interest",
      "label": "Open Interest",
      "value": "1.2M",
      "numeric_value": 1200000,
      "trend": 1.8,
      "impact": "Medium",
    },
    {
      "metric_id": "wti_crude",
      "label": "WTI Crude Oil",
      "value": "$75.50",
      "numeric_value": 75.50,
      "trend": 3.2,
      "impact": "High",
    },
    
  ]
}
```

**설명:**
- `trend`: 전일 대비 변화율 (%)
- `impact`: 가격에 미치는 영향도 ("High", "Medium", "Low") 

---

## 4. News (뉴스 피드)

### 🔵 Get News Feed
**현재 상태:** ✅ API 연동 완료  
**엔드포인트:** `GET /api/newsdb`

- **Query Parameters:**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
| :--- | :--- | :---: | :--- | :--- |
| `skip` | integer | ❌ | 0 | 페이지네이션 offset |
| `limit` | integer | ❌ | 10 | 조회 개수 |

- **Response (200 OK):**

```json
[
  {
    "id": 0,
    "content": "아르헨티나 항만 파업으로 곡물 선적 지연되고 있습니다...",
    "source_url": "https://www.wsj.com/...",
    "created_at": "2026-02-04T06:14:57.801Z"
  }
]
```

**필드 설명:**
- `id`: 뉴스 고유 ID
- `content`: 뉴스 내용
- `source_url`: 원문 링크
- `created_at`: 생성 일시 (ISO 8601)

---

## 5. Historical Prices (과거 실제 가격)

### 🔵 Get Historical Actual Prices
**현재 상태:** Mock 데이터 (클라이언트에서 랜덤 생성)  
**필요한 API:** 과거 실제 가격 데이터 조회

- **URL:** `GET /api/historical-prices`
- **Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
| :--- | :--- | :---: | :--- |
| `commodity` | string | ✅ | 품목명 |
| `start_date` | string (date) | ✅ | 조회 시작일 |
| `end_date` | string (date) | ✅ | 조회 종료일 |

- **Response (200 OK):**

```json
{
  "commodity": "Corn",
  "prices": [
    {
      "date": "2026-01-15",
      "actual_price": 445.30,
      "open": 444.50,
      "high": 446.20,
      "low": 443.80,
      "close": 445.30,
      "volume": 123456
    }
  ]
}
```

**설명:**
- 차트의 "과거 실제 가격" 표시에 사용
- 과거 AI 예측과 실제 가격 비교에 사용

---

## 6. What-If Simulation (시뮬레이션)

### 🟢 POST What-If Simulation
**현재 상태:** 클라이언트 사이드 계산 (`calculateWhatIfForecast`)  
**권장사항:** 서버 사이드로 이동 (모델 정확도 향상)

- **URL:** `POST /api/simulate`
- **Request Body:**

```json
{
  "commodity": "Corn",
  "base_date": "2026-02-03",
  "feature_overrides": {
    "WTI": 80.0,
    "DXY": 105.5,
    "NET_LONG": 18000,
    "ETHANOL_PROD": 1.15
  }
}
```

- **Response (200 OK):**

```json
{
  "original_forecast": 452.30,
  "simulated_forecast": 458.75,
  "change": 6.45,
  "change_percent": 1.43,
  "feature_impacts": [
    {
      "feature": "WTI",
      "current_value": 75.50,
      "new_value": 80.0,
      "value_change": 4.5,
      "contribution": 3.6
    }
  ]
}
```

**설명:**
- 서버에서 실제 모델을 사용하여 시뮬레이션 수행
- 더 정확한 예측 결과 제공

---

## 7. High-Impact News Analysis (고영향 뉴스 분석)

### 🔵 Get High-Impact News
**현재 상태:** `explanation` 응답에 포함되어야 하나, 현재는 Mock  
**권장사항:** `explanation` 응답 구조 확장

- **Option 1: Explanation 응답 확장**

```json
{
  "id": 0,
  "pred_id": 0,
  "content": "이 품목은 유가 상승의 영향으로...",
  "llm_model": "gpt-4o",
  "created_at": "2026-02-03T13:57:58.415Z",
  "impact_news": [
    {
      "source": "Bloomberg",
      "title": "미 중서부 기습 폭염 경보",
      "impact_score": 92,
      "analysis": "공급망 충격(Supply Shock) 우려..."
    }
  ]
}
```

- **Option 2: 별도 엔드포인트**
  - `GET /api/impact-news/{target_date}?commodity=Corn`

---

## 구현 우선순위 권장사항

### 🔴 High Priority (핵심 기능)
1. **Historical Prices** - 차트의 과거 실제 가격 표시에 필수
2. **Market Metrics** - 대시보드 주요 지표 섹션
3. **Explanation 확장** - `impact_news` 필드 추가

### 🟡 Medium Priority (사용자 경험 향상)
4. **News Feed** - 뉴스 섹션 실시간 데이터

### 🟢 Low Priority (선택 기능)
5. **What-If Simulation** - 현재 클라이언트 계산으로 동작 가능 (정확도는 낮음)

---

## 데이터 흐름 요약

```
┌─────────────────────┐
│   Frontend UI       │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ API Service │
    └──────┬──────┘
           │
    ┌──────▼────────────────────────────┐
    │ Backend API                       │
    ├───────────────────────────────────┤
    │ ✅ /api/predictions               │ ← 연동 완료
    │ ✅ /api/explanations              │ ← 연동 완료
    │ ❌ /api/market-metrics            │ ← Mock 사용 중
    │ ❌ /api/news                      │ ← Mock 사용 중
    │ ❌ /api/historical-prices         │ ← Mock 생성 중
    │ ❌ /api/simulate                  │ ← 클라이언트 계산
    └───────────────────────────────────┘
```