import apiClient from './client';

/**
 * Admin Service - Real API Integration
 *
 * This service provides real API calls for the Admin Dashboard.
 * Import this instead of adminMockService when backend is ready.
 */

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};

// ============================================
// NOVEL MANAGEMENT
// ============================================

interface NovelFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getAllNovelsAdmin = async (filters: NovelFilters = {}) => {
  const response = await apiClient.get('/admin/novels', { params: filters });
  return response.data;
};

export const getNovelByIdAdmin = async (novelId: string | number) => {
  const response = await apiClient.get(`/admin/novels/${novelId}`);
  return response.data;
};

export const createNovel = async (novelData: any) => {
  const token = localStorage.getItem('authToken');
  const response = await apiClient.post('/admin/novels', novelData, {
      headers: {
      Authorization: `Bearer ${token}`
      }
  });
  return response.data;
};

export const updateNovel = async (novelId: string | number, novelData: any) => {
  const token = localStorage.getItem('authToken');
  const response = await apiClient.put(`/admin/novels/${novelId}`, novelData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteNovel = async (novelId: string | number) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.delete(`/admin/novels/${novelId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Delete Novel Error:', error.response?.data || error.message);
    throw error; // Re-throw to let caller handle generic alerts
  }
};

// ============================================
// CHAPTER MANAGEMENT
// ============================================

export const getChaptersByNovel = async (novelId: string | number, filters = {}) => {
  const response = await apiClient.get(`/admin/novels/${novelId}/chapters`, { params: filters });
  return response.data;
};

export const getChapterById = async (chapterId: string | number) => {
  const response = await apiClient.get(`/admin/chapters/${chapterId}`);
  return response.data;
};

export const createChapter = async (novelId: string | number, chapterData: any) => {
  const token = localStorage.getItem('authToken');
  const response = await apiClient.post(`/admin/novels/${novelId}/chapters`, chapterData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateChapter = async (chapterId: string | number, chapterData: any) => {
  const token = localStorage.getItem('authToken');
  const response = await apiClient.put(`/admin/chapters/${chapterId}`, chapterData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteChapter = async (chapterId: string | number) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.delete(`/admin/chapters/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Delete Chapter Error:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// NOTIFICATIONS
// ============================================

export const getAllNotifications = async () => {
  const response = await apiClient.get('/admin/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string | number) => {
  const response = await apiClient.patch(`/admin/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.patch('/admin/notifications/read-all');
  return response.data;
};

// ============================================
// TRANSLATION UTILITY
// ============================================

export const autoTranslate = async (text: string, targetLang: string = 'en') => {
  const response = await apiClient.post('/admin/translate', { text, targetLang });
  return response.data;
};

// ============================================
// CONSTANTS
// ============================================

export const AVAILABLE_CATEGORIES = [
  'Historical',
  'Romance',
  'Adventure',
  'Contemporary',
  'Drama',
  'Mystery',
  'Thriller',
  'Fantasy',
  'Science Fiction',
  'Horror'
];

export const CHAPTER_TYPES = [
  'Regular',
  'Prologue',
  'Epilogue',
  'Bonus'
];

export const NOVEL_STATUS = [
  'Draft',
  'Published',
  'Archived',
  'Completed'
];

export const CHAPTER_STATUS = [
  'Draft',
  'Published',
  'Scheduled'
];
