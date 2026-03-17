/**
 * API service for Sentinel backend
 * Handles all API calls to the Sentinel backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('sentinel_token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('sentinel_token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('sentinel_token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { detail: errorText || `HTTP error! status: ${response.status}` };
      }
      console.error(`API Error [${response.status}]:`, error);
      throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (email, password) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return await apiRequest('/api/auth/me');
  },
};

// Portfolio API
export const portfolioAPI = {
  // Bio
  getBio: async () => {
    return await apiRequest('/api/portfolio/bio');
  },

  createOrUpdateBio: async (bioData) => {
    return await apiRequest('/api/portfolio/bio', {
      method: 'POST',
      body: JSON.stringify(bioData),
    });
  },

  updateBio: async (bioData) => {
    return await apiRequest('/api/portfolio/bio', {
      method: 'PUT',
      body: JSON.stringify(bioData),
    });
  },

  // Experiences
  getExperiences: async () => {
    return await apiRequest('/api/portfolio/experiences');
  },

  createExperience: async (experienceData) => {
    return await apiRequest('/api/portfolio/experiences', {
      method: 'POST',
      body: JSON.stringify(experienceData),
    });
  },

  updateExperience: async (experienceId, experienceData) => {
    return await apiRequest(`/api/portfolio/experiences/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(experienceData),
    });
  },

  deleteExperience: async (experienceId) => {
    return await apiRequest(`/api/portfolio/experiences/${experienceId}`, {
      method: 'DELETE',
    });
  },

  // Projects
  getProjects: async () => {
    return await apiRequest('/api/portfolio/projects');
  },

  createProject: async (projectData) => {
    return await apiRequest('/api/portfolio/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  updateProject: async (projectId, projectData) => {
    return await apiRequest(`/api/portfolio/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  deleteProject: async (projectId) => {
    return await apiRequest(`/api/portfolio/projects/${projectId}`, {
      method: 'DELETE',
    });
  },

  // Blogs
  getBlogs: async () => {
    return await apiRequest('/api/portfolio/blogs');
  },

  createBlog: async (blogData) => {
    return await apiRequest('/api/portfolio/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  updateBlog: async (blogId, blogData) => {
    return await apiRequest(`/api/portfolio/blogs/${blogId}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  deleteBlog: async (blogId) => {
    return await apiRequest(`/api/portfolio/blogs/${blogId}`, {
      method: 'DELETE',
    });
  },

  // Socials
  getSocials: async () => {
    return await apiRequest('/api/portfolio/socials');
  },

  createSocial: async (socialData) => {
    return await apiRequest('/api/portfolio/socials', {
      method: 'POST',
      body: JSON.stringify(socialData),
    });
  },

  updateSocial: async (socialId, socialData) => {
    return await apiRequest(`/api/portfolio/socials/${socialId}`, {
      method: 'PUT',
      body: JSON.stringify(socialData),
    });
  },

  deleteSocial: async (socialId) => {
    return await apiRequest(`/api/portfolio/socials/${socialId}`, {
      method: 'DELETE',
    });
  },
};

// Education API (localStorage-based — backend endpoint not yet available)
const EDUCATION_KEY = 'portfolio_education';

export const educationAPI = {
  getEducation: async () => {
    try {
      const data = localStorage.getItem(EDUCATION_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  createEducation: async (educationData) => {
    const current = JSON.parse(localStorage.getItem(EDUCATION_KEY) || '[]');
    const newItem = { ...educationData, id: Date.now().toString() };
    current.push(newItem);
    localStorage.setItem(EDUCATION_KEY, JSON.stringify(current));
    return newItem;
  },

  updateEducation: async (educationId, educationData) => {
    const current = JSON.parse(localStorage.getItem(EDUCATION_KEY) || '[]');
    const updated = current.map(e => e.id === educationId ? { ...educationData, id: educationId } : e);
    localStorage.setItem(EDUCATION_KEY, JSON.stringify(updated));
    return { ...educationData, id: educationId };
  },

  deleteEducation: async (educationId) => {
    const current = JSON.parse(localStorage.getItem(EDUCATION_KEY) || '[]');
    const filtered = current.filter(e => e.id !== educationId);
    localStorage.setItem(EDUCATION_KEY, JSON.stringify(filtered));
    return null;
  },
};

