
/**
 * Helper to get the localized title for a novel.
 * 
 * Rules:
 * 1. If language is Tamil: return title (Tamil) -> fallback to titleEn
 * 2. If language is English: return titleEn (English) -> fallback to title (Tamil)
 * 3. Never return empty string if possible.
 */
export const getLocalizedTitle = (novel: any, language: string): string => {
  if (!novel) return '';

  const titleTa = novel.title || novel.novelTitle || '';
  const titleEn = novel.titleEn || novel.novelTitleEn || '';

  if (language === 'english') {
    return titleEn || titleTa;
  }
  
  // Default is Tamil
  return titleTa || titleEn;
};
