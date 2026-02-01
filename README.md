# AgriFlow AI - 농산물 선물 가격 예측 대시보드

TFT(Temporal Fusion Transformer) 모델 기반의 농산물 선물 가격 예측 및 XAI(설명 가능한 AI) 분석 대시보드입니다.

## 주요 기능

### 1. 시계열 가격 예측 차트
- 과거 30일 실제 가격 및 AI 예측값 비교
- 향후 60일 가격 예측 및 90% 신뢰구간 표시
- 미래 날짜 클릭 시 해당 날짜의 예측 상세 정보 확인

### 2. XAI 분석 대시보드
- **핵심 변수 기여도 (Top Factors)**: TFT 모델의 Feature Importance 시각화
- **AI 예측 근거 리포트**: Executive Summary 및 고영향 뉴스 분석

### 3. 시장 지표 모니터링
- 8개 주요 시장 지표 실시간 표시
- 카테고리: Sentiment, Liquidity, Macro, Demand, Logistics, Weather, Quality

### 4. 뉴스 피드
- 최신 시장 뉴스 목록 (감성 분석 포함)
- 전체 뉴스 페이지: 필터(감성, 출처) 및 검색 기능

### 5. AI 챗봇
- 대화형 시장 분석 질의응답

## 기술 스택

- **Frontend**: React 19, Vite 7
- **차트**: Recharts
- **스타일링**: Tailwind CSS
- **라우팅**: React Router DOM
- **아이콘**: Lucide React

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 폴더 구조

```
src/
├── components/
│   ├── layout/
│   │   └── Header.jsx
│   ├── charts/
│   │   └── ForecastChart.jsx
│   ├── dashboard/
│   │   ├── KeyFactors.jsx
│   │   ├── ReasoningReport.jsx
│   │   ├── MetricCard.jsx
│   │   ├── MarketMetrics.jsx
│   │   └── NewsFeed.jsx
│   └── chat/
│       └── ChatBot.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── NewsPage.jsx
├── data/
│   └── mockData.js
├── utils/
│   └── formatters.js
└── App.jsx
```

## 배포

Netlify를 통한 자동 배포가 설정되어 있습니다.
- `main` 브랜치 push 시 자동 빌드 및 배포
- PR 생성 시 Deploy Preview 제공

## 라이선스

MIT License
