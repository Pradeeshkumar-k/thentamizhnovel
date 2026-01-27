/**
 * Central Novel Configuration
 * Single source of truth for all novel metadata
 */

export interface NovelConfig {
  id: number;
  name: string;
  title: string;
  titleEnglish: string;
  author: string;
  authorEnglish: string;
  defaultLanguage: 'tamil' | 'english';
  languages: ('tamil' | 'english')[];
  totalChapters: number;
  coverImage: string;
  chapterImage: string;
}

export const NOVEL_CONFIG: Record<number, NovelConfig> = {
  1: {
    id: 1,
    name: 'raatchasane-novel',
    title: 'ராட்சசனே எனை வதைப்பதேனடா!',
    titleEnglish: 'Oh Demon! Why Do You Torment Me!',
    author: 'தென்மொழி',
    authorEnglish: 'Thenmozhi',
    defaultLanguage: 'tamil',
    languages: ['tamil', 'english'],
    totalChapters: 14,
    coverImage: 'Novel Card/Thenmozhi Card.jpg',
    chapterImage: 'episodes_card/Thenmozhi_episodes.jpg'
  },
  3: {
    id: 3,
    name: 'mohanamozhi-novel',
    title: 'வந்ததுணையே! என் வாழ்க்கைத் துணையே!',
    titleEnglish: 'Welcome! My Life Partner!',
    author: 'மோகனா',
    authorEnglish: 'Mohanaamozhi',
    defaultLanguage: 'tamil',
    languages: ['tamil', 'english'],
    totalChapters: 27, // Corrected from 40 to match actual content
    coverImage: 'Novel Card/Mohana card.jpg',
    chapterImage: 'episodes_card/Mohanamozhi episodes.jpg'
  }
};

/**
 * Get novel configuration by ID
 * @param {number} novelId - The novel ID
 * @returns {Object|null} - Novel configuration or null if not found
 */
export const getNovelConfig = (novelId: number | string) => {
  return NOVEL_CONFIG[Number(novelId)] || null;
};

/**
 * Get total chapters for a novel
 * @param {number} novelId - The novel ID
 * @returns {number} - Total chapters (0 if novel not found)
 */
export const getTotalChapters = (novelId: number | string) => {
  const config = getNovelConfig(novelId);
  return config?.totalChapters || 0;
};

/**
 * Validate if a chapter exists for a novel
 * @param {number} novelId - The novel ID
 * @param {number} chapterId - The chapter ID
 * @returns {boolean} - True if chapter is valid
 */
export const isValidChapter = (novelId: number | string, chapterId: number | string) => {
  const config = getNovelConfig(novelId);
  if (!config) return false;

  const chapterNum = Number(chapterId);
  return chapterNum >= 1 && chapterNum <= config.totalChapters;
};

export default NOVEL_CONFIG;
