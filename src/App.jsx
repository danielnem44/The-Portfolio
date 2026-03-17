import { Routes, Route } from 'react-router-dom';
import PublicPortfolioPage from './PublicPortfolioPage';
import PortfolioCMS from './PortfolioCMS';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPortfolioPage />} />
      <Route path="/edit" element={<PortfolioCMS />} />
    </Routes>
  );
}

export default App;
