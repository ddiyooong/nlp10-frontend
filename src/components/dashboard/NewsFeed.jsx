import { useNavigate } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';
import { NEWS_ITEMS } from '../../data/mockData';

/**
 * 뉴스 피드 컴포넌트
 * 최신 시장 뉴스 목록 표시
 */
const NewsFeed = () => {
  const navigate = useNavigate();
  return (
    <div className="xl:col-span-1 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="text-indigo-400" size={18} />
        <h3 className="text-white font-bold">최신 뉴스 목록 (Market Feed)</h3>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 space-y-3">
        {NEWS_ITEMS.slice(0, 3).map((news, index) => (
          <div 
            key={index} 
            className="group p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span 
                  className={`w-1.5 h-1.5 rounded-full ${
                    news.sentiment === 'pos' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">
                  {news.source}
                </span>
              </div>
              <span className="text-[10px] text-slate-600">{news.time}</span>
            </div>
            <h5 className="text-sm text-slate-200 font-medium group-hover:text-blue-400 transition-colors">
              {news.title}
            </h5>
          </div>
        ))}
        <button 
          onClick={() => navigate('/news')}
          className="w-full py-2 text-xs text-slate-500 hover:text-white border-t border-slate-800 mt-2 flex items-center justify-center gap-1 transition-colors"
        >
          View All News <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;

