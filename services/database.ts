import { Story, Article } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// --- API LAYER (Frontend Client) ---

export const initDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
        console.log("Backend: Connected to local server at port 3001");
    } else {
        console.warn("Backend: Server reachable but returned error");
    }
  } catch (err) {
    console.error("Backend: Could not connect to localhost:3001. Ensure the Node server is running.");
  }
};

export const api = {
  // GET /stories?filter=...
  getStories: async (filter: 'all' | 'blindspot' | 'top' | 'hero' | 'briefing' = 'all'): Promise<Story[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/stories?filter=${filter}`);
        if (!response.ok) {
            console.error('Failed to fetch stories');
            return [];
        }
        const stories = await response.json();
        return stories;
    } catch (error) {
        console.error('Network error fetching stories:', error);
        return [];
    }
  },

  // GET /stories/:id
  getStoryById: async (id: string): Promise<Story | undefined> => {
    try {
        const response = await fetch(`${API_BASE_URL}/stories/${id}`);
        if (!response.ok) return undefined;
        return await response.json();
    } catch (error) {
        console.error('Network error fetching story:', error);
        return undefined;
    }
  },

  // Helper to fetch articles (Now handled implicitly by backend usually, but keeping if needed for specific endpoints)
  getArticlesForStory: async (storyId: string): Promise<Article[]> => {
     // This logic is now likely handled by the backend /stories/:id endpoint including the articles,
     // but if we needed a separate endpoint:
     return [];
  }
};