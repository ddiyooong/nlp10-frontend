import { Sprout } from 'lucide-react';

/**
 * 앱 헤더 컴포넌트
 * - 로고 및 앱 타이틀
 * - 실시간 상태 표시
 */
const Header = () => {
  return (
    <header className="border-b border-slate-800 bg-[#020617]/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Sprout className="text-emerald-400 w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            AgriFlow <span className="text-slate-400">AI</span>{' '}
            <span className="text-xs font-normal text-slate-500 ml-1">
              Feed & Crop Intelligence
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Live
          </span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;



