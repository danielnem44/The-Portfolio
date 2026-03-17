import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicPortfolio } from './PortfolioCMS';
import { portfolioAPI, educationAPI } from './api';

const emptyData = {
  bio: { name: '', title: '', tagline: '', about: '', email: '', phone: '', profilePicture: '', heroImage: '' },
  experiences: [],
  projects: [],
  blog: [],
  socials: [],
  education: [],
};

export default function PublicPortfolioPage() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const [bio, experiences, projects, blogs, socials, education] = await Promise.allSettled([
          portfolioAPI.getBio(),
          portfolioAPI.getExperiences(),
          portfolioAPI.getProjects(),
          portfolioAPI.getBlogs(),
          portfolioAPI.getSocials(),
          educationAPI.getEducation(),
        ]);

        setData({
          bio: bio.status === 'fulfilled' && bio.value ? bio.value : emptyData.bio,
          experiences: experiences.status === 'fulfilled' && experiences.value ? experiences.value : [],
          projects: projects.status === 'fulfilled' && projects.value ? projects.value : [],
          blog: blogs.status === 'fulfilled' && blogs.value ? blogs.value : [],
          socials: socials.status === 'fulfilled' && socials.value ? socials.value : [],
          education: education.status === 'fulfilled' && education.value ? education.value : [],
        });
      } catch (e) {
        console.log('Could not load portfolio data', e);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioData();
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
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-500 text-sm animate-pulse">Loading portfolio…</div>
        </div>
      ) : (
        <PublicPortfolio data={data} />
      )}
    </div>
  );
}
