import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicPortfolio } from './PortfolioCMS';

const emptyData = {
  bio: { name: '', title: '', tagline: '', about: '', email: '', phone: '', profilePicture: '' },
  experiences: [],
  projects: [],
  blog: [],
  socials: [],
};

export default function PublicPortfolioPage() {
  const [data, setData] = useState(emptyData);
  const [username, setUsername] = useState('');

  useEffect(() => {
    try {
      const savedPortfolio = localStorage.getItem('portfolio_data');
      const activeUser = localStorage.getItem('portfolio_active_user');
      if (savedPortfolio) {
        const portfolio = JSON.parse(savedPortfolio);
        const user = activeUser || Object.keys(portfolio)[0];
        if (user && portfolio[user]) {
          setData(portfolio[user]);
          setUsername(user);
        }
      }
    } catch (e) {
      console.log('No portfolio data');
    }
  }, []);

  const hasContent =
    data.bio?.name ||
    data.bio?.tagline ||
    data.bio?.about ||
    data.projects?.length > 0 ||
    data.experiences?.length > 0 ||
    data.blog?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Link
        to="/edit"
        className="fixed top-4 right-4 z-50 px-4 py-2 text-sm text-slate-400 hover:text-emerald-400 border border-slate-600 hover:border-emerald-500/50 rounded-lg transition bg-slate-900/80 backdrop-blur"
      >
        {hasContent ? 'Edit portfolio' : 'Create your portfolio'}
      </Link>
      <PublicPortfolio data={data} username={username} />
    </div>
  );
}
