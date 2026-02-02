import apiClient from './client';
import { API_ENDPOINTS } from './config';

/**
 * Novel Service
 * Handles all API calls related to novels
 */

const novelService = {
  // Simple memory cache for the home page (Fix 4)
  novelListCache: null as any,

  /**
   * Clear the memory cache (Call this after create/update/delete)
   */
  clearNovelCache: () => {
    novelService.novelListCache = null;
  },

  /**
   * Get all novels
   * @returns {Promise} Array of novels
   */
  getAllNovels: async (filters: any = {}) => {
    try {
      // Fix 4: Client-side Memory Cache (Optimized for Home Page/Page 1)
      // Only serve cache if no search and we are on the first page
      // Fix: Backend uses 0-based indexing for pages
      const page = Number(filters.page ?? 0);
      const isHomePage = !filters.search && page === 0;

      if (isHomePage && novelService.novelListCache) {
        return novelService.novelListCache;
      }

      // Fix 1: Removed _t timestamp to enable Browser & Edge Caching
      const params = { ...filters }; 
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS, { params });
      
      // Update cache
      if (isHomePage) {
        novelService.novelListCache = response.data;
      }

      return response.data; 
    } catch (error) {
      console.error('Error fetching novels:', error);
      throw error;
    }
  },

  /**
   * Get a specific novel by ID
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Novel details
   */
  getNovelById: async (novelId: string | number, language?: string) => {
    try {
      const endpoint = API_ENDPOINTS.GET_NOVEL.replace(':id', novelId.toString());
      const response = await apiClient.get(endpoint, {
        params: { lang: language }
      });
      return response.data;
    } catch (error) {
       console.error(`Error fetching novel ${novelId}:`, error);
       throw error;
    }
  },

  /**
   * Get novel by slug or title
   * @param {string} slug - The slug or title of the novel
   * @returns {Promise} Novel details
   */
  getNovelBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVEL_BY_SLUG, {
        params: { slug }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get specific novel "ராட்சசனே எனை வதைப்பதேனடா!" by Thenmozhi
   * This is a dedicated endpoint for this specific novel
   * @returns {Promise} Novel details with all chapters
   */
  getRatsasaneEnaiVathaippathenaNovel: async () => {
    // This looks like legacy hardcoded behavior, checking if we can route it dynamically
    // For now, attempting to call generic endpoint if not implemented on backend
    try {
       const response = await apiClient.get(API_ENDPOINTS.GET_RATSASANE_NOVEL);
       return response.data;
    } catch (e) {
      // Fallback to searching by title if specific endpoint doesn't exist on backend
      // This is a temporary compatibility layer
       console.warn('Dedicated endpoint failed, trying generic search');
       return {}; 
    }
  },

  /**
   * Get chapters for a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Array of chapters
   */
  getNovelChapters: async (novelId: string | number) => {
    try {
      const endpoint = API_ENDPOINTS.GET_NOVEL_CHAPTERS.replace(':id', novelId.toString());
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chapters for novel ${novelId}:`, error);
      return { chapters: [] };
    }
  },

  /**
   * Get a specific chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language ('tamil' or 'english')
   * @returns {Promise} Chapter details with content
   */
  getChapter: async (novelId: string | number, chapterId: string | number, language: string = 'tamil') => {
    const endpoint = API_ENDPOINTS.GET_CHAPTER
      .replace(':novelId', novelId.toString())
      .replace(':chapterId', chapterId.toString());

    // Add language query parameter
    const response = await apiClient.get(endpoint, {
      params: { lang: language }
    });

    return response.data;
  },

  /**
   * Bookmark a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Bookmark status
   */
  bookmarkNovel: async (novelId: string | number) => {
    const response = await apiClient.post(API_ENDPOINTS.BOOKMARK_NOVEL, {
      novelId
    });
    return response.data;
  },

  /**
   * Get user's library (bookmarked novels)
   * @returns {Promise} Array of novels
   */
  getLibrary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_LIBRARY, {
      params: { _t: new Date().getTime() } // Cache busting
    });
    return response.data;
  },

  /**
   * Remove bookmark from a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Bookmark status
   */
  removeBookmark: async (novelId: string | number) => {
    const response = await apiClient.delete(API_ENDPOINTS.REMOVE_BOOKMARK, {
      data: { novelId }
    });
    return response.data;
  },

  /**
   * Like a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Like status
   */
  likeNovel: async (novelId: string | number) => {
    const response = await apiClient.post(API_ENDPOINTS.LIKE_NOVEL, {
      novelId
    });
    return response.data;
  },

  /**
   * Unlike a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Like status
   */
  unlikeNovel: async (novelId: string | number) => {
    const response = await apiClient.delete(API_ENDPOINTS.LIKE_NOVEL, {
      data: { novelId }
    });
    return response.data;
  },

  /**
   * Like a chapter
   * @param {string|number} chapterId - The ID of the chapter
   * @returns {Promise} Like status
   */
  likeChapter: async (chapterId: string | number) => {
    const endpoint = API_ENDPOINTS.LIKE_CHAPTER.replace(':id', chapterId.toString());
    const response = await apiClient.post(endpoint);
    return response.data;
  },

  /**
   * Unlike a chapter
   * @param {string|number} chapterId - The ID of the chapter
   * @returns {Promise} Like status
   */
  unlikeChapter: async (chapterId: string | number) => {
    const endpoint = API_ENDPOINTS.UNLIKE_CHAPTER.replace(':id', chapterId.toString());
    const response = await apiClient.delete(endpoint);
    return response.data;
  },

  /**
   * Update reading progress
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The current chapter ID
   * @param {number} progress - Reading progress percentage (0-100)
   * @returns {Promise} Progress update status
   */
  updateReadingProgress: async (novelId: string | number, chapterId: string | number, progress: number = 0) => {
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_READING_PROGRESS, {
      novelId,
      chapterId,
      progress
    });
    return response.data;
  },

  /**
   * Get user's reading progress for a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Reading progress data
   */
  getReadingProgress: async (novelId: string | number) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_READING_PROGRESS, {
      params: { novelId }
    });
    return response.data;
  },

  /**
   * Download novel as PDF
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} PDF file blob
   */
  downloadNovelPDF: async (novelId: string | number) => {
    const endpoint = API_ENDPOINTS.DOWNLOAD_NOVEL_PDF.replace(':id', novelId.toString());
    const response = await apiClient.get(endpoint, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Search novels
   * @param {string} query - Search query
   * @param {Object} filters - Optional filters (genre, author, etc.)
   * @returns {Promise} Array of matching novels
   */
  searchNovels: async (query: string, filters: Record<string, any> = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.SEARCH_NOVELS, {
      params: { query, ...filters }
    });
    return response.data;
  },

  /**
   * Get novels by genre
   * @param {string} genre - Genre name
   * @returns {Promise} Array of novels
   */
  getNovelsByGenre: async (genre: string) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_GENRE, {
      params: { genre }
    });
    return response.data;
  },

  /**
   * Get novels by author
   * @param {string} author - Author name
   * @returns {Promise} Array of novels
   */
  getNovelsByAuthor: async (author: string) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_AUTHOR, {
      params: { author }
    });
    return response.data;
  }
};

export default novelService;
