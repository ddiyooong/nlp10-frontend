import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewsPage from './pages/NewsPage';

/**
 * 메인 라우팅 컴포넌트
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
};

export default App;
