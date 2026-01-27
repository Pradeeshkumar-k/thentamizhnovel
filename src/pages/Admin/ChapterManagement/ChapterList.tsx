import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getChaptersByNovel, deleteChapter, getAllNovelsAdmin } from '../../../services/API/adminService';
import DataTable from '../../../components/admin/DataTable/DataTable';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import styles from './ChapterManagement.module.scss';

/**
 * ChapterList Component
 * Display and manage chapters for a selected novel
 * INTEGRATION: Replace API calls with real endpoints
 */

interface NovelData {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface ChapterData {
  id: string | number;
  chapter_number: number;
  name: string;
  title: string;
  chapter_type: string;
  status: string;
  [key: string]: any;
}

const ChapterList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const novelIdParam = searchParams.get('novelId');

  const [novels, setNovels] = useState<NovelData[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string>(novelIdParam || '');
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNovels();
  }, []);

  // Update selectedNovelId when URL parameter changes
  useEffect(() => {
    if (novelIdParam && novelIdParam !== selectedNovelId) {
      setSelectedNovelId(novelIdParam);
    }
  }, [novelIdParam]);

  useEffect(() => {
    if (selectedNovelId) {
      fetchChapters();
    } else {
      setChapters([]);
    }
  }, [selectedNovelId]);

  const fetchNovels = async () => {
    try {
      const response = await getAllNovelsAdmin();
      if (response.success) {
        setNovels(response.data.novels);
      }
    } catch (err) {
      console.error('Fetch novels error:', err);
    }
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChaptersByNovel(selectedNovelId);
      if (response.success) {
        setChapters(response.data.chapters);
      } else {
        setError('Failed to load chapters');
      }
    } catch (err) {
      console.error('Fetch chapters error:', err);
      setError('An error occurred while loading chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleNovelChange = (novelId: string) => {
    setSelectedNovelId(novelId);
    setSearchParams(novelId ? { novelId } : {});
  };

  const handleDelete = async (chapter: ChapterData) => {
    if (!window.confirm(`Delete chapter "${chapter.title}"?`)) return;
    try {
      const response = await deleteChapter(chapter.id);
      if (response.success) {
        fetchChapters();
        alert('Chapter deleted');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete chapter');
    }
  };

  const columns = [
    {
      key: 'chapter_number',
      label: '#',
      render: (value: any) => <span className={styles.chapterNum}>{value}</span>
    },
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    {
      key: 'chapter_type',
      label: 'Type',
      render: (value: any) => <span className={styles.typeBadge}>{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <span className={`${styles.statusBadge} ${styles[value?.toLowerCase()]}`}>{value}</span>
      )
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chapter Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage chapters for each novel</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
        <select
          value={selectedNovelId}
          onChange={(e) => handleNovelChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-gold focus:border-transparent outline-none transition-all cursor-pointer shadow-sm"
          aria-label="Select a novel"
        >
          <option value="">Select a novel...</option>
          {novels.map(novel => (
            <option key={novel.id} value={novel.id} className="text-gray-900 dark:text-white">{novel.title}</option>
          ))}
        </select>

        {selectedNovelId && (
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-neon-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
            onClick={() => navigate(`/admin/chapters/create?novelId=${selectedNovelId}`)}
          >
            <Plus size={20} /> Add Chapter
          </button>
        )}
      </div>

      {selectedNovelId ? (
        loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading chapters...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={chapters}
            emptyMessage="No chapters found. Add your first chapter!"
            actions={(chapter: any) => (
              <>
                <button
                  className={`${styles.actionButton} ${styles.edit}`}
                  onClick={() => navigate(`/admin/chapters/edit/${chapter.id}`)}
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className={`${styles.actionButton} ${styles.delete}`}
                  onClick={() => handleDelete(chapter)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          />
        )
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
             <BookOpen size={48} />
          </div>
          <p>Please select a novel to manage its chapters</p>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
