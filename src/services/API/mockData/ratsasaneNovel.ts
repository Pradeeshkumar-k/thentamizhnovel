/**
 * Mock Data for Novel: ராட்சசனே எனை வதைப்பதேனடா!
 * Author: Thenmozhi
 *
 * This file contains mock API response data for the specific novel
 * Use this for development and testing before backend is ready
 */

export const ratsasaneNovelData = {
  success: true,
  data: {
    novel: {
      id: 'ratsasane-enai-vathaippathena',
      slug: 'ratsasane-enai-vathaippathena',
      title: 'ராட்சசனே எனை வதைப்பதேனடா!',
      englishTitle: 'Shadow of Night',
      author: {
        id: 'thenmozhi',
        name: 'Thenmozhi',
        nameEnglish: 'Thenmozhi',
        avatar: '/assets/thenmozhi-avatar.png',
        bio: 'Thenmozhi is a renowned Tamil author specializing in thriller and mystery genres.',
        totalNovels: 15,
        totalReaders: '2.5M'
      },
      coverImage: '/assets/images/Novel Card/Thenmozhi Card.jpg',
      bannerImage: '/assets/images/Novel Card/Thenmozhi Card.jpg',

      // Novel Stats
      stats: {
        views: 25600,
        viewsFormatted: '25.6K',
        bookmarks: 1900,
        bookmarksFormatted: '1.9K',
        likes: 3400,
        likesFormatted: '3.4K',
        chapters: 14,
        totalWords: 18000,
        averageReadTime: '2 hours'
      },

      // Rating
      rating: {
        average: 4.8,
        total: 567,
        breakdown: {
          5: 450,
          4: 89,
          3: 20,
          2: 5,
          1: 3
        }
      },

      // Genres/Categories
      genres: [
        { id: 'thriller', name: 'த்ரில்லர்', nameEnglish: 'Thriller' },
        { id: 'mystery', name: 'மர்மம்', nameEnglish: 'Mystery' }
      ],

      // Tags
      tags: {
        tamil: ['குற்றம்', 'துப்பறிதல்', 'சஸ்பென்ஸ்', 'கொலை மர்மம்', 'மதுரை', 'இன்ஸ்பெக்டர் ரவி'],
        english: ['Crime', 'Detective', 'Suspense', 'Murder Mystery', 'Madurai', 'Inspector Ravi']
      },

      // Status
      status: 'completed', // completed, ongoing, hiatus
      statusLabel: 'முடிந்தது',
      statusLabelEnglish: 'Completed',

      // Dates
      publishedDate: '2024-05-01T00:00:00Z',
      lastUpdated: '2025-01-16T00:00:00Z',
      completedDate: '2025-01-16T00:00:00Z',

      // Description
      description: {
        tamil: `மதுரை நகரத்தின் இருண்ட தெருக்களில் தொடர்ச்சியாக நடக்கும் மர்ம கொலைகள். ஒவ்வொரு கொலையும் ஒரு பயங்கரமான செய்தியை விட்டுச் செல்கிறது. இந்த வழக்கை விசாரிக்க வரும் துப்பறியும் அதிகாரி ரவி, ஒவ்வொரு தடயத்தையும் பின்தொடர்ந்து செல்லும் போது, நகரத்தையே அச்சுறுத்தும் ஒரு பெரிய சதியின் மையத்திற்கு வந்து சேர்கிறார். கொலைகளுக்கு பின்னால் இருக்கும் உண்மை என்ன? ரவியால் இந்த சதியை தடுக்க முடியுமா? இந்த பதட்டமான பயணத்தில் உங்களை அழைத்துச் செல்லும் ஒரு அபாரமான த்ரில்லர்.`,
        english: `Mysterious murders occur continuously in the dark streets of Madurai city. Each murder leaves a terrifying message. Inspector Ravi, who comes to investigate this case, following every clue, arrives at the center of a major conspiracy that threatens the entire city. What is the truth behind the murders? Can Ravi stop this conspiracy? An amazing thriller that takes you on this tense journey.`
      },

      // Content Warnings
      contentWarnings: {
        tamil: ['வன்முறை', 'குற்ற காட்சிகள்', 'முதிர்ந்த கருப்பொருள்கள்'],
        english: ['Violence', 'Crime Scenes', 'Mature Themes']
      },

      // Chapters List
      chaptersCount: 14,
      chapters: [
        {
          id: 1,
          chapterId: 'chapter-1',
          number: 1,
          title: 'அத்தியாயம் 1',
          titleEnglish: 'Chapter 1',
          subtitle: 'இருண்ட தொடக்கம்',
          subtitleEnglish: 'Dark Beginning',
          publishedDate: '2025-01-05T00:00:00Z',
          publishedDateFormatted: '05/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 25600,
          isLocked: false,
          isPremium: false
        },
        {
          id: 2,
          chapterId: 'chapter-2',
          number: 2,
          title: 'அத்தியாயம் 2',
          titleEnglish: 'Chapter 2',
          subtitle: 'முதல் தடயம்',
          subtitleEnglish: 'First Clue',
          publishedDate: '2025-01-06T00:00:00Z',
          publishedDateFormatted: '06/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 24100,
          isLocked: false,
          isPremium: false
        },
        {
          id: 3,
          chapterId: 'chapter-3',
          number: 3,
          title: 'அத்தியாயம் 3',
          titleEnglish: 'Chapter 3',
          subtitle: 'சந்தேகத்தின் நிழல்',
          subtitleEnglish: 'Shadow of Doubt',
          publishedDate: '2025-01-07T00:00:00Z',
          publishedDateFormatted: '07/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 22800,
          isLocked: false,
          isPremium: false
        },
        {
          id: 4,
          chapterId: 'chapter-4',
          number: 4,
          title: 'அத்தியாயம் 4',
          titleEnglish: 'Chapter 4',
          subtitle: 'மர்மம் ஆழமாகிறது',
          subtitleEnglish: 'Mystery Deepens',
          publishedDate: '2025-01-08T00:00:00Z',
          publishedDateFormatted: '08/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 21500,
          isLocked: false,
          isPremium: false
        },
        {
          id: 5,
          chapterId: 'chapter-5',
          number: 5,
          title: 'அத்தியாயம் 5',
          titleEnglish: 'Chapter 5',
          subtitle: 'ஆபத்தான திருப்பம்',
          subtitleEnglish: 'Dangerous Turn',
          publishedDate: '2025-01-09T00:00:00Z',
          publishedDateFormatted: '09/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 20200,
          isLocked: false,
          isPremium: false
        },
        {
          id: 6,
          chapterId: 'chapter-6',
          number: 6,
          title: 'அத்தியாயம் 6',
          titleEnglish: 'Chapter 6',
          subtitle: 'உண்மை வெளிச்சத்திற்கு',
          subtitleEnglish: 'Truth Comes to Light',
          publishedDate: '2025-01-10T00:00:00Z',
          publishedDateFormatted: '10/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 19100,
          isLocked: false,
          isPremium: false
        },
        {
          id: 7,
          chapterId: 'chapter-7',
          number: 7,
          title: 'அத்தியாயம் 7',
          titleEnglish: 'Chapter 7',
          subtitle: 'சதியின் வலை',
          subtitleEnglish: 'Web of Conspiracy',
          publishedDate: '2025-01-11T00:00:00Z',
          publishedDateFormatted: '11/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 18300,
          isLocked: false,
          isPremium: false
        },
        {
          id: 8,
          chapterId: 'chapter-8',
          number: 8,
          title: 'அத்தியாயம் 8',
          titleEnglish: 'Chapter 8',
          subtitle: 'நம்பிக்கையின் இழப்பு',
          subtitleEnglish: 'Loss of Trust',
          publishedDate: '2025-01-12T00:00:00Z',
          publishedDateFormatted: '12/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 17600,
          isLocked: false,
          isPremium: false
        },
        {
          id: 9,
          chapterId: 'chapter-9',
          number: 9,
          title: 'அத்தியாயம் 9',
          titleEnglish: 'Chapter 9',
          subtitle: 'இறுதி முனைப்பு',
          subtitleEnglish: 'Final Push',
          publishedDate: '2025-01-13T00:00:00Z',
          publishedDateFormatted: '13/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 16900,
          isLocked: false,
          isPremium: false
        },
        {
          id: 10,
          chapterId: 'chapter-10',
          number: 10,
          title: 'அத்தியாயம் 10',
          titleEnglish: 'Chapter 10',
          subtitle: 'வெளிச்சத்தின் கதிர்',
          subtitleEnglish: 'Ray of Light',
          publishedDate: '2025-01-14T00:00:00Z',
          publishedDateFormatted: '14/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 16100,
          isLocked: false,
          isPremium: false
        },
        {
          id: 11,
          chapterId: 'chapter-11',
          number: 11,
          title: 'அத்தியாயம் 11',
          titleEnglish: 'Chapter 11',
          subtitle: 'இறுதி மோதல்',
          subtitleEnglish: 'Final Confrontation',
          publishedDate: '2025-01-15T00:00:00Z',
          publishedDateFormatted: '15/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 15500,
          isLocked: false,
          isPremium: false
        },
        {
          id: 12,
          chapterId: 'chapter-12',
          number: 12,
          title: 'அத்தியாயம் 12',
          titleEnglish: 'Chapter 12',
          subtitle: 'முடிவு மற்றும் தொடக்கம்',
          subtitleEnglish: 'End and Beginning',
          publishedDate: '2025-01-16T00:00:00Z',
          publishedDateFormatted: '16/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 15000,
          isLocked: false,
          isPremium: false
        },
        {
          id: 13,
          chapterId: 'chapter-13',
          number: 13,
          title: 'அத்தியாயம் 13',
          titleEnglish: 'Chapter 13',
          subtitle: 'புதிய வாழ்க்கை',
          subtitleEnglish: 'New Life',
          publishedDate: '2025-01-17T00:00:00Z',
          publishedDateFormatted: '17/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 14500,
          isLocked: false,
          isPremium: false
        },
        {
          id: 14,
          chapterId: 'chapter-14',
          number: 14,
          title: 'அத்தியாயம் 14',
          titleEnglish: 'Chapter 14',
          subtitle: 'நம்பிக்கையின் விதை',
          subtitleEnglish: 'Seed of Hope',
          publishedDate: '2025-01-18T00:00:00Z',
          publishedDateFormatted: '18/01/2025',
          words: 1500,
          readTime: '10 mins',
          views: 14000,
          isLocked: false,
          isPremium: false
        }
      ],

      // Related Novels
      relatedNovels: [
        {
          id: 'madhurayin-maranam',
          title: 'மதுரையின் மரணம்',
          author: 'Mohana',
          coverImage: '/assets/images/Novel Card/Mohana card.jpg',
          rating: 4.6
        },
        {
          id: 'iravu-vizhiigal',
          title: 'இரவு விழிகள்',
          author: 'Swetha',
          coverImage: '/assets/images/Novel Card/swetha card.jpg',
          rating: 4.7
        }
      ],

      // SEO/Meta
      meta: {
        keywords: ['Tamil thriller', 'Crime novel', 'Detective story', 'Madurai', 'Mystery'],
        ogImage: '/assets/images/Novel Card/Thenmozhi Card.jpg',
        ogDescription: 'A gripping thriller about a detective solving mysterious murders in Madurai.'
      }
    }
  },
  timestamp: new Date().toISOString()
};

// Sample chapter content (for Chapter 1)
export const sampleChapterContent = {
  success: true,
  data: {
    chapter: {
      id: 1,
      chapterId: 'chapter-1',
      novelId: 'ratsasane-enai-vathaippathena',
      number: 1,
      title: 'அத்தியாயம் 1',
      subtitle: 'இருண்ட தொடக்கம்',
      content: `
மதுரை நகரத்தின் பழைய பகுதியில், பாண்டியன் தெருவில் அமைந்திருந்த பழைய கட்டிடம். அந்த இருண்ட இரவில், அங்கே நடந்த சம்பவம் நகரம் முழுவதையும் அதிர்ச்சிக்குள்ளாக்கியது.

இன்ஸ்பெக்டர் ரவி, குற்ற நடவடிக்கை தளத்திற்கு வந்தபோது, அங்கே அவரை வரவேற்றது பயங்கரமான ஒரு காட்சி. சுவரில் இரத்தத்தால் எழுதப்பட்டிருந்த செய்தி அவரது முதுகெலும்பை சிலிர்க்க செய்தது.

"இது தொடக்கம் மட்டுமே..." - என்று எழுதியிருந்தது.

ரவியின் அனுபவம் சொன்னது - இது சாதாரண கொலை அல்ல. இது ஏதோ பெரிய விஷயத்தின் ஆரம்பம்.

அவர் தனது குழுவை அழைத்து, தடயங்களை சேகரிக்க ஆரம்பித்தார். ஆனால் அவருக்கு தெரியாது, இந்த வழக்கு அவரது வாழ்க்கையையே மாற்றிவிடும் என்று...

[அத்தியாயம் தொடரும்...]
      `.trim(),
      publishedDate: '2025-01-05T00:00:00Z',
      words: 1500,
      readTime: '10 mins',
      nextChapter: {
        id: 2,
        chapterId: 'chapter-2',
        title: 'அத்தியாயம் 2'
      },
      previousChapter: null
    }
  },
  timestamp: new Date().toISOString()
};

export default ratsasaneNovelData;
