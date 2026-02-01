import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Newspaper } from 'lucide-react';
import { Header } from '../components';
import { NEWS_ITEMS } from '../data/mockData';

/**
 * 전체 뉴스 페이지 컴포넌트
 * 필터 및 검색 기능 포함
 */
const NewsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('all'); // 'all', 'pos', 'neg'
  const [selectedSource, setSelectedSource] = useState('all');

  // 출처 목록 추출
  const sources = useMemo(() => {
    const sourceSet = new Set(NEWS_ITEMS.map(item => item.source));
    return Array.from(sourceSet).sort();
  }, []);

  // 필터링된 뉴스
  const filteredNews = useMemo(() => {
    return NEWS_ITEMS.filter(item => {
      // 검색 필터
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 감성 필터
      const matchesSentiment = selectedSentiment === 'all' || 
        item.sentiment === selectedSentiment;
      
      // 출처 필터
      const matchesSource = selectedSource === 'all' || 
        item.source === selectedSource;
      
      return matchesSearch && matchesSentiment && matchesSource;
    });
  }, [searchQuery, selectedSentiment, selectedSource]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">대시보드로 돌아가기</span>
            </button>
            <div className="flex items-center gap-2">
              <Newspaper className="text-indigo-400" size={24} />
              <h1 className="text-2xl font-bold text-white">전체 뉴스</h1>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            총 {filteredNews.length}개 뉴스
          </div>
        </div>

        {/* 필터 및 검색 영역 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="뉴스 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* 필터 */}
          <div className="flex flex-wrap gap-4">
            {/* 감성 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={18} />
              <span className="text-sm text-slate-400 font-medium">감성:</span>
              <div className="flex gap-2">
                {['all', 'pos', 'neg'].map(sentiment => (
                  <button
                    key={sentiment}
                    onClick={() => setSelectedSentiment(sentiment)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSentiment === sentiment
                        ? sentiment === 'pos'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : sentiment === 'neg'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {sentiment === 'all' ? '전체' : sentiment === 'pos' ? '긍정' : '부정'}
                  </button>
                ))}
              </div>
            </div>

            {/* 출처 필터 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">출처:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedSource('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedSource === 'all'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  전체
                </button>
                {sources.map(source => (
                  <button
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSource === source
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 뉴스 그리드 */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        news.sentiment === 'pos' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    ></span>
                    <span className="text-xs text-slate-500 font-bold uppercase">
                      {news.source}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">{news.time}</span>
                </div>
                
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {news.title}
                </h3>
                
                {news.content && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {news.content}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{news.date}</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      news.sentiment === 'pos'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {news.sentiment === 'pos' ? '긍정' : '부정'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">검색 결과가 없습니다.</p>
            <p className="text-slate-500 text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;



