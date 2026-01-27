import apiClient from './client';
import { API_ENDPOINTS } from './config';

/**
 * Engagement Service
 * Handles likes, comments, and user interactions with chapters/novels
 */

const engagementService = {
  /**
   * Like a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Like confirmation
   */
  /**
   * Like a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Like confirmation
   */
  async likeChapter(novelId: number | string, chapterId: number | string) {
    try {
      const response = await apiClient.post('/engagement/chapter/like', {
        novelId,
        chapterId,
        likedAt: new Date().toISOString()
      });
      console.log('[ENGAGEMENT] Chapter liked:', { novelId, chapterId });
      return response.data;
    } catch (error) {
      console.error('Error liking chapter:', error);
      return { error: 'Failed to like chapter' };
    }
  },

  /**
   * Unlike a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Unlike confirmation
   */
  async unlikeChapter(novelId: number | string, chapterId: number | string) {
    try {
      const response = await apiClient.delete('/engagement/chapter/like', {
        data: { novelId, chapterId }
      });
      console.log('[ENGAGEMENT] Chapter unliked:', { novelId, chapterId });
      return response.data;
    } catch (error) {
      console.error('Error unliking chapter:', error);
      return { error: 'Failed to unlike chapter' };
    }
  },

  /**
   * Check if user liked a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Boolean indicating if chapter is liked
   */
  async isChapterLiked(novelId: number | string, chapterId: number | string) {
    try {
      const response = await apiClient.get(`/engagement/chapter/${novelId}/${chapterId}/liked`);
      return response.data.isLiked || false;
    } catch (error) {
      console.error('Error checking chapter like status:', error);
      return false;
    }
  },

  /**
   * Get likes count for a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Number of likes
   */
  async getChapterLikesCount(novelId: number | string, chapterId: number | string) {
    try {
      const response = await apiClient.get(`/engagement/chapter/${novelId}/${chapterId}/likes-count`);
      return response.data.likesCount || 0;
    } catch (error) {
      console.error('Error fetching likes count:', error);
      return 0;
    }
  },

  /**
   * Post a comment on a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @param {string} comment - Comment text
   * @returns {Promise} - Comment confirmation with ID
   */
  async postComment(novelId: number | string, chapterId: number | string, comment: string) {
    try {
      const response = await apiClient.post('/engagement/chapter/comment', {
        novelId,
        chapterId,
        comment,
        postedAt: new Date().toISOString()
      });
      console.log('[ENGAGEMENT] Comment posted:', { novelId, chapterId, comment });
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      return { error: 'Failed to post comment' };
    }
  },

  /**
   * Get comments for a chapter
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @param {number} limit - Limit number of comments (default 20)
   * @param {number} offset - Offset for pagination (default 0)
   * @returns {Promise} - Array of comments
   */
  async getChapterComments(novelId: number | string, chapterId: number | string, limit = 20, offset = 0) {
    try {
      const response = await apiClient.get(`/engagement/chapter/${novelId}/${chapterId}/comments`, {
        params: { limit, offset }
      });
      return response.data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  /**
   * Delete a comment
   * @param {number} commentId - Comment ID
   * @returns {Promise} - Deletion confirmation
   */
  async deleteComment(commentId: number | string) {
    try {
      const response = await apiClient.delete(`/engagement/comment/${commentId}`);
      console.log('[ENGAGEMENT] Comment deleted:', { commentId });
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { error: 'Failed to delete comment' };
    }
  },

  /**
   * Reply to a comment
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @param {number} parentCommentId - Parent comment ID
   * @param {string} reply - Reply text
   * @returns {Promise} - Reply confirmation with ID
   */
  async replyToComment(novelId: number | string, chapterId: number | string, parentCommentId: number | string, reply: string) {
    try {
      const response = await apiClient.post('/engagement/chapter/reply', {
        novelId,
        chapterId,
        parentCommentId,
        reply,
        repliedAt: new Date().toISOString()
      });
      console.log('[ENGAGEMENT] Reply posted:', { novelId, chapterId, parentCommentId });
      return response.data;
    } catch (error) {
      console.error('Error posting reply:', error);
      return { error: 'Failed to post reply' };
    }
  },

  /**
   * Get user's engagement stats for a novel
   * @param {number} novelId - Novel ID
   * @returns {Promise} - User's engagement stats
   */
  async getNovelEngagementStats(novelId: number | string) {
    try {
      const response = await apiClient.get(`/engagement/novel/${novelId}/stats`);
      return response.data || { likes: 0, comments: 0, bookmarks: 0 };
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
      return { likes: 0, comments: 0, bookmarks: 0 };
    }
  },

  /**
   * Get chapter-wise engagement stats
   * @param {number} novelId - Novel ID
   * @returns {Promise} - Engagement stats for all chapters
   */
  async getChapterEngagementStats(novelId: number | string) {
    try {
      const response = await apiClient.get(`/engagement/novel/${novelId}/chapters/stats`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching chapter engagement stats:', error);
      return [];
    }
  }
};

export default engagementService;
