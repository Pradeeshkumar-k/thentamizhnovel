import apiClient from './client';
import { API_ENDPOINTS } from './config';

/**
 * Novel Service
 * Handles all API calls related to novels
 */

// Basic In-Memory Cache System
interface CacheItem {
  data: any;
  timestamp: number;
}
const CACHE = new Map<string, CacheItem>();
const ID_CACHE_TTL = 30 * 60 * 1000; // 30 mins
const LIST_CACHE_TTL = 5 * 60 * 1000; // 5 mins
const PROGRESS_TTL = 60 * 1000; // 1 min

// Request Deduplication Map
const IN_FLIGHT = new Map<string, Promise<any>>();

/**
 * Normalizes novel data to ensure consistent field names (especially for translations)
 */
const normalizeNovel = (n: any) => {
  if (!n) return n;
  return {
    ...n,
    titleEn: n.titleEn || n.title_en || n.titleEnglish || n.englishTitle || (typeof n.title === 'object' ? n.title.english || n.title.en : undefined),
    descriptionEn: n.descriptionEn || n.description_en || n.summary_en || n.descriptionEnglish || n.summary_english || (typeof n.description === 'object' ? n.description.english || n.description.en : undefined),
    coverImage: n.coverImageUrl || n.coverImage,
    author: typeof n.author === 'object' ? n.author?.name : n.author
  };
};

/**
 * Normalizes chapter data to ensure consistent field names
 */
const normalizeChapter = (c: any) => {
  if (!c) return c;
  return {
    ...c,
    titleEn: c.titleEn || c.title_en || c.titleEnglish || c.title_english || c.englishTitle || (typeof c.title === 'object' ? c.title.english || c.title.en : undefined),
    contentEn: c.contentEn || c.content_en || c.contentEnglish || c.content_english || (typeof c.content === 'object' ? c.content.english || c.content.en : undefined)
  };
};

/**
 * Deduplicates concurrent requests for the same key.
 */
async function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (IN_FLIGHT.has(key)) {
    return IN_FLIGHT.get(key) as Promise<T>;
  }

  const promise = fn().finally(() => IN_FLIGHT.delete(key));
  IN_FLIGHT.set(key, promise);
  return promise;
}

const novelService = {
  // Helpers
  clearNovelCache: () => {
    CACHE.clear();
  },

  /**
   * Get all novels
   * @returns {Promise} Array of novels
   */
  getAllNovels: async (filters: any = {}) => {
    const cacheKey = `novels-${JSON.stringify(filters)}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < LIST_CACHE_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      try {
        // Fix 1: Removed _t timestamp to enable Browser & Edge Caching
        const params = { ...filters }; 
        const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS, { params });
        
        // Fix: Normalize Data Structure (Backend -> Frontend)
        const normalizedNovels = (response.data.novels || []).map(normalizeNovel);

        const result = {
          ...response.data,
          novels: normalizedNovels
        };

        // Set Cache
        CACHE.set(cacheKey, { data: result, timestamp: Date.now() });

        return result; 
      } catch (error) {
        console.error('Error fetching novels:', error);
        throw error;
      }
    });
  },

  /**
   * Get a specific novel by ID
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Novel details
   */
  getNovelById: async (novelId: string | number, language?: string) => {
    const cacheKey = `novel-${novelId}-${language || 'def'}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < ID_CACHE_TTL)) {
       return cached.data;
    }

    return dedupe(cacheKey, async () => {
      try {
        const endpoint = API_ENDPOINTS.GET_NOVEL.replace(':id', novelId.toString());
        const response = await apiClient.get(endpoint, {
          params: { lang: language }
        });
        
        // Fix: Normalize Single Novel Response
        const normalizedNovel = normalizeNovel(response.data);
         
        CACHE.set(cacheKey, { data: normalizedNovel, timestamp: Date.now() });

        return normalizedNovel;
      } catch (error) {
         console.error(`Error fetching novel ${novelId}:`, error);
         throw error;
      }
    });
  },

  /**
   * Get novel by slug or title
   * @param {string} slug - The slug or title of the novel
   * @returns {Promise} Novel details
   */
  getNovelBySlug: async (slug: string) => {
    return dedupe(`slug-${slug}`, async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GET_NOVEL_BY_SLUG, {
          params: { slug }
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    });
  },

  /**
   * Get specific novel "ராட்சசனே எனை வதைப்பதேனடா!" by Thenmozhi
   */
  getRatsasaneEnaiVathaippathenaNovel: async () => {
    return dedupe('ratsasane-novel', async () => {
      try {
         const response = await apiClient.get(API_ENDPOINTS.GET_RATSASANE_NOVEL);
         return response.data;
      } catch (e) {
         console.warn('Dedicated endpoint failed, trying generic search');
         return {}; 
      }
    });
  },

  /**
   * Get chapters for a novel
   * @param {string|number} novelId - The ID of the novel
   * @param {string} language - The language
   * @returns {Promise} Array of chapters
   */
  getNovelChapters: async (novelId: string | number, language: string = 'tamil') => {
    const cacheKey = `chapters-${novelId}-${language}`;
    const cached = CACHE.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < ID_CACHE_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      try {
        const endpoint = API_ENDPOINTS.GET_NOVEL_CHAPTERS.replace(':id', novelId.toString());
        const response = await apiClient.get(endpoint, {
          params: { lang: language }
        });
        
        const normalizedChapters = (response.data.chapters || []).map(normalizeChapter);
        const result = { ...response.data, chapters: normalizedChapters };
        
        CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
        
        return result;
      } catch (error) {
        console.error(`Error fetching chapters for novel ${novelId}:`, error);
        return { chapters: [] };
      }
    });
  },

  /**
   * Get a specific chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language ('tamil' or 'english')
   * @returns {Promise} Chapter details with content
   */
  getChapter: async (novelId: string | number, chapterId: string | number, language: string = 'tamil') => {
    const cacheKey = `chapter-${novelId}-${chapterId}-${language}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < ID_CACHE_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      const endpoint = API_ENDPOINTS.GET_CHAPTER
        .replace(':novelId', novelId.toString())
        .replace(':chapterId', chapterId.toString());

      // Add language query parameter
      const response = await apiClient.get(endpoint, {
        params: { lang: language }
      });

      CACHE.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    });
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
    // FIX 2: Removed cache-buster used previously
    const response = await apiClient.get(API_ENDPOINTS.GET_LIBRARY);
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
    
    // Invalidate caches
    for (const key of CACHE.keys()) {
      if (key.startsWith(`novel-${novelId}`) || key.startsWith('novels-')) {
        CACHE.delete(key);
      }
    }
    
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

    // Invalidate caches
    for (const key of CACHE.keys()) {
      if (key.startsWith(`novel-${novelId}`) || key.startsWith('novels-')) {
        CACHE.delete(key);
      }
    }

    return response.data;
  },

  /**
   * Like a chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language
   * @returns {Promise} Like status
   */
  likeChapter: async (novelId: string | number, chapterId: string | number, language: string) => {
    const endpoint = API_ENDPOINTS.LIKE_CHAPTER.replace(':id', chapterId.toString());
    const response = await apiClient.post(endpoint);

    // Invalidate specific cache
    const cacheKey = `chapter-${novelId}-${chapterId}-${language}`;
    CACHE.delete(cacheKey);

    return response.data;
  },

  /**
   * Unlike a chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language
   * @returns {Promise} Like status
   */
  unlikeChapter: async (novelId: string | number, chapterId: string | number, language: string) => {
    const endpoint = API_ENDPOINTS.UNLIKE_CHAPTER.replace(':id', chapterId.toString());
    const response = await apiClient.delete(endpoint);

    // Invalidate specific cache
    const cacheKey = `chapter-${novelId}-${chapterId}-${language}`;
    CACHE.delete(cacheKey);

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
    const cacheKey = `progress-${novelId}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < PROGRESS_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      const response = await apiClient.get(API_ENDPOINTS.GET_READING_PROGRESS, {
        params: { novelId }
      });
      
      CACHE.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    });
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
    const cacheKey = `search-${query}-${JSON.stringify(filters)}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < LIST_CACHE_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      const response = await apiClient.get(API_ENDPOINTS.SEARCH_NOVELS, {
        params: { query, ...filters }
      });
      CACHE.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    });
  },

  /**
   * Get novels by genre
   * @param {string} genre - Genre name
   * @returns {Promise} Array of novels
   */
  getNovelsByGenre: async (genre: string) => {
     const cacheKey = `genre-${genre}`;
     const cached = CACHE.get(cacheKey);

     if (cached && (Date.now() - cached.timestamp < LIST_CACHE_TTL)) {
       return cached.data;
     }

    return dedupe(cacheKey, async () => {
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_GENRE, {
        params: { genre }
      });
      CACHE.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    });
  },

  /**
   * Get novels by author
   * @param {string} author - Author name
   * @returns {Promise} Array of novels
   */
  getNovelsByAuthor: async (author: string) => {
    const cacheKey = `author-${author}`;
    const cached = CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < LIST_CACHE_TTL)) {
      return cached.data;
    }

    return dedupe(cacheKey, async () => {
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_AUTHOR, {
        params: { author }
      });
      CACHE.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    });
  },

  /**
   * Add a comment to a chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language
   * @param {string} text - The comment text
   * @returns {Promise} Response data
   */
  addComment: async (novelId: string | number, chapterId: string | number, language: string, text: string) => {
    const response = await apiClient.post(API_ENDPOINTS.ADD_COMMENT, {
      chapterId,
      text
    });

    // Invalidate specific cache (force refetch on refresh)
    const cacheKey = `chapter-${novelId}-${chapterId}-${language}`;
    CACHE.delete(cacheKey);

    return response.data;
  }
};

export default novelService;
