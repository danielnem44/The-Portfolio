import React, { useState, useEffect, useRef } from 'react';

import { LogOut, Plus, Edit, Trash2, Save, X, Upload, User, Loader2 } from 'lucide-react';

import bioIcon from '../assets/bio and info.png';

import experienceIcon from '../assets/experience.png';

import projectIcon from '../assets/project.png';

import blogIcon from '../assets/blog.png';

import socialIcon from '../assets/social.png';

import contentIcon from '../assets/content.png';

import { authAPI, portfolioAPI, educationAPI } from './api';



export default function PortfolioCMS() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState('login');

  const [loading, setLoading] = useState(false);

  const [portfolio, setPortfolio] = useState({

    bio: { name: '', title: '', about: '', email: '', phone: '', profilePicture: '' },

    experiences: [],

    projects: [],

    blog: [],

    socials: [],

    education: []

  });



  // Check if user is already logged in on mount
  useEffect(() => {

    const token = localStorage.getItem('sentinel_token');

    if (token) {

      // Try to get current user to verify token is valid
      authAPI.getCurrentUser()

        .then(user => {

          setCurrentUser(user.email);

          setIsLoggedIn(true);

          setCurrentPage('dashboard');

          loadPortfolioData();

        })

        .catch(() => {

          // Token is invalid, remove it

          authAPI.logout();

        });

    }

  }, []);



  // Load portfolio data from API
  const loadPortfolioData = async () => {

    try {

      setLoading(true);

      const [bio, experiences, projects, blogs, socials, education] = await Promise.all([

        portfolioAPI.getBio().catch(() => null),

        portfolioAPI.getExperiences().catch(() => []),

        portfolioAPI.getProjects().catch(() => []),

        portfolioAPI.getBlogs().catch(() => []),

        portfolioAPI.getSocials().catch(() => []),

        educationAPI.getEducation().catch(() => [])

      ]);



      setPortfolio({

        bio: bio ? {

          name: bio.name || '',

          title: bio.title || '',

          about: bio.about || '',

          email: bio.email || '',

          phone: bio.phone || '',

          profilePicture: bio.profile_picture || ''

        } : { name: '', title: '', about: '', email: '', phone: '', profilePicture: '' },

        experiences: experiences || [],

        projects: projects || [],

        blog: blogs || [],

        socials: socials || [],

        education: education || []

      });

    } catch (error) {

      console.error('Error loading portfolio data:', error);

    } finally {

      setLoading(false);

    }

  };



  const handleSignup = async (e, email, password) => {

    e.preventDefault();

    try {

      setLoading(true);

      await authAPI.register(email, password);

      // After registration, login automatically

      await authAPI.login(email, password);

      setCurrentUser(email);

      setIsLoggedIn(true);

      setCurrentPage('dashboard');

      await loadPortfolioData();

    } catch (error) {

      alert(error.message || 'Registration failed. Please try again.');

    } finally {

      setLoading(false);

    }

  };



  const handleLogin = async (e, email, password) => {

    e.preventDefault();

    try {

      setLoading(true);

      await authAPI.login(email, password);

      setCurrentUser(email);

      setIsLoggedIn(true);

      setCurrentPage('dashboard');

      await loadPortfolioData();

    } catch (error) {

      alert(error.message || 'Invalid credentials fam ❌');

    } finally {

      setLoading(false);

    }

  };



  const handleLogout = () => {

    authAPI.logout();

    setIsLoggedIn(false);

    setCurrentUser(null);

    setCurrentPage('login');

    setPortfolio({

      bio: { name: '', title: '', about: '', email: '', phone: '', profilePicture: '' },

      experiences: [],

      projects: [],

      blog: [],

      socials: [],

      education: []

    });

  };



  const getUserData = () => portfolio;



  const updateUserData = async (newData) => {

    setPortfolio(newData);

    // Sync to API in background

    try {

      // Update bio if changed

      if (newData.bio) {

        const bioData = {

          name: newData.bio.name,

          title: newData.bio.title,

          about: newData.bio.about,

          email: newData.bio.email,

          phone: newData.bio.phone,

          profile_picture: newData.bio.profilePicture

        };

        await portfolioAPI.createOrUpdateBio(bioData);

      }

    } catch (error) {

      console.error('Error updating bio:', error);

    }

  };



  if (!isLoggedIn) {

    return <AuthPage onSignup={handleSignup} onLogin={handleLogin} loading={loading} />;

  }



  if (loading && portfolio.experiences.length === 0 && portfolio.projects.length === 0) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">

        <div className="text-center">

          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />

          <p className="text-slate-300">Loading your portfolio...</p>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <nav className="bg-slate-900/95 border-b border-slate-700 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-8">

            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">

              The Portfolio

            </h1>

            <div className="hidden md:flex gap-2">

              <NavBtn page="dashboard" current={currentPage} setPage={setCurrentPage} label="Dashboard" />

              <NavBtn page="public" current={currentPage} setPage={setCurrentPage} label="Preview" />

            </div>

          </div>

          <div className="flex items-center gap-4">

            <span className="text-slate-300 text-sm font-medium">{currentUser}</span>

            <button

              onClick={handleLogout}

              className="bg-red-600/20 hover:bg-red-600/40 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"

            >

              <LogOut size={18} /> Logout

            </button>

          </div>

        </div>

      </nav>



      <div className="max-w-7xl mx-auto px-4 py-8">

        {currentPage === 'dashboard' && <Dashboard data={getUserData()} updateData={updateUserData} />}

        {currentPage === 'public' && <PublicPortfolio data={getUserData()} username={currentUser} />}

      </div>

    </div>

  );

}



function NavBtn({ page, current, setPage, label }) {

  return (

    <button

      onClick={() => setPage(page)}

      className={`px-4 py-2 rounded-lg transition font-medium ${

        current === page

          ? 'bg-green-600 text-white'

          : 'text-slate-300 hover:bg-slate-700'

      }`}

    >

      {label}

    </button>

  );

}



function Dashboard({ data, updateData }) {

  const [tab, setTab] = useState('bio');



  return (

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <div className="lg:col-span-1">

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden sticky top-24">

          <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-green-600/20 to-emerald-600/20">

            <h3 className="font-bold text-white flex items-center gap-2">

              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">

                <img src={contentIcon} alt="" className="w-4 h-4 brightness-0 invert" />

              </div>

              Content

            </h3>

          </div>

          <div className="space-y-1 p-2">

            <TabBtn tab="bio" current={tab} setTab={setTab} label="Bio & Info" icon={bioIcon} />

            <TabBtn tab="experience" current={tab} setTab={setTab} label="Experience" icon={experienceIcon} />

            <TabBtn tab="education" current={tab} setTab={setTab} label="Education" icon={bioIcon} />

            <TabBtn tab="projects" current={tab} setTab={setTab} label="Projects" icon={projectIcon} />

            <TabBtn tab="blog" current={tab} setTab={setTab} label="Blog" icon={blogIcon} />

            <TabBtn tab="socials" current={tab} setTab={setTab} label="Socials" icon={socialIcon} />

          </div>

        </div>

      </div>



      <div className="lg:col-span-3">

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

          {tab === 'bio' && <BioEditor data={data} updateData={updateData} />}

          {tab === 'experience' && <ExperienceEditor data={data} updateData={updateData} />}

          {tab === 'education' && <EducationEditor data={data} updateData={updateData} />}

          {tab === 'projects' && <ProjectsEditor data={data} updateData={updateData} />}

          {tab === 'blog' && <BlogEditor data={data} updateData={updateData} />}

          {tab === 'socials' && <SocialsEditor data={data} updateData={updateData} />}

        </div>

      </div>

    </div>

  );

}



function TabBtn({ tab, current, setTab, label, icon }) {

  return (

    <button

      onClick={() => setTab(tab)}

      className={`w-full text-left px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 ${

        current === tab

          ? 'bg-green-600 text-white'

          : 'text-slate-300 hover:bg-slate-700'

      }`}

    >

      {icon && (

        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">

          <img src={icon} alt="" className="w-4 h-4 brightness-0 invert" />

        </div>

      )}

      {label}

    </button>

  );

}



function InputField({ label, value, onChange, type = 'text', placeholder = '' }) {

  return (

    <div>

      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>

      <input

        type={type}

        value={value}

        onChange={(e) => onChange(e.target.value)}

        placeholder={placeholder}

        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"

      />

    </div>

  );

}



function TextArea({ label, value, onChange, rows = 4, placeholder = '' }) {

  return (

    <div>

      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>

      <textarea

        value={value}

        onChange={(e) => onChange(e.target.value)}

        rows={rows}

        placeholder={placeholder}

        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition resize-none"

      />

    </div>

  );

}



function BioEditor({ data, updateData }) {

  const [form, setForm] = useState(data.bio || { name: '', title: '', about: '', email: '', phone: '', profilePicture: '' });

  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);



  useEffect(() => {

    setForm(data.bio || { name: '', title: '', about: '', email: '', phone: '', profilePicture: '' });

  }, [data.bio]);



  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      if (!file.type.startsWith('image/')) {

        alert('Please select an image file');

        return;

      }

      if (file.size > 5 * 1024 * 1024) {

        alert('Image size must be less than 5MB');

        return;

      }

      const reader = new FileReader();

      reader.onloadend = () => {

        setForm({ ...form, profilePicture: reader.result });

      };

      reader.readAsDataURL(file);

    }

  };



  const handleRemoveImage = () => {

    setForm({ ...form, profilePicture: '' });

    if (fileInputRef.current) {

      fileInputRef.current.value = '';

    }

  };



  const handleSave = async () => {

    try {

      setSaving(true);

      const bioData = {

        name: form.name || null,

        title: form.title || null,

        about: form.about || null,

        email: form.email || null,

        phone: form.phone || null,

        profile_picture: form.profilePicture || null

      };

      console.log('Saving bio data:', bioData);

      const result = await portfolioAPI.createOrUpdateBio(bioData);

      console.log('Bio saved successfully:', result);

      updateData({ ...data, bio: form });

      alert('Profile saved! ✅');

    } catch (error) {

      console.error('Error saving profile:', error);

      alert('Error saving profile: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  return (

    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-white">Profile</h2>

      

      <div className="space-y-4">

        <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture</label>

        <div className="flex items-center gap-6">

          <div className="relative">

            <div className="w-[200px] h-[200px] rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden flex items-center justify-center">

              {form.profilePicture ? (

                <img

                  src={form.profilePicture}

                  alt="Profile"

                  className="w-full h-full object-cover"

                />

              ) : (

                <User size={80} className="text-slate-400" />

              )}

            </div>

            {form.profilePicture && (

              <button

                onClick={handleRemoveImage}

                className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"

                type="button"

              >

                <X size={16} />

              </button>

            )}

          </div>

          <div className="flex-1">

            <input

              ref={fileInputRef}

              type="file"

              accept="image/*"

              onChange={handleImageUpload}

              className="hidden"

              id="profile-picture-input"

            />

            <label

              htmlFor="profile-picture-input"

              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer transition font-medium"

            >

              <Upload size={18} />

              {form.profilePicture ? 'Change Photo' : 'Upload Photo'}

            </label>

            <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max size 5MB</p>

          </div>

        </div>

      </div>



      <div className="space-y-4">

        <InputField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />

        <InputField label="Professional Title" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="e.g. Full Stack Developer" />

        <TextArea label="About You" value={form.about} onChange={(about) => setForm({ ...form, about })} placeholder="Tell your story..." rows={4} />

        <InputField label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />

        <InputField label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />

      </div>

      <button 

        onClick={handleSave} 

        disabled={saving}

        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50"

      >

        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 

        {saving ? 'Saving...' : 'Save Changes'}

      </button>

    </div>

  );

}



function ExperienceEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);

  const [saving, setSaving] = useState(false);



  const startNew = () => {

    setEditing('new');

    setForm({ company: '', position: '', start_date: '', end_date: '', description: '' });

  };



  const startEdit = (exp) => {

    setEditing(exp.id);

    setForm({

      company: exp.company || '',

      position: exp.position || '',

      start_date: exp.start_date || '',

      end_date: exp.end_date || '',

      description: exp.description || ''

    });

  };



  const handleSave = async () => {

    if (!form.position || !form.company) {

      alert('Fill in position & company please');

      return;

    }

    try {

      setSaving(true);

      if (editing === 'new') {

        const newExp = await portfolioAPI.createExperience(form);

        updateData({ ...data, experiences: [...data.experiences, newExp] });

      } else {

        const updatedExp = await portfolioAPI.updateExperience(editing, form);

        updateData({ ...data, experiences: data.experiences.map(e => (e.id === editing ? updatedExp : e)) });

      }

      setEditing(null);

      setForm(null);

    } catch (error) {

      alert('Error saving experience: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id) => {

    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {

      await portfolioAPI.deleteExperience(id);

      updateData({ ...data, experiences: data.experiences.filter(e => e.id !== id) });

    } catch (error) {

      alert('Error deleting experience: ' + error.message);

    }

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Edit Experience</h3>

        <InputField label="Company" value={form.company} onChange={(company) => setForm({ ...form, company })} />

        <InputField label="Position" value={form.position} onChange={(position) => setForm({ ...form, position })} />

        <div className="grid grid-cols-2 gap-4">

          <InputField label="Start Date" value={form.start_date} onChange={(start_date) => setForm({ ...form, start_date })} placeholder="Jan 2020" />

          <InputField label="End Date" value={form.end_date} onChange={(end_date) => setForm({ ...form, end_date })} placeholder="Dec 2023" />

        </div>

        <TextArea label="What you did" value={form.description} onChange={(description) => setForm({ ...form, description })} rows={3} />

        <div className="flex gap-2">

          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50">

            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save

          </button>

          <button onClick={() => { setEditing(null); setForm(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <X size={18} /> Cancel

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

            <img src={experienceIcon} alt="" className="w-6 h-6 brightness-0 invert" />

          </div>

          Experience

        </h2>

        <button onClick={startNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

          <Plus size={18} /> Add Job

        </button>

      </div>

      <div className="space-y-3">

        {data.experiences.length === 0 ? (

          <p className="text-slate-400 py-8 text-center">No jobs added yet. Click the button above to add one!</p>

        ) : (

          data.experiences.map(exp => (

            <div key={exp.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition">

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <h3 className="font-bold text-white text-lg">{exp.position}</h3>

                  <p className="text-emerald-400 font-medium">{exp.company}</p>

                  <p className="text-sm text-slate-400 mt-1">{exp.start_date} → {exp.end_date || 'Current'}</p>

                  {exp.description && <p className="text-slate-300 mt-2 text-sm">{exp.description}</p>}

                </div>

                <div className="flex gap-2">

                  <button onClick={() => startEdit(exp)} className="bg-green-600/30 hover:bg-green-600/50 text-emerald-300 p-2 rounded transition">

                    <Edit size={18} />

                  </button>

                  <button onClick={() => handleDelete(exp.id)} className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}



function EducationEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);

  const [saving, setSaving] = useState(false);



  const startNew = () => {

    setEditing('new');

    setForm({ institution: '', degree: '', field: '', start_year: '', end_year: '', description: '', grade: '' });

  };



  const startEdit = (edu) => {

    setEditing(edu.id);

    setForm({

      institution: edu.institution || '',

      degree: edu.degree || '',

      field: edu.field || '',

      start_year: edu.start_year || '',

      end_year: edu.end_year || '',

      description: edu.description || '',

      grade: edu.grade || ''

    });

  };



  const handleSave = async () => {

    if (!form.institution) {

      alert('Institution name is required');

      return;

    }

    try {

      setSaving(true);

      if (editing === 'new') {

        const newEdu = await educationAPI.createEducation(form);

        updateData({ ...data, education: [...(data.education || []), newEdu] });

      } else {

        const updatedEdu = await educationAPI.updateEducation(editing, form);

        updateData({ ...data, education: (data.education || []).map(e => (e.id === editing ? updatedEdu : e)) });

      }

      setEditing(null);

      setForm(null);

    } catch (error) {

      alert('Error saving education: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id) => {

    if (!confirm('Delete this education entry?')) return;

    try {

      await educationAPI.deleteEducation(id);

      updateData({ ...data, education: (data.education || []).filter(e => e.id !== id) });

    } catch (error) {

      alert('Error deleting: ' + error.message);

    }

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">{editing === 'new' ? 'Add Education' : 'Edit Education'}</h3>

        <InputField label="Institution / School" value={form.institution} onChange={(institution) => setForm({ ...form, institution })} placeholder="University of Agder (UiA)" />

        <InputField label="Degree" value={form.degree} onChange={(degree) => setForm({ ...form, degree })} placeholder="Bachelor's, Master's, Certificate..." />

        <InputField label="Field of Study" value={form.field} onChange={(field) => setForm({ ...form, field })} placeholder="Multimedia Design, Computer Science..." />

        <div className="grid grid-cols-2 gap-4">

          <InputField label="Start Year" value={form.start_year} onChange={(start_year) => setForm({ ...form, start_year })} placeholder="2022" />

          <InputField label="End Year (or Expected)" value={form.end_year} onChange={(end_year) => setForm({ ...form, end_year })} placeholder="2025 / Present" />

        </div>

        <InputField label="Grade / GPA (optional)" value={form.grade} onChange={(grade) => setForm({ ...form, grade })} placeholder="A / 3.8 / Top of class..." />

        <TextArea label="Description (optional)" value={form.description} onChange={(description) => setForm({ ...form, description })} rows={3} placeholder="What you studied, projects, achievements..." />

        <div className="flex gap-2">

          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50">

            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save

          </button>

          <button onClick={() => { setEditing(null); setForm(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <X size={18} /> Cancel

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

            <img src={bioIcon} alt="" className="w-6 h-6 brightness-0 invert" />

          </div>

          Education

        </h2>

        <button onClick={startNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

          <Plus size={18} /> Add Education

        </button>

      </div>

      <div className="space-y-3">

        {(data.education || []).length === 0 ? (

          <p className="text-slate-400 py-8 text-center">No education added yet. Add your school or courses! 🎓</p>

        ) : (

          (data.education || []).map(edu => (

            <div key={edu.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition">

              <div className="flex justify-between items-start gap-2">

                <div className="flex-1">

                  <h3 className="font-bold text-white text-lg">{edu.institution}</h3>

                  <p className="text-emerald-400 font-medium text-sm mt-1">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>

                  <p className="text-slate-400 text-xs mt-1">{edu.start_year}{edu.end_year ? ` → ${edu.end_year}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>

                  {edu.description && <p className="text-slate-300 text-sm mt-2">{edu.description}</p>}

                </div>

                <div className="flex gap-2">

                  <button onClick={() => startEdit(edu)} className="bg-green-600/30 hover:bg-green-600/50 text-emerald-300 p-2 rounded transition shrink-0">

                    <Edit size={18} />

                  </button>

                  <button onClick={() => handleDelete(edu.id)} className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition shrink-0">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}



function ProjectsEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);

  const [saving, setSaving] = useState(false);



  const startNew = () => {

    setEditing('new');

    setForm({ title: '', description: '', link: '', tech: '', role: '', tools: '', status: '', timeline: '', problem: '', highlights: '' });

  };



  const startEdit = (proj) => {

    setEditing(proj.id);

    setForm({

      title: proj.title || '',

      description: proj.description || '',

      link: proj.link || '',

      tech: proj.tech || '',

      role: proj.role || '',

      tools: proj.tools || '',

      status: proj.status || '',

      timeline: proj.timeline || '',

      problem: proj.problem || '',

      highlights: proj.highlights || ''

    });

  };



  const handleSave = async () => {

    if (!form.title) {

      alert('Project title is required');

      return;

    }

    try {

      setSaving(true);

      if (editing === 'new') {

        const newProj = await portfolioAPI.createProject(form);

        updateData({ ...data, projects: [...data.projects, newProj] });

      } else {

        const updatedProj = await portfolioAPI.updateProject(editing, form);

        updateData({ ...data, projects: data.projects.map(p => (p.id === editing ? updatedProj : p)) });

      }

      setEditing(null);

      setForm(null);

    } catch (error) {

      alert('Error saving project: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id) => {

    if (!confirm('Are you sure you want to delete this project?')) return;

    try {

      await portfolioAPI.deleteProject(id);

      updateData({ ...data, projects: data.projects.filter(p => p.id !== id) });

    } catch (error) {

      alert('Error deleting project: ' + error.message);

    }

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">{editing === 'new' ? 'Add Project' : 'Edit Project'}</h3>

        <InputField label="Project Title" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="Roots, Koinos..." />

        <TextArea label="Short Description / Subtitle" value={form.description} onChange={(description) => setForm({ ...form, description })} rows={2} placeholder="One-liner about what the project does..." />

        <TextArea label="The Problem it Solves" value={form.problem} onChange={(problem) => setForm({ ...form, problem })} rows={3} placeholder="What real problem does this solve? Who is it for?" />

        <TextArea label="Key Highlights / Features" value={form.highlights} onChange={(highlights) => setForm({ ...form, highlights })} rows={3} placeholder="List your key design decisions or features, one per line..." />

        <div className="grid grid-cols-2 gap-4">

          <InputField label="Your Role" value={form.role} onChange={(role) => setForm({ ...form, role })} placeholder="Sole Designer & Developer" />

          <InputField label="Tools Used" value={form.tools} onChange={(tools) => setForm({ ...form, tools })} placeholder="Figma, React Native..." />

        </div>

        <div className="grid grid-cols-2 gap-4">

          <InputField label="Status" value={form.status} onChange={(status) => setForm({ ...form, status })} placeholder="Live, In Development..." />

          <InputField label="Timeline" value={form.timeline} onChange={(timeline) => setForm({ ...form, timeline })} placeholder="Apr 2025 – Present" />

        </div>

        <InputField label="Project Link" value={form.link} onChange={(link) => setForm({ ...form, link })} placeholder="https://rootsapp.no" />

        <InputField label="Tech Stack" value={form.tech} onChange={(tech) => setForm({ ...form, tech })} placeholder="React Native, Node.js, Figma..." />

        <div className="flex gap-2">

          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50">

            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save

          </button>

          <button onClick={() => { setEditing(null); setForm(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <X size={18} /> Cancel

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

            <img src={projectIcon} alt="" className="w-6 h-6 brightness-0 invert" />

          </div>

          Projects

        </h2>

        <button onClick={startNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

          <Plus size={18} /> Add Project

        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {data.projects.length === 0 ? (

          <p className="text-slate-400 py-8 text-center col-span-2">No projects yet. Flex your work! 💪</p>

        ) : (

          data.projects.map(proj => (

            <div key={proj.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition">

              <div className="flex justify-between items-start gap-2">

                <div className="flex-1">

                  <h3 className="font-bold text-white">{proj.title}</h3>

                  {proj.status && <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-full px-2 py-0.5 mt-1 inline-block">{proj.status}</span>}

                  <p className="text-slate-300 text-sm mt-2">{proj.description}</p>

                  {proj.role && <p className="text-xs text-slate-400 mt-1">👤 {proj.role}</p>}

                  {proj.tools && <p className="text-xs text-slate-400 mt-1">🛠️ {proj.tools}</p>}

                  {proj.timeline && <p className="text-xs text-slate-400 mt-1">📅 {proj.timeline}</p>}

                </div>

                <div className="flex gap-2">

                  <button onClick={() => startEdit(proj)} className="bg-green-600/30 hover:bg-green-600/50 text-emerald-300 p-2 rounded transition shrink-0">

                    <Edit size={18} />

                  </button>

                  <button onClick={() => handleDelete(proj.id)} className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition shrink-0">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}



function BlogEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);

  const [saving, setSaving] = useState(false);



  const startNew = () => {

    setEditing('new');

    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] });

  };



  const startEdit = (post) => {

    setEditing(post.id);

    setForm({

      title: post.title || '',

      content: post.content || '',

      date: post.date || new Date().toISOString().split('T')[0]

    });

  };



  const handleSave = async () => {

    if (!form.title) {

      alert('Title is required');

      return;

    }

    try {

      setSaving(true);

      if (editing === 'new') {

        const newBlog = await portfolioAPI.createBlog(form);

        updateData({ ...data, blog: [...data.blog, newBlog] });

      } else {

        const updatedBlog = await portfolioAPI.updateBlog(editing, form);

        updateData({ ...data, blog: data.blog.map(p => (p.id === editing ? updatedBlog : p)) });

      }

      setEditing(null);

      setForm(null);

    } catch (error) {

      alert('Error saving blog post: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id) => {

    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {

      await portfolioAPI.deleteBlog(id);

      updateData({ ...data, blog: data.blog.filter(p => p.id !== id) });

    } catch (error) {

      alert('Error deleting blog post: ' + error.message);

    }

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Write Blog Post</h3>

        <InputField label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />

        <InputField label="Publish Date" type="date" value={form.date} onChange={(date) => setForm({ ...form, date })} />

        <TextArea label="Content" value={form.content} onChange={(content) => setForm({ ...form, content })} rows={8} placeholder="Your thoughts, insights, learnings..." />

        <div className="flex gap-2">

          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50">

            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Publish

          </button>

          <button onClick={() => { setEditing(null); setForm(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <X size={18} /> Cancel

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

            <img src={blogIcon} alt="" className="w-6 h-6 brightness-0 invert" />

          </div>

          Blog Posts

        </h2>

        <button onClick={startNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

          <Plus size={18} /> Write

        </button>

      </div>

      <div className="space-y-3">

        {data.blog.length === 0 ? (

          <p className="text-slate-400 py-8 text-center">No blog posts yet. Share your knowledge!</p>

        ) : (

          data.blog.map(post => (

            <div key={post.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition">

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <h3 className="font-bold text-white text-lg">{post.title}</h3>

                  <p className="text-slate-400 text-sm mt-1">📅 {post.date}</p>

                  <p className="text-slate-300 mt-3 line-clamp-2">{post.content}</p>

                </div>

                <div className="flex gap-2">

                  <button onClick={() => startEdit(post)} className="bg-green-600/30 hover:bg-green-600/50 text-emerald-300 p-2 rounded transition shrink-0">

                    <Edit size={18} />

                  </button>

                  <button onClick={() => handleDelete(post.id)} className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition shrink-0">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}



function SocialsEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);

  const [saving, setSaving] = useState(false);



  const startNew = () => {

    setEditing('new');

    setForm({ platform: '', url: '' });

  };



  const startEdit = (social) => {

    setEditing(social.id);

    setForm({

      platform: social.platform || '',

      url: social.url || ''

    });

  };



  const handleSave = async () => {

    if (!form.platform || !form.url) {

      alert('Platform and URL are required');

      return;

    }

    try {

      setSaving(true);

      const socialData = {

        platform: form.platform,

        url: form.url

      };

      console.log('Saving social data:', socialData);

      if (editing === 'new') {

        const newSocial = await portfolioAPI.createSocial(socialData);

        console.log('Social created successfully:', newSocial);

        updateData({ ...data, socials: [...data.socials, newSocial] });

      } else {

        const updatedSocial = await portfolioAPI.updateSocial(editing, socialData);

        console.log('Social updated successfully:', updatedSocial);

        updateData({ ...data, socials: data.socials.map(s => (s.id === editing ? updatedSocial : s)) });

      }

      setEditing(null);

      setForm(null);

    } catch (error) {

      console.error('Error saving social link:', error);

      alert('Error saving social link: ' + error.message);

    } finally {

      setSaving(false);

    }

  };



  const handleDelete = async (id) => {

    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {

      await portfolioAPI.deleteSocial(id);

      updateData({ ...data, socials: data.socials.filter(s => s.id !== id) });

    } catch (error) {

      alert('Error deleting social link: ' + error.message);

    }

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Edit Social Link</h3>

        <InputField label="Platform" value={form.platform} onChange={(platform) => setForm({ ...form, platform })} placeholder="e.g. Twitter, LinkedIn, GitHub" />

        <InputField label="URL" value={form.url} onChange={(url) => setForm({ ...form, url })} placeholder="https://..." />

        <div className="flex gap-2">

          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50">

            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save

          </button>

          <button onClick={() => { setEditing(null); setForm(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <X size={18} /> Cancel

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

            <img src={socialIcon} alt="" className="w-6 h-6 brightness-0 invert" />

          </div>

          Socials

        </h2>

        <button onClick={startNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

          <Plus size={18} /> Add Social

        </button>

      </div>

      <div className="space-y-3">

        {data.socials.length === 0 ? (

          <p className="text-slate-400 py-8 text-center">No social links yet. Add your social media profiles! 🌐</p>

        ) : (

          data.socials.map(social => (

            <div key={social.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition">

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <h3 className="font-bold text-white text-lg">{social.platform}</h3>

                  <a

                    href={social.url}

                    target="_blank"

                    rel="noopener noreferrer"

                    className="text-emerald-400 hover:text-emerald-300 text-sm mt-1 inline-block break-all"

                  >

                    {social.url}

                  </a>

                </div>

                <div className="flex gap-2">

                  <button onClick={() => startEdit(social)} className="bg-green-600/30 hover:bg-green-600/50 text-emerald-300 p-2 rounded transition shrink-0">

                    <Edit size={18} />

                  </button>

                  <button onClick={() => handleDelete(social.id)} className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition shrink-0">

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}



function PublicPortfolio({ data, username }) {

  return (

    <div className="space-y-12 max-w-4xl">

      <section className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-12 border border-slate-700">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">

          {data.bio?.profilePicture && (

            <div className="w-[200px] h-[200px] rounded-full bg-slate-700 border-4 border-slate-600 overflow-hidden flex-shrink-0 shadow-xl">

              <img

                src={data.bio.profilePicture}

                alt={data.bio.name || username}

                className="w-full h-full object-cover"

              />

            </div>

          )}

          <div className="flex-1 text-center md:text-left">

            <h1 className="text-5xl font-bold text-white mb-2">{data.bio?.name || username}</h1>

            <p className="text-2xl text-emerald-400 font-semibold mb-4">{data.bio?.title}</p>

            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-6">{data.bio?.about}</p>

            <div className="flex flex-wrap gap-6 text-sm justify-center md:justify-start">

              {data.bio?.email && <span className="text-slate-300">📧 <span className="text-slate-400">{data.bio.email}</span></span>}

              {data.bio?.phone && <span className="text-slate-300">📱 <span className="text-slate-400">{data.bio.phone}</span></span>}

            </div>

          </div>

        </div>

      </section>



      {data.experiences && data.experiences.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

              <img src={experienceIcon} alt="" className="w-6 h-6 brightness-0 invert" />

            </div>

            Experience

          </h2>

          <div className="space-y-4">

            {data.experiences.map(exp => (

              <div key={exp.id} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">

                <h3 className="font-bold text-white text-xl">{exp.position}</h3>

                <p className="text-emerald-400 font-medium mt-1">{exp.company}</p>

                <p className="text-sm text-slate-400 mt-2">{exp.start_date} → {exp.end_date || 'Current'}</p>

                {exp.description && <p className="text-slate-300 mt-4">{exp.description}</p>}

              </div>

            ))}

          </div>

        </section>

      )}



      {data.education && data.education.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

              <img src={bioIcon} alt="" className="w-6 h-6 brightness-0 invert" />

            </div>

            Education

          </h2>

          <div className="space-y-4">

            {data.education.map(edu => (

              <div key={edu.id} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">

                <div className="flex items-start justify-between gap-4 flex-wrap">

                  <div>

                    <h3 className="font-bold text-white text-xl">{edu.institution}</h3>

                    <p className="text-emerald-400 font-medium mt-1">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>

                    <p className="text-sm text-slate-400 mt-1">{edu.start_year}{edu.end_year ? ` → ${edu.end_year}` : ''}</p>

                    {edu.description && <p className="text-slate-300 mt-3 text-sm leading-relaxed">{edu.description}</p>}

                  </div>

                  {edu.grade && (

                    <span className="text-sm bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 rounded-lg px-3 py-1 shrink-0">🎓 {edu.grade}</span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </section>

      )}



      {data.projects && data.projects.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

              <img src={projectIcon} alt="" className="w-6 h-6 brightness-0 invert" />

            </div>

            Projects

          </h2>

          <div className="space-y-6">

            {data.projects.map((proj, idx) => (

              <div key={proj.id} className="bg-slate-700/30 rounded-xl border border-slate-600 hover:border-emerald-600/40 transition overflow-hidden">

                <div className="p-6 border-b border-slate-700/50">

                  <div className="flex items-start justify-between gap-4 flex-wrap">

                    <div>

                      <p className="text-xs font-medium tracking-widest text-emerald-400 uppercase mb-1">Project {String(idx + 1).padStart(2, '0')}</p>

                      <h3 className="font-bold text-white text-2xl">{proj.title}</h3>

                      {proj.description && <p className="text-slate-300 mt-2 text-sm leading-relaxed">{proj.description}</p>}

                    </div>

                    {proj.status && (

                      <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 rounded-full px-3 py-1 shrink-0 mt-1">{proj.status}</span>

                    )}

                  </div>

                  {(proj.role || proj.tools || proj.timeline) && (

                    <div className="flex flex-wrap gap-6 mt-4">

                      {proj.role && <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Role</p><p className="text-sm text-white font-medium">{proj.role}</p></div>}

                      {proj.tools && <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Tools</p><p className="text-sm text-white font-medium">{proj.tools}</p></div>}

                      {proj.timeline && <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Timeline</p><p className="text-sm text-white font-medium">{proj.timeline}</p></div>}

                    </div>

                  )}

                </div>

                {(proj.problem || proj.highlights || proj.tech) && (

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {proj.problem && (

                      <div>

                        <p className="text-xs font-medium tracking-widest text-emerald-400 uppercase mb-2">The Problem</p>

                        <p className="text-slate-300 text-sm leading-relaxed">{proj.problem}</p>

                      </div>

                    )}

                    {proj.highlights && (

                      <div>

                        <p className="text-xs font-medium tracking-widest text-emerald-400 uppercase mb-2">Key Highlights</p>

                        <ul className="space-y-1">

                          {proj.highlights.split('\n').filter(Boolean).map((line, i) => (

                            <li key={i} className="text-slate-300 text-sm flex items-start gap-2">

                              <span className="text-emerald-400 mt-1 shrink-0">▸</span>{line}

                            </li>

                          ))}

                        </ul>

                      </div>

                    )}

                  </div>

                )}

                {(proj.link || proj.tech) && (

                  <div className="px-6 pb-5 flex items-center justify-between flex-wrap gap-3">

                    {proj.tech && <p className="text-xs text-slate-400">🛠️ {proj.tech}</p>}

                    {proj.link && (

                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition">

                        Visit Project →

                      </a>

                    )}

                  </div>

                )}

              </div>

            ))}

          </div>

        </section>

      )}



      {data.blog && data.blog.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

              <img src={blogIcon} alt="" className="w-6 h-6 brightness-0 invert" />

            </div>

            Blog

          </h2>

          <div className="space-y-4">

            {data.blog.map(post => (

              <div key={post.id} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">

                <h3 className="font-bold text-white text-xl">{post.title}</h3>

                <p className="text-slate-400 text-sm mt-2">📅 {post.date}</p>

                <p className="text-slate-300 mt-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

              </div>

            ))}

          </div>

        </section>

      )}



      {data.socials && data.socials.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">

              <img src={socialIcon} alt="" className="w-6 h-6 brightness-0 invert" />

            </div>

            Socials

          </h2>

          <div className="flex flex-wrap gap-4">

            {data.socials.map(social => (

              <a

                key={social.id}

                href={social.url}

                target="_blank"

                rel="noopener noreferrer"

                className="bg-slate-700/30 hover:bg-slate-700/50 rounded-lg px-6 py-3 border border-slate-600 hover:border-emerald-600/50 transition inline-flex items-center gap-2"

              >

                <span className="font-semibold text-emerald-400">{social.platform}</span>

                <span className="text-slate-400 text-sm">→</span>

              </a>

            ))}

          </div>

        </section>

      )}

    </div>

  );

}



function AuthPage({ onSignup, onLogin, loading }) {

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({ email: '', password: '' });



  const handleSubmit = (e) => {

    e.preventDefault();

    if (isSignup) {

      onSignup(e, form.email, form.password);

    } else {

      onLogin(e, form.email, form.password);

    }

    setForm({ email: '', password: '' });

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">

      <div className="w-full max-w-sm">

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">

          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-white mb-2">The Portfolio</h1>

            <p className="text-slate-400">{isSignup ? 'Build your online presence' : 'Welcome back'}</p>

          </div>



          <form onSubmit={handleSubmit} className="space-y-4">

            <input

              type="email"

              placeholder="Email"

              value={form.email}

              onChange={(e) => setForm({ ...form, email: e.target.value })}

              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"

              required

            />

            <input

              type="password"

              placeholder="Password"

              value={form.password}

              onChange={(e) => setForm({ ...form, password: e.target.value })}

              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"

              required

            />

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition mt-2 disabled:opacity-50"

            >

              {loading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}

            </button>

          </form>



          <div className="mt-6 text-center">

            <p className="text-slate-400 text-sm">

              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}

              <button

                onClick={() => setIsSignup(!isSignup)}

                className="text-emerald-400 hover:text-emerald-300 font-semibold transition"

              >

                {isSignup ? 'Sign In' : 'Sign Up'}

              </button>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}
