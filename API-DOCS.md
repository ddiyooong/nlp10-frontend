# AgriFlow AI API Reference (v1.2)

> **Base URL:** `https://api.agriflow.io/v1`

---

## 1. API 개요 (Overview)

AgriFlow AI는 농산물 선물 가격 예측, XAI(설명 가능한 AI) 분석, 시장 데이터 모니터링 서비스입니다.  
이 문서는 프론트엔드에서 사용하는 모든 API 엔드포인트를 정의합니다.

**주요 기능:**
- TFT(Temporal Fusion Transformer) 모델 기반 가격 예측
- 과거 예측 검증 및 정확도 산출
- 핵심 변수 기여도(Feature Importance) 분석
- 고영향 뉴스 분석 및 AI Reasoning
- 실시간 시장 지표 모니터링
- 유사 패턴 과거 사례 분석
- What-if 분석 (Feature 시뮬레이션)

---

## 2. 인증 (Authentication)

모든 API 요청에는 `Authorization` 헤더에 API Key가 필요합니다.

```
Authorization: Bearer {API_KEY}
```

---

## 3. API 엔드포인트 (Endpoints)

### 3.1 시계열 예측 데이터 (Time-Series Forecast)

메인 차트의 **가격 예측 데이터**입니다. 과거 실제 가격, 과거 AI 예측값, 미래 예측값을 포함합니다.

**Request**

```
GET /commodities/{commodityId}/forecast
```

**Path Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `commodityId` | `string` | Yes | 품목 코드 | `corn` |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `pastDays` | `int` | No | 과거 조회 일수 | `30` |
| `forecastDays` | `int` | No | 미래 예측 일수 | `60` |

**Response**

```json
{
  "commodity": "Corn",
  "commodityId": "corn",
  "currency": "USD",
  "unit": "cents/bushel",
  "modelAccuracy": 98.5,
  "lastUpdated": "2026-01-29T09:30:00Z",
  "data": [
    {
      "date": "12/30",
      "rawDate": "2025-12-30T00:00:00Z",
      "isFuture": false,
      "isToday": false,
      "actual": 448.25,
      "ai_past": 450.12,
      "errorRate": 0.42,
      "forecast": null,
      "ci_upper": null,
      "ci_lower": null
    },
    {
      "date": "1/30",
      "rawDate": "2026-01-30T00:00:00Z",
      "isFuture": true,
      "isToday": false,
      "actual": null,
      "ai_past": null,
      "errorRate": null,
      "forecast": 455.20,
      "ci_upper": 461.50,
      "ci_lower": 448.90
    }
  ]
}
```

**Response Fields**

| 필드 | 타입 | 설명 |
|------|------|------|
| `modelAccuracy` | `number` | 과거 예측 정확도 (%) |
| `data[].date` | `string` | 표시용 날짜 (`M/D` 형식) |
| `data[].isFuture` | `boolean` | 미래 예측 데이터 여부 |
| `data[].isToday` | `boolean` | 오늘 날짜 여부 |
| `data[].actual` | `number` | 실제 가격 (과거만) |
| `data[].ai_past` | `number` | 해당 시점의 과거 AI 예측값 |
| `data[].errorRate` | `number` | 예측 오차율 (%) |
| `data[].forecast` | `number` | AI 예측 가격 (미래) |
| `data[].ci_upper` | `number` | 90% 신뢰구간 상한 |
| `data[].ci_lower` | `number` | 90% 신뢰구간 하한 |

---

### 3.2 핵심 변수 기여도 (Feature Importance)

TFT 모델의 **변수별 중요도**를 반환합니다.

**Request**

```
GET /commodities/{commodityId}/factors
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `targetDate` | `string` | No | 예측 기준 날짜 (M/D 형식) | 오늘 |

**Response**

```json
{
  "commodityId": "corn",
  "analysisDate": "2026-01-29",
  "factors": [
    {
      "label": "RSI (14) & Momentum",
      "group": "Oscillators",
      "value": 85,
      "color": "emerald",
      "description": "과매수 구간 진입 신호 포착"
    },
    {
      "label": "MA (20, 60)",
      "group": "Moving Averages",
      "value": 78,
      "color": "indigo",
      "description": "단기/중기 이평선 골든크로스"
    }
  ]
}
```

---

### 3.3 AI 예측 근거 리포트 (Reasoning Report)

AI가 **예측 결정에 도달한 근거**를 설명합니다.

**Request**

```
GET /commodities/{commodityId}/reasoning
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `targetDate` | `string` | No | 예측 기준 날짜 (M/D 형식) | 오늘 |

**Response**

```json
{
  "commodityId": "corn",
  "analysisDate": "2026-01-29",
  "executiveSummary": {
    "content": "현재 시장은 이동평균 상의 골든크로스와 오실레이터의 과매수 신호가 혼재되어 있습니다.",
    "trendWeight": 78,
    "direction": "bullish"
  },
  "impactNews": [
    {
      "source": "Bloomberg",
      "title": "미 중서부 기습 폭염 경보, 수확량 전망치 하향 조정",
      "impactScore": 92,
      "analysis": "공급망 충격 우려가 선물 매수세를 자극함."
    }
  ]
}
```

---

### 3.4 시장 지표 (Market Metrics)

주요 **시장 지표** 데이터입니다.

**Request**

```
GET /market/metrics
```

**Response**

```json
{
  "updatedAt": "2026-01-29T09:30:00Z",
  "metrics": [
    {
      "code": "NET_LONG",
      "label": "Net Long (순매수)",
      "group": "Sentiment",
      "value": "15.4K",
      "numericValue": 15400,
      "sub": "Contracts",
      "trend": 5.2,
      "impact": "High"
    },
    {
      "code": "WTI",
      "label": "WTI Crude Oil",
      "group": "Macro",
      "value": "$75.50",
      "numericValue": 75.50,
      "sub": "Energy Cost",
      "trend": 3.2,
      "impact": "High"
    }
  ]
}
```

**Metric Groups**

| 그룹 | 설명 |
|------|------|
| `Sentiment` | 시장 심리 |
| `Liquidity` | 유동성 |
| `Macro` | 매크로 지표 |
| `Demand` | 수요 |
| `Logistics` | 물류 |
| `Weather` | 기상 |
| `Quality` | 작물 품질 |

---

### 3.5 뉴스 피드 (News Feed)

최신 **시장 관련 뉴스** 목록입니다.

**Request**

```
GET /market/news
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `limit` | `int` | No | 반환할 뉴스 개수 | `20` |
| `sentiment` | `string` | No | 감성 필터 (`pos`, `neg`) | 전체 |
| `source` | `string` | No | 출처 필터 | 전체 |

**Response**

```json
{
  "news": [
    {
      "id": "news_20260129_001",
      "source": "WSJ",
      "title": "아르헨티나 항만 파업으로 곡물 선적 지연",
      "sentiment": "pos",
      "time": "12h ago",
      "date": "2026-01-29",
      "content": "아르헨티나 주요 항만에서 노동자 파업이 시작되면서..."
    }
  ]
}
```

---

### 3.6 유사 패턴 과거 사례 분석 (Similar Pattern Analysis)

현재 시장 상황과 유사한 과거 패턴을 찾아 분석 결과를 제공합니다.

**Request**

```
GET /commodities/{commodityId}/similar-patterns
```

**Path Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `commodityId` | `string` | Yes | 품목 코드 | `corn` |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `windowDays` | `int` | No | 패턴 비교 기간 (일) | `30` |
| `limit` | `int` | No | 반환할 유사 패턴 수 | `3` |

**Response**

```json
{
  "commodityId": "corn",
  "currentPatternRange": "2025-12-31 ~ 2026-01-30",
  "similarPatterns": [
    {
      "rank": 1,
      "similarity": 87.2,
      "periodStart": "2024-07-01",
      "periodEnd": "2024-07-30",
      "priceStart": 420.50,
      "priceEnd": 445.20,
      "priceChange": 5.87,
      "outcomeAfter60Days": 8.2,
      "keyFactors": ["폭염 경보", "에탄올 수요 급증", "순매수 확대"]
    }
  ]
}
```

**Response Fields**

| 필드 | 타입 | 설명 |
|------|------|------|
| `similarity` | `number` | 현재 패턴과의 유사도 (%) |
| `periodStart` | `string` | 과거 패턴 시작일 (ISO 8601) |
| `periodEnd` | `string` | 과거 패턴 종료일 (ISO 8601) |
| `priceStart` | `number` | 패턴 시작 시점 가격 |
| `priceEnd` | `number` | 패턴 종료 시점 가격 |
| `priceChange` | `number` | 패턴 기간 중 가격 변화율 (%) |
| `outcomeAfter60Days` | `number` | 패턴 종료 후 60일 가격 변화율 (%) |
| `keyFactors` | `array` | 해당 기간의 주요 영향 요인 |

---

### 3.7 What-if 분석 (Feature Simulator)

Feature 값을 변경하여 예측 가격 변화를 시뮬레이션합니다.

**Request**

```
POST /commodities/{commodityId}/what-if
```

**Path Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `commodityId` | `string` | Yes | 품목 코드 | `corn` |

**Request Body**

```json
{
  "targetDate": "2/28",
  "featureOverrides": {
    "WTI": 80.00,
    "DXY": 102.5,
    "NET_LONG": 18000,
    "ETHANOL_PROD": 1.10
  }
}
```

**Request Fields**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `targetDate` | `string` | No | 예측 기준 날짜 (M/D 형식) | 오늘 |
| `featureOverrides` | `object` | Yes | 변경할 Feature 값들 |
| `featureOverrides.WTI` | `number` | No | WTI Crude Oil 가격 |
| `featureOverrides.DXY` | `number` | No | Dollar Index 값 |
| `featureOverrides.NET_LONG` | `number` | No | Net Long 계약 수 |
| `featureOverrides.ETHANOL_PROD` | `number` | No | 에탄올 생산량 (M barrels/day) |

**Response**

```json
{
  "originalForecast": 452.30,
  "simulatedForecast": 461.80,
  "change": 9.50,
  "changePercent": 2.1,
  "featureImpacts": [
    {
      "feature": "WTI",
      "contribution": 4.20,
      "valueChange": 4.50,
      "currentValue": 75.50,
      "newValue": 80.00
    },
    {
      "feature": "NET_LONG",
      "contribution": 3.50,
      "valueChange": 2600,
      "currentValue": 15400,
      "newValue": 18000
    },
    {
      "feature": "DXY",
      "contribution": 1.80,
      "valueChange": -1.7,
      "currentValue": 104.2,
      "newValue": 102.5
    }
  ]
}
```

**Response Fields**

| 필드 | 타입 | 설명 |
|------|------|------|
| `originalForecast` | `number` | 기본 예측 가격 |
| `simulatedForecast` | `number` | 시뮬레이션 예측 가격 |
| `change` | `number` | 가격 변화량 ($) |
| `changePercent` | `number` | 가격 변화율 (%) |
| `featureImpacts[].feature` | `string` | Feature 코드 |
| `featureImpacts[].contribution` | `number` | 해당 Feature의 기여도 ($) |
| `featureImpacts[].valueChange` | `number` | Feature 값 변화량 |
| `featureImpacts[].currentValue` | `number` | 현재 Feature 값 |
| `featureImpacts[].newValue` | `number` | 변경된 Feature 값 |

---

## 4. 에러 응답 (Error Response)

```json
{
  "error": {
    "code": "INVALID_COMMODITY_ID",
    "message": "지원하지 않는 품목 코드입니다.",
    "details": {
      "provided": "rice",
      "supported": ["corn", "wheat", "soybean"]
    }
  }
}
```

---

## 5. HTTP 상태 코드

| 코드 | 상태 | 설명 |
|------|------|------|
| `200` | OK | 요청 성공 |
| `400` | Bad Request | 파라미터 오류 |
| `401` | Unauthorized | 인증 실패 |
| `404` | Not Found | 데이터 없음 |
| `429` | Too Many Requests | Rate Limit 초과 |
| `500` | Internal Server Error | 서버 오류 |

---

## 6. 지원 품목

| 코드 | 품목명 | 거래소 |
|------|--------|--------|
| `corn` | 옥수수 (Corn) | CBOT |
| `wheat` | 밀 (Wheat) | CBOT |
| `soybean` | 대두 (Soybean) | CBOT |

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2025-01-25 | 초기 버전 |
| v1.1 | 2026-01-29 | 날짜 선택 기능 추가 (`targetDate` 파라미터) |
| v1.2 | 2026-01-30 | AI 챗봇 제거, 유사 패턴 분석 API 추가, What-if 분석 API 추가 |



