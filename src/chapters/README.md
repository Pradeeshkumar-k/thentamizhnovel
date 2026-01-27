# Chapters Folder Structure

This folder contains individual chapter files for all novels, organized by novel and language.

## Folder Structure

```
src/chapters/
├── raatchasane-novel/              # Novel 1: ராட்சசனே எனை வதைப்பதேனடா!
│   └── tamil/
│       ├── chapter-1.js to chapter-27.js
│
└── thaalaattum-novel/              # Novel 2: தாலாட்டும் தாழம்பூவே
    ├── tamil/
    │   ├── chapter-1.js to chapter-27.js
    └── english/
        ├── chapter-1.js to chapter-27.js
```

## Novel Details

### Novel 1: ராட்சசனே எனை வதைப்பதேனடா! (Oh Demon! Why Do You Torment Me!)
- **Author:** Thenmozhi
- **Novel ID:** 1
- **Languages:** Tamil
- **Chapters:** 27 (titled as "தேன் 1", "தேன் 2", etc.)
- **Route:** `/novel/1`
- **Page Component:** [ThenmozhiNovelPage](../pages/ThenmozhiNovelPage/)

### Novel 2: தாலாட்டும் தாழம்பூவே (The Lullaby of the Temple Flower)
- **Author:** Swetha Swe
- **Novel ID:** 2
- **Languages:** Tamil, English
- **Chapters:** 27 (titled as "அத்தியாயம் 1", "அத்தியாயம் 2", etc.)
- **Route:** `/novel/2`
- **Page Component:** [SwethaNovelPage](../pages/SwethaNovelPage/)

## Chapter File Format

Each chapter file follows this standardized structure:

```javascript
// Chapter X - Novel Title
// Language version

export const CHAPTER = {
  id: number,              // Chapter number (1-27)
  title: string,           // Chapter title
  subtitle: string,        // Optional subtitle
  content: string,         // Full chapter content
  metadata: {
    language: string,      // "tamil" or "english"
    novelId: number        // 1 or 2
  }
};

export default CHAPTER;
```

## How Chapters Are Loaded

Chapters are loaded dynamically using the [chapterContentLoader.js](../utils/chapterContentLoader.js) utility:

```javascript
import { getChapterContent } from '../utils/chapterContentLoader';

// Load a chapter
const chapter = await getChapterContent(novelId, chapterId, language);
```

The loader:
1. Tries to load from the new individual chapter files first
2. Falls back to the old monolithic files if not found (for backward compatibility)
3. Supports Tamil and English languages
4. Enables code splitting for better performance

## Adding New Chapters

To add a new chapter:

1. Create a new chapter file in the appropriate folder
2. Follow the chapter file format shown above
3. Increment the chapter ID and update the title
4. Add your content to the `content` field

Example:
```bash
# Create chapter 28 for Novel 2 (Tamil)
# File: src/chapters/thaalaattum-novel/tamil/chapter-28.js
```

## Adding a New Novel

To add a new novel (e.g., Novel 3):

1. Create folder structure:
   ```bash
   mkdir -p src/chapters/novel-3-folder-name/tamil
   mkdir -p src/chapters/novel-3-folder-name/english  # if bilingual
   ```

2. Update [chapterContentLoader.js](../utils/chapterContentLoader.js):
   ```javascript
   const NOVEL_CONFIG = {
     // ... existing config ...
     3: {
       name: 'novel-3-folder-name',
       languages: ['tamil', 'english'],
       totalChapters: 27
     }
   };
   ```

3. Create chapter files following the format

4. Update [constants.js](../utils/constants.js) with novel metadata

## Benefits of This Structure

1. **Better Code Splitting:** Each chapter loads only when needed
2. **Easier Maintenance:** Individual files are easier to edit and manage
3. **Better Git History:** Changes to one chapter don't affect others
4. **Scalability:** Easy to add new novels and chapters
5. **Performance:** Smaller initial bundle size
6. **Language Support:** Clear separation of Tamil and English versions

## Scripts

Several utility scripts are available in the `/scripts` folder:

- `split-chapters.js` - Split monolithic chapter files into individual files
- `create-novel1-placeholders.js` - Create placeholder chapters for Novel 1
- `test-chapter-loading.js` - Test that chapters load correctly

## Old Files (Deprecated)

The following old files are kept for backward compatibility:
- `src/utils/chapterContent.js` - Old monolithic file (can be removed after testing)
- `src/utils/chapters/novel-2.js` - Old Novel 2 Tamil chapters
- `src/utils/chapters/english/novel-2.js` - Old Novel 2 English chapters
- `src/utils/chapters/Lullaby-of-Temple-Flower.js` - Duplicate file

These can be safely removed after confirming the new structure works correctly in production.

## Testing

Run the test script to verify chapter loading:

```bash
node scripts/test-chapter-loading.js
```

All tests should pass before deploying to production.
