// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  AUTHENTICATE: '/auth/authenticate', // Unified login/signup endpoint
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_TOKEN: '/auth/verify',

  // User
  GET_USER: '/user/profile',
  UPDATE_USER: '/user/profile',

  // Novels
  GET_NOVELS: '/novels',
  GET_NOVEL: '/novels/:id',
  GET_NOVEL_BY_SLUG: '/novels/slug',
  GET_NOVELS_BY_GENRE: '/novels/genre',
  GET_NOVELS_BY_AUTHOR: '/novels/author',
  SEARCH_NOVELS: '/novels/search',

  // Specific Novel - ராட்சசனே எனை வதைப்பதேனடா!
  GET_RATSASANE_NOVEL: '/novels/ratsasane-enai-vathaippathena',

  // Chapters
  GET_NOVEL_CHAPTERS: '/novels/:id/chapters',
  GET_CHAPTER: '/novels/:novelId/chapters/:chapterId',

  // Novel Interactions
  BOOKMARK_NOVEL: '/novels/bookmark',
  REMOVE_BOOKMARK: '/novels/bookmark',
  GET_LIBRARY: '/novels/bookmarks',
  LIKE_NOVEL: '/novels/like',
  
  // Chapter Interactions
  LIKE_CHAPTER: '/chapters/:id/like',
  UNLIKE_CHAPTER: '/chapters/:id/like',

  // Download
  DOWNLOAD_NOVEL_PDF: '/novels/:id/download/pdf',

  // Reading Progress
  GET_READING_PROGRESS: '/reading/progress',
  UPDATE_READING_PROGRESS: '/reading/progress',
  DELETE_READING_PROGRESS: '/reading/progress/:novelId',
  START_READING: '/reading/start',
  COMPLETE_NOVEL: '/reading/complete',

  // Comments
  ADD_COMMENT: '/comments',
  DELETE_COMMENT: '/comments/:id',

  // Admin - Dashboard
  ADMIN_DASHBOARD_STATS: '/admin/dashboard/stats',

  // Admin - Novel Management
  ADMIN_GET_NOVELS: '/admin/novels',
  ADMIN_GET_NOVEL: '/admin/novels/:novelId',
  ADMIN_CREATE_NOVEL: '/admin/novels',
  ADMIN_UPDATE_NOVEL: '/admin/novels/:novelId',
  ADMIN_DELETE_NOVEL: '/admin/novels/:novelId',

  // Admin - Chapter Management
  ADMIN_GET_CHAPTERS: '/admin/novels/:novelId/chapters',
  ADMIN_GET_CHAPTER: '/admin/chapters/:chapterId',
  ADMIN_CREATE_CHAPTER: '/admin/novels/:novelId/chapters',
  ADMIN_UPDATE_CHAPTER: '/admin/chapters/:chapterId',
  ADMIN_DELETE_CHAPTER: '/admin/chapters/:chapterId',

  // Admin - Notifications
  ADMIN_GET_NOTIFICATIONS: '/admin/notifications',
  ADMIN_MARK_NOTIFICATION_READ: '/admin/notifications/:notificationId/read',
  ADMIN_MARK_ALL_NOTIFICATIONS_READ: '/admin/notifications/read-all',
};

export default API_BASE_URL;
