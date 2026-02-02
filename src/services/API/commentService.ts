import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { Comment } from '../../types';

export const commentService = {
  // Add a new comment
  addComment: async (chapterId: string, text: string) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADD_COMMENT, {
        chapterId,
        text
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add comment',
      };
    }
  },

  // Get comments for a chapter (Paginated)
  getComments: async (chapterId: string, cursor: number = 0) => {
    try {
      const endpoint = API_ENDPOINTS.GET_CHAPTER_COMMENTS.replace(':id', chapterId);
      const response = await apiClient.get(endpoint, {
        params: { cursor }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch comments',
      };
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    try {
      const endpoint = API_ENDPOINTS.DELETE_COMMENT.replace(':id', commentId);
      const response = await apiClient.delete(endpoint);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete comment',
      };
    }
  }
};

export default commentService;
