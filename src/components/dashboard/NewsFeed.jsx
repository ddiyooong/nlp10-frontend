import { useNavigate } from 'react-router-dom';
import { Newspaper, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';

/**
 * 시간차 계산 (예: "2시간 전")
 */
const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return '방금 전';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
};

/**
 * URL에서 도메인 추출
 */
const getDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '').split('.')[0].toUpperCase();
  } catch {
    return 'NEWS';
  }
};

/**
 * 뉴스 피드 컴포넌트
 * 최신 시장 뉴스 목록 표시
 * @param {Object} props
 * @param {Array|null} props.news - API에서 가져온 뉴스 데이터
 */
const NewsFeed = ({ news }) => {
  const navigate = useNavigate();
  const displayNews = news?.slice(0, 3) || [];
  
  return (
    <div className="xl:col-span-1 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="text-indigo-400" size={18} />
        <h3 className="text-white font-bold">최신 뉴스 목록 (Market Feed)</h3>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col">
        {!news || news.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <AlertCircle size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm mb-1">뉴스 데이터가 없습니다</p>
            <p className="text-slate-600 text-xs">API 연동이 필요합니다</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 flex-1">
              {displayNews.map((newsItem) => (
                <a
                  key={newsItem.id}
                  href={newsItem.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {getDomain(newsItem.source_url)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-600">
                        {getTimeAgo(newsItem.created_at)}
                      </span>
                      <ExternalLink size={10} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  {newsItem.title && (
                    <h6 className="text-sm text-white font-bold mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {newsItem.title}
                    </h6>
                  )}
                  <p className="text-xs text-slate-300 group-hover:text-slate-200 transition-colors line-clamp-2">
                    {newsItem.content}
                  </p>
                </a>
              ))}
            </div>
            <button 
              onClick={() => navigate('/news')}
              className="w-full py-2 text-xs text-slate-500 hover:text-white border-t border-slate-800 mt-2 flex items-center justify-center gap-1 transition-colors"
            >
              View All News <ArrowRight size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;

