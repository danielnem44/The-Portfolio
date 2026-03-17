/**
 * API service — powered by Supabase
 * Replaces the Sentinel backend with Supabase auth + database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── helpers ──────────────────────────────────────────────────────────────────

const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },

  register: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    return { email: user.email, id: user.id };
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
};

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export const portfolioAPI = {

  // ── Bio ────────────────────────────────────────────────────────────────────
  getBio: async () => {
    const { data, error } = await supabase
      .from('bio')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return { name: '', title: '', tagline: '', about: '', email: '', phone: '', profilePicture: '', heroImage: '' };

    return {
      name: data.name || '',
      title: data.title || '',
      tagline: data.tagline || '',
      about: data.about || '',
      email: data.email || '',
      phone: data.phone || '',
      profilePicture: data.profile_picture || '',
      heroImage: data.hero_image || '',
    };
  },

  saveBio: async (bioData) => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('bio')
      .upsert({
        user_id: userId,
        name: bioData.name || '',
        title: bioData.title || '',
        tagline: bioData.tagline || '',
        about: bioData.about || '',
        email: bioData.email || '',
        phone: bioData.phone || '',
        profile_picture: bioData.profilePicture || '',
        hero_image: bioData.heroImage || '',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  // ── Experiences ────────────────────────────────────────────────────────────
  getExperiences: async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  createExperience: async (expData) => {
    const userId = await getUserId();
    const { id: _id, ...rest } = expData;
    const { data, error } = await supabase
      .from('experiences')
      .insert({ ...rest, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateExperience: async (id, expData) => {
    const { id: _id, user_id: _uid, ...rest } = expData;
    const { data, error } = await supabase
      .from('experiences')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  deleteExperience: async (id) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  getProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []).map(p => ({
      ...p,
      featuredDescription: p.featured_description || '',
      featured_description: undefined,
    }));
  },

  createProject: async (projData) => {
    const userId = await getUserId();
    const { id: _id, featuredDescription, ...rest } = projData;
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...rest, featured_description: featuredDescription || '', user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { ...data, featuredDescription: data.featured_description || '' };
  },

  updateProject: async (id, projData) => {
    const { id: _id, user_id: _uid, featuredDescription, ...rest } = projData;
    const { data, error } = await supabase
      .from('projects')
      .update({ ...rest, featured_description: featuredDescription || '' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { ...data, featuredDescription: data.featured_description || '' };
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ── Blog ───────────────────────────────────────────────────────────────────
  getBlogs: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  createBlog: async (blogData) => {
    const userId = await getUserId();
    const { id: _id, ...rest } = blogData;
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...rest, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateBlog: async (id, blogData) => {
    const { id: _id, user_id: _uid, ...rest } = blogData;
    const { data, error } = await supabase
      .from('blog_posts')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  deleteBlog: async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ── Socials ────────────────────────────────────────────────────────────────
  getSocials: async () => {
    const { data, error } = await supabase
      .from('socials')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  createSocial: async (socialData) => {
    const userId = await getUserId();
    const { id: _id, ...rest } = socialData;
    const { data, error } = await supabase
      .from('socials')
      .insert({ ...rest, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateSocial: async (id, socialData) => {
    const { id: _id, user_id: _uid, ...rest } = socialData;
    const { data, error } = await supabase
      .from('socials')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  deleteSocial: async (id) => {
    const { error } = await supabase.from('socials').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ─── EDUCATION ────────────────────────────────────────────────────────────────

export const educationAPI = {
  getEducation: async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  createEducation: async (eduData) => {
    const userId = await getUserId();
    const { id: _id, ...rest } = eduData;
    const { data, error } = await supabase
      .from('education')
      .insert({ ...rest, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateEducation: async (id, eduData) => {
    const { id: _id, user_id: _uid, ...rest } = eduData;
    const { data, error } = await supabase
      .from('education')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  deleteEducation: async (id) => {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
