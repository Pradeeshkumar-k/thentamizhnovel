import apiClient from './client';
import { API_ENDPOINTS } from './config';

const readingProgressService = {
  /**
   * Get user's reading progress for a specific novel/chapter
   * @param {string} novelId - Novel ID
   * @param {string} chapterId - Chapter ID
   * @returns {Promise} - User's reading progress data
   */
  async getReadingProgress(novelId?: string, chapterId?: string) {
    let url = API_ENDPOINTS.GET_READING_PROGRESS;
    if (novelId && chapterId) {
      url += `?novelId=${novelId}&chapterId=${chapterId}`;
    } else if (novelId) {
      url += `?novelId=${novelId}`;
    }
    
    // If no args, it fetches all progress (dashboard view)
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Update reading progress for a novel
   * @param {Object} progressData - Progress data to update
   * @param {number} progressData.novelId - Novel ID
   * @param {string} progressData.novelTitle - Novel title
   * @param {string} progressData.coverImage - Cover image path
   * @param {string} progressData.author - Author name
   * @param {number} progressData.lastChapter - Last chapter read
   * @param {boolean} progressData.isCompleted - Completion status
   * @returns {Promise} - Updated progress data
   */
  /**
   * Update reading progress for a novel
   * @param {Object} progressData - Progress data to update
   */
  async updateProgress(progressData: any) {
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_READING_PROGRESS, progressData);
    return response.data;
  },

  /**
   * Mark a novel as started (ongoing)
   * @param {number} novelId - Novel ID
   * @param {string} novelTitle - Novel title
   * @param {string} coverImage - Cover image path
   * @param {string} author - Author name
   * @returns {Promise} - Updated progress data
   */
  async startReading(novelId: number | string, novelTitle: string, coverImage: string, author: string) {
    return this.updateProgress({
      novelId,
      novelTitle,
      coverImage,
      author,
      lastChapter: 1,
      isCompleted: false,
      startedAt: new Date().toISOString()
    });
  },

  /**
   * Update current chapter for a novel
   * @param {number} novelId - Novel ID
   * @param {number} progress - % Progress (optional)
   * @returns {Promise} - Updated progress data
   */
  async updateChapter(novelId: number | string, chapterId: number | string, progress: number = 0) {
    return this.updateProgress({
      novelId,
      chapterId, // Send as chapterId to match backend
      progress,
      isCompleted: false,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Mark a novel as completed
   * @param {number} novelId - Novel ID
   * @param {string} novelTitle - Novel title
   * @param {string} coverImage - Cover image path
   * @param {string} author - Author name
   * @returns {Promise} - Updated progress data
   */
  async completeNovel(novelId: number | string, novelTitle: string, coverImage: string, author: string) {
    return this.updateProgress({
      novelId,
      novelTitle,
      coverImage,
      author,
      lastChapter: 27,
      isCompleted: true,
      completedAt: new Date().toISOString()
    });
  },

  /**
   * Delete reading progress for a novel
   * @param {number} novelId - Novel ID
   * @returns {Promise} - Deletion confirmation
   */
  async deleteProgress(novelId: number | string) {
    const endpoint = API_ENDPOINTS.DELETE_READING_PROGRESS.replace(':novelId', novelId.toString());
    const response = await apiClient.delete(endpoint);
    return response.data;
  }
};

export default readingProgressService;
