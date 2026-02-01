import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2, Save, X, Upload, User } from 'lucide-react';

import bioIcon from '../assets/bio and info.png';

import experienceIcon from '../assets/experience.png';

import projectIcon from '../assets/project.png';

import blogIcon from '../assets/blog.png';

import socialIcon from '../assets/social.png';

import contentIcon from '../assets/content.png';



export default function PortfolioCMS() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState('login');

  const [users, setUsers] = useState({});

  const [portfolio, setPortfolio] = useState({});



  useEffect(() => {

    try {

      const savedUsers = localStorage.getItem('portfolio_users');

      const savedPortfolio = localStorage.getItem('portfolio_data');

      const activeUser = localStorage.getItem('portfolio_active_user');

      if (savedUsers) setUsers(JSON.parse(savedUsers));

      if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));

      if (activeUser && savedUsers && JSON.parse(savedUsers)[activeUser]) {

        setCurrentUser(activeUser);

        setIsLoggedIn(true);

        setCurrentPage('dashboard');

      }

    } catch (e) {

      console.log('First time setup');

    }

  }, []);



  useEffect(() => {

    localStorage.setItem('portfolio_users', JSON.stringify(users));

  }, [users]);



  useEffect(() => {

    localStorage.setItem('portfolio_data', JSON.stringify(portfolio));

  }, [portfolio]);



  const handleSignup = (e, username, password, email) => {

    e.preventDefault();

    if (users[username]) {

      alert('Username taken homie 🔐');

      return;

    }

    setUsers({ ...users, [username]: { username, password, email } });

    setCurrentUser(username);

    setIsLoggedIn(true);

    setCurrentPage('dashboard');

    localStorage.setItem('portfolio_active_user', username);

  };



  const handleLogin = (e, username, password) => {

    e.preventDefault();

    if (users[username] && users[username].password === password) {

      setCurrentUser(username);

      setIsLoggedIn(true);

      setCurrentPage('dashboard');

      localStorage.setItem('portfolio_active_user', username);

    } else {

      alert('Invalid credentials fam ❌');

    }

  };



  const handleLogout = () => {

    setIsLoggedIn(false);

    setCurrentUser(null);

    setCurrentPage('login');

    localStorage.removeItem('portfolio_active_user');

  };



  const getUserData = () => portfolio[currentUser] || {

    bio: { name: '', title: '', tagline: '', about: '', email: '', phone: '', profilePicture: '', heroImage: '' },

    experiences: [],

    projects: [],

    blog: [],

    socials: []

  };



  const updateUserData = (newData) => {

    setPortfolio({ ...portfolio, [currentUser]: newData });

  };



  if (!isLoggedIn) {

    return <AuthPage onSignup={handleSignup} onLogin={handleLogin} />;

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

              <Link to="/" target="_blank" className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition font-medium">View Site</Link>

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

  const [form, setForm] = useState(data.bio);

  const fileInputRef = useRef(null);



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



  const handleSave = () => {

    updateData({ ...data, bio: form });

    alert('Profile saved! ✅');

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

        <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image</label>

        <p className="text-xs text-slate-400 mb-2">Optional. Shows in the hero section next to your intro. Use a portrait or wide image.</p>

        <div className="flex items-center gap-6">

          <div className="relative">

            <div className="w-[280px] h-[180px] rounded-lg bg-slate-700 border-2 border-dashed border-slate-600 overflow-hidden flex items-center justify-center">

              {form.heroImage ? (

                <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />

              ) : (

                <div className="text-center text-slate-400">

                  <Upload size={40} className="mx-auto mb-2 opacity-50" />

                  <span className="text-sm">No image</span>

                </div>

              )}

            </div>

            <div className="flex gap-2 mt-2">

              <input type="file" accept="image/*" id="hero-image-input" className="hidden" onChange={(e) => {

                const file = e.target.files?.[0];

                if (file && file.size <= 5 * 1024 * 1024) {

                  const reader = new FileReader();

                  reader.onloadend = () => setForm({ ...form, heroImage: reader.result });

                  reader.readAsDataURL(file);

                } else if (file) alert('Image must be under 5MB');

              }} />

              <label htmlFor="hero-image-input" className="cursor-pointer text-sm text-emerald-400 hover:text-emerald-300">Upload</label>

              {form.heroImage && <button type="button" onClick={() => setForm({ ...form, heroImage: '' })} className="text-sm text-red-400 hover:text-red-300">Remove</button>}

            </div>

          </div>

        </div>

      </div>



      <div className="space-y-4">

        <InputField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />

        <InputField label="Tagline / Identity Statement" value={form.tagline} onChange={(tagline) => setForm({ ...form, tagline })} placeholder="e.g. I make things with words" />

        <InputField label="Professional Title" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="e.g. Writer & Teacher (optional)" />

        <TextArea label="About You" value={form.about} onChange={(about) => setForm({ ...form, about })} placeholder="Your story in prose — who you are, your journey, what you do now..." rows={6} />

        <InputField label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />

        <InputField label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />

      </div>

      <button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition font-medium">

        <Save size={18} /> Save Changes

      </button>

    </div>

  );

}



function ExperienceEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);



  const startNew = () => {

    setEditing('new');

    setForm({ id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '' });

  };



  const startEdit = (exp) => {

    setEditing(exp.id);

    setForm(exp);

  };



  const handleSave = () => {

    if (!form.position || !form.company) {

      alert('Fill in position & company please');

      return;

    }

    if (editing === 'new') {

      updateData({ ...data, experiences: [...data.experiences, form] });

    } else {

      updateData({ ...data, experiences: data.experiences.map(e => (e.id === form.id ? form : e)) });

    }

    setEditing(null);

    setForm(null);

  };



  const handleDelete = (id) => {

    updateData({ ...data, experiences: data.experiences.filter(e => e.id !== id) });

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Edit Experience</h3>

        <InputField label="Company" value={form.company} onChange={(company) => setForm({ ...form, company })} />

        <InputField label="Position" value={form.position} onChange={(position) => setForm({ ...form, position })} />

        <div className="grid grid-cols-2 gap-4">

          <InputField label="Start Date" value={form.startDate} onChange={(startDate) => setForm({ ...form, startDate })} placeholder="Jan 2020" />

          <InputField label="End Date" value={form.endDate} onChange={(endDate) => setForm({ ...form, endDate })} placeholder="Dec 2023" />

        </div>

        <TextArea label="What you did" value={form.description} onChange={(description) => setForm({ ...form, description })} rows={3} />

        <div className="flex gap-2">

          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <Save size={18} /> Save

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

                  <p className="text-sm text-slate-400 mt-1">{exp.startDate} → {exp.endDate || 'Current'}</p>

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



function ProjectsEditor({ data, updateData }) {

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(null);



  const startNew = () => {

    setEditing('new');

    setForm({ id: Date.now(), title: '', description: '', featuredDescription: '', link: '', tech: '', featured: false, image: '' });

  };



  const startEdit = (proj) => {

    setEditing(proj.id);

    setForm(proj);

  };



  const handleSave = () => {

    if (!form.title) {

      alert('Project title is required');

      return;

    }

    if (editing === 'new') {

      updateData({ ...data, projects: [...data.projects, form] });

    } else {

      updateData({ ...data, projects: data.projects.map(p => (p.id === form.id ? form : p)) });

    }

    setEditing(null);

    setForm(null);

  };



  const handleDelete = (id) => {

    updateData({ ...data, projects: data.projects.filter(p => p.id !== id) });

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Edit Project</h3>

        <InputField label="Project Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />

        <TextArea label="Short Description" value={form.description} onChange={(description) => setForm({ ...form, description })} rows={2} placeholder="Brief summary for list view" />

        <div className="flex items-center gap-2">

          <input type="checkbox" id="featured" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500" />

          <label htmlFor="featured" className="text-slate-300 font-medium">Featured — give this project a full spotlight section</label>

        </div>

        {form.featured && <TextArea label="Featured Description" value={form.featuredDescription || ''} onChange={(featuredDescription) => setForm({ ...form, featuredDescription })} rows={6} placeholder="Rich narrative about this work — the story, the vision, why it matters..." />}

        <div>

          <label className="block text-sm font-medium text-slate-300 mb-2">Project Image</label>

          <div className="flex items-center gap-4">

            <div className="w-32 h-24 rounded-lg bg-slate-700 border border-slate-600 overflow-hidden flex-shrink-0 flex items-center justify-center">

              {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-500 text-xs">No image</span>}

            </div>

            <div>

              <input type="file" accept="image/*" id={`proj-img-${form.id}`} className="hidden" onChange={(e) => {

                const file = e.target.files?.[0];

                if (file && file.size <= 5 * 1024 * 1024) { const r = new FileReader(); r.onloadend = () => setForm({ ...form, image: r.result }); r.readAsDataURL(file); }

                else if (file) alert('Image must be under 5MB');

              }} />

              <label htmlFor={`proj-img-${form.id}`} className="text-sm text-emerald-400 hover:text-emerald-300 cursor-pointer">Upload</label>

              {form.image && <button type="button" onClick={() => setForm({ ...form, image: '' })} className="text-sm text-red-400 hover:text-red-300 ml-2">Remove</button>}

            </div>

          </div>

        </div>

        <InputField label="Project Link" value={form.link} onChange={(link) => setForm({ ...form, link })} placeholder="https://..." />

        <InputField label="Tech Stack / Category" value={form.tech} onChange={(tech) => setForm({ ...form, tech })} placeholder="React, Node — or: Book, Podcast, Course..." />

        <div className="flex gap-2">

          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <Save size={18} /> Save

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

                {proj.image && (
                  <div className="w-14 h-14 rounded flex-shrink-0 overflow-hidden bg-slate-600">
                    <img src={proj.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white flex items-center gap-2">{proj.title} {proj.featured && <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">Featured</span>}</h3>
                  <p className="text-slate-300 text-sm mt-2">{proj.description}</p>
                  {proj.tech && <p className="text-xs text-slate-400 mt-2">🛠️ {proj.tech}</p>}
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



  const startNew = () => {

    setEditing('new');

    setForm({ id: Date.now(), title: '', content: '', date: new Date().toISOString().split('T')[0] });

  };



  const startEdit = (post) => {

    setEditing(post.id);

    setForm(post);

  };



  const handleSave = () => {

    if (!form.title) {

      alert('Title is required');

      return;

    }

    if (editing === 'new') {

      updateData({ ...data, blog: [...data.blog, form] });

    } else {

      updateData({ ...data, blog: data.blog.map(p => (p.id === form.id ? form : p)) });

    }

    setEditing(null);

    setForm(null);

  };



  const handleDelete = (id) => {

    updateData({ ...data, blog: data.blog.filter(p => p.id !== id) });

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Write Blog Post</h3>

        <InputField label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />

        <InputField label="Publish Date" type="date" value={form.date} onChange={(date) => setForm({ ...form, date })} />

        <TextArea label="Content" value={form.content} onChange={(content) => setForm({ ...form, content })} rows={8} placeholder="Your thoughts, insights, learnings..." />

        <div className="flex gap-2">

          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <Save size={18} /> Publish

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



  const startNew = () => {

    setEditing('new');

    setForm({ id: Date.now(), platform: '', url: '' });

  };



  const startEdit = (social) => {

    setEditing(social.id);

    setForm(social);

  };



  const handleSave = () => {

    if (!form.platform || !form.url) {

      alert('Platform and URL are required');

      return;

    }

    if (editing === 'new') {

      updateData({ ...data, socials: [...data.socials, form] });

    } else {

      updateData({ ...data, socials: data.socials.map(s => (s.id === form.id ? form : s)) });

    }

    setEditing(null);

    setForm(null);

  };



  const handleDelete = (id) => {

    updateData({ ...data, socials: data.socials.filter(s => s.id !== id) });

  };



  if (editing !== null && form) {

    return (

      <div className="space-y-4">

        <h3 className="text-2xl font-bold text-white">Edit Social Link</h3>

        <InputField label="Platform" value={form.platform} onChange={(platform) => setForm({ ...form, platform })} placeholder="e.g. Twitter, LinkedIn, GitHub" />

        <InputField label="URL" value={form.url} onChange={(url) => setForm({ ...form, url })} placeholder="https://..." />

        <div className="flex gap-2">

          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium">

            <Save size={18} /> Save

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



export function PublicPortfolio({ data, username = '' }) {
  const name = data.bio?.name || username;
  const tagline = data.bio?.tagline || '';
  const featuredProjects = (data.projects || []).filter((p) => p.featured);
  const otherProjects = (data.projects || []).filter((p) => !p.featured);
  const allProjects = data.projects || [];
  const socials = data.socials || [];
  const heroImg = data.bio?.heroImage || data.bio?.profilePicture;

  return (
    <div className="font-sans text-slate-200">
      {/* Hero — identity over credentials */}
      <section className="min-h-[85vh] flex flex-col md:flex-row md:items-center justify-between gap-12 px-6 py-20 max-w-6xl mx-auto">
        <div className="flex-1">
          <p className="text-slate-400 text-lg mb-4 font-medium">Hello. My name is</p>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight mb-6">
            {name}.
          </h1>
          {tagline && (
            <p className="font-serif text-2xl md:text-3xl text-slate-300 italic leading-relaxed max-w-2xl">
              {tagline}
            </p>
          )}
          {!tagline && (
            <p className="text-slate-500 text-sm">Add a tagline in your bio — e.g. &quot;I make things with words&quot;</p>
          )}
          <div className="mt-16 text-slate-500 text-sm animate-bounce">↓ scroll</div>
        </div>
        <div className="flex-shrink-0 w-full md:w-[380px] aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
          {heroImg ? (
            <img src={heroImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-600 text-center p-8">
              <p className="text-sm">Add a profile or hero image in Bio & Info</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Work — full narrative sections */}
      {featuredProjects.length > 0 &&
        featuredProjects.map((proj) => (
          <section
            key={proj.id}
            id={`project-${proj.id}`}
            className="py-20 md:py-28 px-6 border-t border-slate-700/50"
          >
            <div className="max-w-2xl mx-auto">
              {proj.image && (
                <div className="mb-8 rounded-lg overflow-hidden aspect-video bg-slate-800">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-6">
                {proj.title}
              </h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {proj.featuredDescription || proj.description}
                </p>
              </div>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-8 px-6 py-3 border border-slate-500 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 font-medium transition"
                >
                  View →
                </a>
              )}
            </div>
          </section>
        ))}

      {/* About — narrative story */}
      {(data.bio?.about || data.bio?.title) && (
        <section className="py-20 md:py-28 px-6 border-t border-slate-700/50 bg-slate-900/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-8">
              About {name}
            </h2>
            {data.bio.title && (
              <p className="text-emerald-400/90 font-medium mb-4">{data.bio.title}</p>
            )}
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
              {data.bio.about}
            </p>
          </div>
        </section>
      )}

      {/* Made — Things I've Made */}
      {allProjects.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-t border-slate-700/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-10">
              Things I&apos;ve Made
            </h2>
            <ul className="space-y-6">
              {allProjects.map((proj) => (
                <li key={proj.id} className="group flex gap-4 items-start">
                  {proj.image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                      <img src={proj.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-baseline gap-2 text-slate-300 hover:text-emerald-400 transition"
                      >
                        <span className="font-medium text-lg group-hover:translate-x-1 transition-transform">
                          {proj.title}
                        </span>
                        <span className="text-slate-500 text-sm">→</span>
                      </a>
                    ) : (
                      <span className="text-slate-300 text-lg">{proj.title}</span>
                    )}
                    {proj.tech && (
                      <span className="text-slate-500 text-sm block mt-0.5">{proj.tech}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Journey — experience, reframed */}
      {data.experiences?.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-t border-slate-700/50 bg-slate-900/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-10">
              Journey
            </h2>
            <div className="space-y-8">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <h3 className="font-medium text-white text-lg">{exp.position}</h3>
                  <p className="text-emerald-400/90 mt-0.5">{exp.company}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {exp.startDate} → {exp.endDate || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-slate-300 mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {data.blog?.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-t border-slate-700/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-10">
              Writing
            </h2>
            <div className="space-y-8">
              {data.blog.map((post) => (
                <article key={post.id}>
                  <h3 className="font-medium text-white text-lg">{post.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{post.date}</p>
                  <p className="text-slate-300 mt-3 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact — Stay in Touch */}
      {(socials.length > 0 || data.bio?.email) && (
        <section className="py-20 md:py-28 px-6 border-t border-slate-700/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-8">
              Stay in Touch
            </h2>
            <div className="flex flex-wrap gap-4">
              {data.bio?.email && (
                <a
                  href={`mailto:${data.bio.email}`}
                  className="text-slate-300 hover:text-emerald-400 transition font-medium"
                >
                  Email
                </a>
              )}
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-emerald-400 transition font-medium"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}



function AuthPage({ onSignup, onLogin }) {

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({ username: '', password: '', email: '' });



  const handleSubmit = (e) => {

    e.preventDefault();

    if (isSignup) {

      onSignup(e, form.username, form.password, form.email);

    } else {

      onLogin(e, form.username, form.password);

    }

    setForm({ username: '', password: '', email: '' });

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

              type="text"

              placeholder="Username"

              value={form.username}

              onChange={(e) => setForm({ ...form, username: e.target.value })}

              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"

              required

            />

            {isSignup && (

              <input

                type="email"

                placeholder="Email"

                value={form.email}

                onChange={(e) => setForm({ ...form, email: e.target.value })}

                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"

                required

              />

            )}

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

              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition mt-2"

            >

              {isSignup ? 'Create Account' : 'Sign In'}

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

