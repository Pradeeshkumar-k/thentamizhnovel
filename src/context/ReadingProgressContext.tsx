import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import readingProgressService from '../services/API/readingProgressService';
import novelService from '../services/API/novelService';
import { ReadingProgressContextType, OngoingNovel, CompletedNovel, Novel } from '../types';

const ReadingProgressContext = createContext<ReadingProgressContextType | null>(null);

export const useReadingProgress = () => {
  const context = useContext(ReadingProgressContext);
  if (!context) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
};

interface ReadingProgressProviderProps {
  children: ReactNode;
}

export const ReadingProgressProvider = ({ children }: ReadingProgressProviderProps) => {
  const [ongoingNovels, setOngoingNovels] = useState<OngoingNovel[]>([]);
  const [completedNovels, setCompletedNovels] = useState<CompletedNovel[]>([]);
  const [bookmarks, setBookmarks] = useState<Novel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in
  const isUserLoggedIn = () => {
    return !!localStorage.getItem('authToken');
  };

  // Load basic state from localStorage ONLY on init
  useEffect(() => {
    const savedOngoing = localStorage.getItem('ongoingNovels');
    const savedCompleted = localStorage.getItem('completedNovels');
    const savedBookmarks = localStorage.getItem('libraryBookmarks');

    if (savedOngoing) setOngoingNovels(JSON.parse(savedOngoing));
    if (savedCompleted) setCompletedNovels(JSON.parse(savedCompleted));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    
    setLoading(false);
  }, []);

  // Sync Library with backend ON DEMAND or when login status changes
  useEffect(() => {
    if (isUserLoggedIn() && !loading) {
       // We don't fetch on mount anymore to save 20s load time. 
       // Only fetch if explicitly requested by pages (Rule #4)
    }
  }, [loading]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('ongoingNovels', JSON.stringify(ongoingNovels));
    }
  }, [ongoingNovels, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('completedNovels', JSON.stringify(completedNovels));
    }
  }, [completedNovels, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('libraryBookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, loading]);

  // Start reading a novel
  const startReading = async (novelId: string, novelTitle: string, coverImage: string, author: string, novelTitleEn?: string) => {
    // Don't add if already completed
    if (completedNovels.some(novel => novel.novelId === novelId)) {
      return;
    }

    // Check if already in ongoing
    const existingIndex = ongoingNovels.findIndex(novel => novel.novelId === novelId);

    if (existingIndex === -1) {
      const newNovel = {
        novelId,
        novelTitle,
        novelTitleEn, // Store English title
        coverImage,
        author,
        lastChapter: 1,
        startedAt: new Date().toISOString()
      };

      // Update local state
      setOngoingNovels(prev => [...prev, newNovel]);

      // Sync with backend if user is logged in
      if (isUserLoggedIn()) {
        try {
          await readingProgressService.startReading(novelId, novelTitle, coverImage, author);
        } catch (_error) {
          // Silent fail - local state already updated
        }
      }
    } else {
       // If exists but English title is missing, update it
       if (novelTitleEn && !ongoingNovels[existingIndex].novelTitleEn) {
          setOngoingNovels(prev => prev.map((n, i) => i === existingIndex ? { ...n, novelTitleEn } : n));
       }
    }
  };

  // Update current chapter
  const updateProgress = async (novelId: string, chapterId: number | string, progress: number = 0, chapterOrder?: number) => {
    // Determine lastChapter (order) for progress bar
    const lastOrder = chapterOrder || (typeof chapterId === 'number' ? chapterId : 1);
    
    // Update local state
    setOngoingNovels(prev =>
      prev.map(novel =>
        novel.novelId === novelId
          ? { 
              ...novel, 
              lastChapter: lastOrder, // Legacy/Display Order
              lastChapterId: String(chapterId), // Navigation UUID
              lastChapterOrder: lastOrder, // Explicit Order
              updatedAt: new Date().toISOString() 
            }
          : novel
      )
    );

    // Sync with backend if user is logged in
    if (isUserLoggedIn() && novelId && chapterId) {
      try {
        // If chapterId is a number (legacy), we can't easily convert to UUID here without a map.
        // Assuming implementation has moved to UUIDs for chapterId.
        await readingProgressService.updateChapter(novelId, String(chapterId), progress);
      } catch (error) {
        // Silent fail - local state already updated
      }
    }
  };

  // Mark novel as completed
  const completeNovel = async (novelId: string, novelTitle: string, coverImage: string, author: string, novelTitleEn?: string) => {
    // Remove from ongoing
    setOngoingNovels(prev => prev.filter(novel => novel.novelId !== novelId));

    // Add to completed if not already there
    if (!completedNovels.some(novel => novel.novelId === novelId)) {
      const completedNovel = {
        novelId,
        novelTitle,
        novelTitleEn,
        coverImage,
        author,
        completedAt: new Date().toISOString()
      };

      setCompletedNovels(prev => [...prev, completedNovel]);

      // Sync with backend if user is logged in
      if (isUserLoggedIn()) {
        try {
          await readingProgressService.completeNovel(novelId, novelTitle, coverImage, author);
        } catch (error) {
          // Silent fail - local state already updated
        }
      }
    }
  };

  // Manual refresh for library
  const refreshLibrary = async () => {
    if (!isUserLoggedIn()) return;
    try {
        console.log('Refreshing library...');
        const response = await novelService.getLibrary();
        console.log('Library refresh response:', response);
        if (response.success && response.data) {
            setBookmarks(response.data);
            console.log('Bookmarks updated:', response.data.length);
        }
    } catch (error) {
        console.error("Failed to refresh library", error);
    }
  };

  // Check if a novel is ongoing
  const isOngoing = (novelId: string): boolean => {
    return ongoingNovels.some(novel => novel.novelId === novelId);
  };

  // Check if a novel is completed
  const isCompleted = (novelId: string): boolean => {
    return completedNovels.some(novel => novel.novelId === novelId);
  };

  // Get last chapter for a novel
  const getLastChapter = (novelId: string): number => {
    const novel = ongoingNovels.find(novel => novel.novelId === novelId);
    return novel ? novel.lastChapter : 1;
  };

  const value = {
    ongoingNovels,
    completedNovels,
    bookmarks,
    isLoading: loading, // Expose loading state
    startReading,
    updateProgress,
    completeNovel,
    refreshLibrary,
    isOngoing,
    isCompleted,
    getLastChapter
  };

  return (
    <ReadingProgressContext.Provider value={value}>
      {children}
    </ReadingProgressContext.Provider>
  );
};
