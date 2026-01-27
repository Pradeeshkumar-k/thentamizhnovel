/**
 * Admin Mock Data Service
 *
 * This service provides mock/dummy data for the Admin Dashboard.
 *
 * INTEGRATION POINTS:
 * - Replace these functions with real API calls to your NestJS backend
 * - Use the existing API client from './client.js'
 * - Follow the pattern in './novelService.js' for consistency
 *
 * Example real implementation:
 * import apiClient from './client';
 * export const getDashboardStats = () => apiClient.get('/admin/dashboard/stats');
 */

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      totalNovels: 42,
      totalChapters: 1247,
      totalUsers: 8563,
      totalSubscriptions: 1205,
      recentActivity: [
        { id: 1, action: 'New novel published', timestamp: new Date().toISOString() },
        { id: 2, action: 'Chapter added to "Ponniyin Selvan"', timestamp: new Date().toISOString() },
      ]
    }
  };
};

// ============================================
// NOVEL MANAGEMENT - MOCK DATA
// ============================================

const MOCK_NOVELS = [
  {
    id: 1,
    title: 'பொன்னியின் செல்வன்',
    author_name: 'கல்கி கிருஷ்ணமூர்த்தி',
    categories: ['Historical', 'Romance', 'Adventure'],
    novel_summary: 'சோழ சாம்ராஜ்யத்தின் காலத்தில் நடக்கும் வரலாற்று நாவல்',
    status: 'Published',
    cover_image: '/covers/ponniyin-selvan.jpg',
    total_chapters: 45,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-03-20T14:22:00Z'
  },
  {
    id: 2,
    title: 'கடல் புறா',
    author_name: 'சாண்டில்யன்',
    categories: ['Adventure', 'Historical'],
    novel_summary: 'கடல் கொள்ளையர்களின் சாகசக் கதை',
    status: 'Published',
    cover_image: '/covers/kadal-pura.jpg',
    total_chapters: 32,
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-03-18T11:45:00Z'
  },
  {
    id: 3,
    title: 'வேனில் ஒரு இரவு',
    author_name: 'ஜெயகாந்தன்',
    categories: ['Contemporary', 'Drama'],
    novel_summary: 'நவீன தமிழ் இலக்கியத்தின் சிறந்த படைப்பு',
    status: 'Draft',
    cover_image: '/covers/venil-oru-iravu.jpg',
    total_chapters: 15,
    created_at: '2024-03-01T16:20:00Z',
    updated_at: '2024-03-22T10:30:00Z'
  }
];

interface NovelFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getAllNovelsAdmin = async (filters: NovelFilters = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with real API call
  // return apiClient.get('/admin/novels', { params: filters });

  let novels = [...MOCK_NOVELS];

  // Simple search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    novels = novels.filter(n =>
      n.title.toLowerCase().includes(searchLower) ||
      n.author_name.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status) {
    novels = novels.filter(n => n.status === filters.status);
  }

  return {
    success: true,
    data: {
      novels,
      total: novels.length,
      page: filters.page || 1,
      limit: filters.limit || 10
    }
  };
};

export const getNovelByIdAdmin = async (novelId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // TODO: Replace with real API call
  // return apiClient.get(`/admin/novels/${novelId}`);

  const novel = MOCK_NOVELS.find(n => n.id === parseInt(novelId.toString()));

  if (!novel) {
    return { success: false, error: 'Novel not found' };
  }

  return { success: true, data: novel };
};

export const createNovel = async (novelData: any): Promise<{ success: boolean; data: any; message: string; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // TODO: Replace with real API call
  // return apiClient.post('/admin/novels', novelData);

  const newNovel = {
    id: MOCK_NOVELS.length + 1,
    ...novelData,
    total_chapters: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_NOVELS.push(newNovel);

  return { success: true, data: newNovel, message: 'Novel created successfully' };
};

export const updateNovel = async (novelId: string | number, novelData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // TODO: Replace with real API call
  // return apiClient.put(`/admin/novels/${novelId}`, novelData);

  const index = MOCK_NOVELS.findIndex(n => n.id === parseInt(novelId.toString()));

  if (index === -1) {
    return { success: false, error: 'Novel not found' };
  }

  MOCK_NOVELS[index] = {
    ...MOCK_NOVELS[index],
    ...novelData,
    updated_at: new Date().toISOString()
  };

  return { success: true, data: MOCK_NOVELS[index], message: 'Novel updated successfully' };
};

export const deleteNovel = async (novelId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with real API call
  // return apiClient.delete(`/admin/novels/${novelId}`);

  const index = MOCK_NOVELS.findIndex(n => n.id === parseInt(novelId.toString()));

  if (index === -1) {
    return { success: false, error: 'Novel not found' };
  }

  MOCK_NOVELS.splice(index, 1);

  return { success: true, message: 'Novel deleted successfully' };
};

// ============================================
// CHAPTER MANAGEMENT - MOCK DATA
// ============================================

const MOCK_CHAPTERS = [
  {
    id: 1,
    novel_id: 1,
    chapter_number: 1,
    name: 'முதல் அத்தியாயம்',
    title: 'வெள்ளம்',
    chapter_type: 'Regular',
    thumbnail: '/thumbnails/chapter-1.jpg',
    content: '<p>இது முதல் அத்தியாயத்தின் உள்ளடக்கம்...</p>',
    status: 'Published',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    novel_id: 1,
    chapter_number: 2,
    name: 'இரண்டாம் அத்தியாயம்',
    title: 'சந்திப்பு',
    chapter_type: 'Regular',
    thumbnail: '/thumbnails/chapter-2.jpg',
    content: '<p>இது இரண்டாம் அத்தியாயத்தின் உள்ளடக்கம்...</p>',
    status: 'Published',
    created_at: '2024-01-22T11:30:00Z',
    updated_at: '2024-01-22T11:30:00Z'
  }
];

export const getChaptersByNovel = async (novelId: string | number, filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with real API call
  // return apiClient.get(`/admin/novels/${novelId}/chapters`, { params: filters });

  console.log('Fetching chapters for novel:', novelId);
  console.log('All chapters:', MOCK_CHAPTERS);

  let chapters = MOCK_CHAPTERS.filter(c => c.novel_id === parseInt(novelId.toString()));

  console.log('Filtered chapters:', chapters);

  // Sort by chapter_number
  chapters.sort((a, b) => a.chapter_number - b.chapter_number);

  return {
    success: true,
    data: {
      chapters,
      total: chapters.length
    }
  };
};

export const getChapterById = async (chapterId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // TODO: Replace with real API call
  // return apiClient.get(`/admin/chapters/${chapterId}`);

  const chapter = MOCK_CHAPTERS.find(c => c.id === parseInt(chapterId.toString()));

  if (!chapter) {
    return { success: false, error: 'Chapter not found' };
  }

  return { success: true, data: chapter };
};

export const createChapter = async (novelId: string | number, chapterData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // TODO: Replace with real API call
  // return apiClient.post(`/admin/novels/${novelId}/chapters`, chapterData);

  // Remove novel_id from chapterData to avoid conflicts
  const { novel_id: _, ...cleanChapterData } = chapterData;

  const newChapter = {
    id: MOCK_CHAPTERS.length + 1,
    ...cleanChapterData,
    novel_id: parseInt(novelId.toString()),
    chapter_number: parseInt(chapterData.chapter_number),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_CHAPTERS.push(newChapter);

  console.log('Chapter created:', newChapter);
  console.log('Total chapters:', MOCK_CHAPTERS.length);

  return { success: true, data: newChapter, message: 'Chapter created successfully' };
};

export const updateChapter = async (chapterId: string | number, chapterData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // TODO: Replace with real API call
  // return apiClient.put(`/admin/chapters/${chapterId}`, chapterData);

  const index = MOCK_CHAPTERS.findIndex(c => c.id === parseInt(chapterId.toString()));

  if (index === -1) {
    return { success: false, error: 'Chapter not found' };
  }

  MOCK_CHAPTERS[index] = {
    ...MOCK_CHAPTERS[index],
    ...chapterData,
    updated_at: new Date().toISOString()
  };

  return { success: true, data: MOCK_CHAPTERS[index], message: 'Chapter updated successfully' };
};

export const deleteChapter = async (chapterId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with real API call
  // return apiClient.delete(`/admin/chapters/${chapterId}`);

  const index = MOCK_CHAPTERS.findIndex(c => c.id === parseInt(chapterId.toString()));

  if (index === -1) {
    return { success: false, error: 'Chapter not found' };
  }

  MOCK_CHAPTERS.splice(index, 1);

  return { success: true, message: 'Chapter deleted successfully' };
};

// ============================================
// NOTIFICATIONS - MOCK DATA
// ============================================

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New user registration',
    message: '5 new users registered today',
    type: 'info',
    read: false,
    created_at: '2024-03-22T09:30:00Z'
  },
  {
    id: 2,
    title: 'Novel published',
    message: '"கடல் புறா" has been published successfully',
    type: 'success',
    read: false,
    created_at: '2024-03-22T08:15:00Z'
  },
  {
    id: 3,
    title: 'Server maintenance',
    message: 'Scheduled maintenance on Sunday 2 AM',
    type: 'warning',
    read: true,
    created_at: '2024-03-21T14:20:00Z'
  },
  {
    id: 4,
    title: 'Storage warning',
    message: 'Storage is 85% full. Please review.',
    type: 'error',
    read: false,
    created_at: '2024-03-21T10:00:00Z'
  }
];

export const getAllNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with real API call
  // return apiClient.get('/admin/notifications');

  return {
    success: true,
    data: {
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length
    }
  };
};

export const markNotificationAsRead = async (notificationId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // TODO: Replace with real API call
  // return apiClient.patch(`/admin/notifications/${notificationId}/read`);

  const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);

  if (notification) {
    notification.read = true;
  }

  return { success: true, message: 'Notification marked as read' };
};

export const markAllNotificationsAsRead = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // TODO: Replace with real API call
  // return apiClient.patch('/admin/notifications/read-all');

  MOCK_NOTIFICATIONS.forEach(n => n.read = true);

  return { success: true, message: 'All notifications marked as read' };
};

// ============================================
// AVAILABLE CATEGORIES
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
  'Archived'
];

export const CHAPTER_STATUS = [
  'Draft',
  'Published',
  'Scheduled'
];
