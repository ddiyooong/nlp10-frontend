import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

/**
 * AI 챗봇 컴포넌트
 * 우측 하단 플로팅 버튼 + 채팅 인터페이스
 */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '안녕하세요. AgriFlow AI입니다. 사료 및 작물 시장 분석을 도와드립니다.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    
    // Mock AI 응답 (실제 API 연동 시 교체)
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { role: 'ai', text: '현재 에탄올 생산량 증가와 유가 상승이 맞물려 옥수수 수요를 견인하고 있습니다.' }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 채팅 윈도우 */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 mb-4">
          {/* 헤더 */}
          <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
            <span className="font-bold text-white text-sm">AI Analyst Chat</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/95">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* 입력 영역 */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" 
              placeholder="질문..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleSend} 
              className="bg-emerald-600 p-2 rounded-lg text-white hover:bg-emerald-500"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-bold"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatBot;

