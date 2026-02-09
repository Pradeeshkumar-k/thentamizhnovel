// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  avatar?: string;
  profile?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username?: string;
  password: string;
  email?: string;
}

export interface SignupData {
  username?: string;
  email: string;
  password: string;
  name?: string;
  profile?: string;
}

export interface AuthCredentials {
  username?: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Novel Types
export interface Novel {
  _id?: string;
  id: string;
  title: string | { [key: string]: string };
  titleEn?: string; 
  title_en?: string; // Snake case support
  titleEnglish?: string; // Mock data support
  description: string | { [key: string]: string };
  descriptionEn?: string; 
  description_en?: string; // Snake case support
  descriptionEnglish?: string; // Mock data support
  summary_en?: string; // Frontend alias
  novel_summary?: string; // Frontend alias
  author: string;
  authorName?: string;
  authorEnglish?: string;
  coverImage: string;
  coverImageUrl?: string; // Backend field match
  language: 'tamil' | 'english';
  category?: string;
  genre?: string;
  tags?: string[];
  totalChapters: number;
  status?: 'ongoing' | 'completed';
  stats?: {
    views: number;
    likes: number;
    bookmarks: number;
  };
  isLiked?: boolean; // Added for API state sync
  isBookmarked?: boolean; // Added for API state sync
  createdAt?: string;
  updatedAt?: string;
}

// Chapter Types
export interface Chapter {
  _id?: string;
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string | { [key: string]: string };
  titleEn?: string; 
  title_en?: string; // Snake case support
  titleEnglish?: string; // Support
  content: string;
  contentEn?: string; 
  content_en?: string; // Snake case support
  language: 'tamil' | 'english';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  isLiked?: boolean; // Sync
  likedByMe?: boolean; // Sync
  _count?: {
    likes: number;
    comments: number;
  };
  isTranslating?: boolean;
}

// Reading Progress Types
export interface ReadingProgress {
  novelId: string;
  chapterId: string;
  progress: number;
  lastRead: string;
}

export interface OngoingNovel {
  novelId: string;
  novelTitle: string;
  novelTitleEn?: string;
  coverImage: string;
  author: string;
  lastChapter: number;
  startedAt: string;
  updatedAt?: string;
}

export interface CompletedNovel {
  novelId: string;
  novelTitle: string;
  novelTitleEn?: string;
  coverImage: string;
  author: string;
  completedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse>;
  signup: (userData: SignupData) => Promise<ApiResponse>;
  authenticate: (credentials: AuthCredentials) => Promise<ApiResponse & { action?: 'login' | 'signup' }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export interface ReadingProgressContextType {
  ongoingNovels: OngoingNovel[];
  completedNovels: CompletedNovel[];
  bookmarks: Novel[]; // Added for Library Caching
  isLoading: boolean; // Added for Library Loading State
  startReading: (novelId: string, novelTitle: string, coverImage: string, author: string, novelTitleEn?: string) => Promise<void>;
  updateProgress: (novelId: string, chapterId: number) => Promise<void>;
  completeNovel: (novelId: string, novelTitle: string, coverImage: string, author: string, novelTitleEn?: string) => Promise<void>;
  refreshLibrary: () => Promise<void>; // Added for manual refresh
  isOngoing: (novelId: string) => boolean;
  isCompleted: (novelId: string) => boolean;
  getLastChapter: (novelId: string) => number;
}

export interface LanguageContextType {
  language: 'tamil' | 'english';
  setLanguage: (lang: 'tamil' | 'english') => void;
}

export type Language = 'tamil' | 'english';

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Component Prop Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

// Admin Types
export interface DashboardStats {
  totalNovels: number;
  totalChapters: number;
  totalUsers: number;
  totalSubscriptions: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  action: string;
  timestamp: string;
}

// Comment Types
export interface Comment {
  id: string;
  userName: string;
  comment: string;
  postedAt: string;
  replies?: Comment[];
}

// DataTable Context (Cleaned up duplicates)
export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface DataTableAction<T = any> {
  label: string;
  onClick: (item: T) => void;
  variant?: string;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  actions?: DataTableAction<T>[] | ((item: T) => React.ReactNode);
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode | string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}