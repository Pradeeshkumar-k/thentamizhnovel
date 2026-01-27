# Novel API Documentation

This document describes the API structure for the novel "**ராட்சசனே எனை வதைப்பதேனடா!**" by Thenmozhi.

## Base URL

```
http://localhost:5000/api
```

Or use the environment variable:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## Table of Contents

1. [Novel Endpoints](#novel-endpoints)
2. [Chapter Endpoints](#chapter-endpoints)
3. [User Interaction Endpoints](#user-interaction-endpoints)
4. [Reading Progress Endpoints](#reading-progress-endpoints)
5. [Usage Examples](#usage-examples)

---

## Novel Endpoints

### 1. Get All Novels

**Endpoint:** `GET /novels`

**Description:** Retrieve a list of all available novels.

**Response:**
```json
{
  "success": true,
  "data": {
    "novels": [
      {
        "id": "ratsasane-enai-vathaippathena",
        "title": "ராட்சசனே எனை வதைப்பதேனடா!",
        "author": "Thenmozhi",
        "coverImage": "/assets/images/Novel Card/Thenmozhi Card.jpg",
        "rating": 4.8,
        "chapters": 12
      }
    ],
    "total": 1
  }
}
```

---

### 2. Get Novel by ID

**Endpoint:** `GET /novels/:id`

**Description:** Retrieve detailed information about a specific novel.

**URL Parameters:**
- `id` (string): Novel ID (e.g., "ratsasane-enai-vathaippathena" or "1")

**Example Request:**
```
GET /novels/ratsasane-enai-vathaippathena
```

**Response:** See [mockData/ratsasaneNovel.js](./mockData/ratsasaneNovel.js) for full response structure.

```json
{
  "success": true,
  "data": {
    "novel": {
      "id": "ratsasane-enai-vathaippathena",
      "title": "ராட்சசனே எனை வதைப்பதேனடா!",
      "englishTitle": "Shadow of Night",
      "author": {
        "id": "thenmozhi",
        "name": "Thenmozhi"
      },
      "stats": {
        "views": 25600,
        "viewsFormatted": "25.6K",
        "bookmarks": 1900,
        "chapters": 12
      },
      "rating": {
        "average": 4.8,
        "total": 567
      },
      "description": {
        "tamil": "மதுரை தெருக்களில்...",
        "english": "A gripping thriller..."
      },
      "chapters": [...]
    }
  }
}
```

---

### 3. Get Specific Novel - ராட்சசனே எனை வதைப்பதேனடா!

**Endpoint:** `GET /novels/ratsasane-enai-vathaippathena`

**Description:** Dedicated endpoint for this specific novel with all details.

**Response:** Same as "Get Novel by ID" above.

---

### 4. Get Novel by Slug

**Endpoint:** `GET /novels/slug`

**Query Parameters:**
- `slug` (string): Novel slug

**Example Request:**
```
GET /novels/slug?slug=ratsasane-enai-vathaippathena
```

---

### 5. Search Novels

**Endpoint:** `GET /novels/search`

**Query Parameters:**
- `query` (string): Search term
- `genre` (string, optional): Filter by genre
- `author` (string, optional): Filter by author

**Example Request:**
```
GET /novels/search?query=thriller&author=Thenmozhi
```

---

### 6. Get Novels by Genre

**Endpoint:** `GET /novels/genre`

**Query Parameters:**
- `genre` (string): Genre name (e.g., "Thriller", "Mystery")

**Example Request:**
```
GET /novels/genre?genre=Thriller
```

---

### 7. Get Novels by Author

**Endpoint:** `GET /novels/author`

**Query Parameters:**
- `author` (string): Author name

**Example Request:**
```
GET /novels/author?author=Thenmozhi
```

---

## Chapter Endpoints

### 1. Get Novel Chapters

**Endpoint:** `GET /novels/:id/chapters`

**Description:** Retrieve all chapters for a specific novel.

**URL Parameters:**
- `id` (string): Novel ID

**Example Request:**
```
GET /novels/ratsasane-enai-vathaippathena/chapters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": 1,
        "chapterId": "chapter-1",
        "number": 1,
        "title": "அத்தியாயம் 1",
        "subtitle": "இருண்ட தொடக்கம்",
        "publishedDate": "2025-01-05T00:00:00Z",
        "words": 1500,
        "readTime": "10 mins",
        "isLocked": false
      }
    ],
    "total": 12
  }
}
```

---

### 2. Get Specific Chapter

**Endpoint:** `GET /novels/:novelId/chapters/:chapterId`

**Description:** Retrieve a specific chapter with full content.

**URL Parameters:**
- `novelId` (string): Novel ID
- `chapterId` (string): Chapter ID

**Example Request:**
```
GET /novels/ratsasane-enai-vathaippathena/chapters/chapter-1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chapter": {
      "id": 1,
      "chapterId": "chapter-1",
      "title": "அத்தியாயம் 1",
      "subtitle": "இருண்ட தொடக்கம்",
      "content": "மதுரை நகரத்தின்...",
      "publishedDate": "2025-01-05T00:00:00Z",
      "words": 1500,
      "nextChapter": {
        "id": 2,
        "title": "அத்தியாயம் 2"
      },
      "previousChapter": null
    }
  }
}
```

---

## User Interaction Endpoints

### 1. Bookmark Novel

**Endpoint:** `POST /novels/bookmark`

**Description:** Add a novel to user's bookmarks.

**Request Body:**
```json
{
  "novelId": "ratsasane-enai-vathaippathena"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Novel bookmarked successfully",
  "data": {
    "bookmarked": true
  }
}
```

**Authentication:** Required (Bearer Token)

---

### 2. Remove Bookmark

**Endpoint:** `DELETE /novels/bookmark`

**Description:** Remove a novel from user's bookmarks.

**Request Body:**
```json
{
  "novelId": "ratsasane-enai-vathaippathena"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bookmark removed successfully",
  "data": {
    "bookmarked": false
  }
}
```

**Authentication:** Required (Bearer Token)

---

### 3. Like Novel

**Endpoint:** `POST /novels/like`

**Description:** Like a novel.

**Request Body:**
```json
{
  "novelId": "ratsasane-enai-vathaippathena"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Novel liked successfully",
  "data": {
    "liked": true,
    "totalLikes": 3401
  }
}
```

**Authentication:** Required (Bearer Token)

---

## Reading Progress Endpoints

### 1. Get Reading Progress

**Endpoint:** `GET /reading/progress`

**Description:** Get user's reading progress for a novel.

**Query Parameters:**
- `novelId` (string): Novel ID

**Example Request:**
```
GET /reading/progress?novelId=ratsasane-enai-vathaippathena
```

**Response:**
```json
{
  "success": true,
  "data": {
    "novelId": "ratsasane-enai-vathaippathena",
    "currentChapter": 3,
    "currentChapterId": "chapter-3",
    "progress": 25,
    "lastReadAt": "2025-01-26T10:30:00Z"
  }
}
```

**Authentication:** Required (Bearer Token)

---

### 2. Update Reading Progress

**Endpoint:** `POST /reading/progress`

**Description:** Update user's reading progress.

**Request Body:**
```json
{
  "novelId": "ratsasane-enai-vathaippathena",
  "chapterId": "chapter-5",
  "progress": 42
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reading progress updated",
  "data": {
    "novelId": "ratsasane-enai-vathaippathena",
    "currentChapter": 5,
    "progress": 42
  }
}
```

**Authentication:** Required (Bearer Token)

---

### 3. Download Novel as PDF

**Endpoint:** `GET /novels/:id/download/pdf`

**Description:** Download the entire novel as a PDF file.

**URL Parameters:**
- `id` (string): Novel ID

**Example Request:**
```
GET /novels/ratsasane-enai-vathaippathena/download/pdf
```

**Response:** Binary PDF file

**Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="ratsasane-enai-vathaippathena.pdf"
```

**Authentication:** Required (Bearer Token)

---

## Usage Examples

### JavaScript/React Usage

```javascript
import novelService from './services/API/novelService';

// Get the specific novel
const getNovel = async () => {
  try {
    const response = await novelService.getRatsasaneEnaiVathaippathenaNovel();
    console.log(response.data.novel);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get novel by ID
const getNovelById = async (id) => {
  try {
    const response = await novelService.getNovelById(id);
    console.log(response.data.novel);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get chapters
const getChapters = async (novelId) => {
  try {
    const response = await novelService.getNovelChapters(novelId);
    console.log(response.data.chapters);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Bookmark novel
const bookmarkNovel = async (novelId) => {
  try {
    const response = await novelService.bookmarkNovel(novelId);
    console.log('Bookmarked:', response.data.bookmarked);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update reading progress
const updateProgress = async (novelId, chapterId, progress) => {
  try {
    const response = await novelService.updateReadingProgress(
      novelId,
      chapterId,
      progress
    );
    console.log('Progress updated:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Download PDF
const downloadPDF = async (novelId) => {
  try {
    const blob = await novelService.downloadNovelPDF(novelId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ratsasane-enai-vathaippathena.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Mock Data Usage

For development/testing without a backend, use the mock data:

```javascript
import { ratsasaneNovelData, sampleChapterContent } from './services/API/mockData/ratsasaneNovel';

// Use mock data
const novel = ratsasaneNovelData.data.novel;
const chapter = sampleChapterContent.data.chapter;

console.log(novel.title); // ராட்சசனே எனை வதைப்பதேனடா!
console.log(chapter.content); // Chapter content
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - 401: Authentication required
- `FORBIDDEN` - 403: Access denied
- `NOT_FOUND` - 404: Resource not found
- `VALIDATION_ERROR` - 400: Invalid request data
- `SERVER_ERROR` - 500: Internal server error

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is automatically added by the API client if stored in localStorage.

---

## Rate Limiting

API requests are rate-limited to:
- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

---

## Support

For API issues or questions, contact: support@theantamil.com
