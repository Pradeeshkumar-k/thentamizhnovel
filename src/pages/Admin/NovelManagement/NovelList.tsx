import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNovelsAdmin, deleteNovel } from '../../../services/API/adminService';
import DataTable from '../../../components/admin/DataTable/DataTable';
import { Search, Plus, RefreshCw, BookOpen, Pencil, Trash2 } from 'lucide-react';
import styles from './NovelManagement.module.scss';

/**
 * NovelList Component
 *
 * Displays a table of all novels with:
 * - Search functionality
 * - Status filter
 * - Edit/Delete actions
 * - Create new novel button
 *
 * INTEGRATION POINTS:
 * - Replace getAllNovelsAdmin() with real API endpoint
 * - Replace deleteNovel() with real API endpoint
 * - Implement pagination when backend supports it
 */

interface NovelData {
  id: string | number;
  title: string;
  author_name: string;
  categories: string[];
  total_chapters: number;
  status: string;
  updated_at: string;
  [key: string]: any;
}

import { useAuth } from '../../../context/AuthContext';

const NovelList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchNovels();
  }, [searchQuery, statusFilter]);

  const fetchNovels = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with real API call
      const response = await getAllNovelsAdmin({
        search: searchQuery,
        status: statusFilter
      });

      if (response.success) {
        setNovels(response.data.novels);
      } else {
        setError('Failed to load novels');
      }
    } catch (err) {
      console.error('Fetch novels error:', err);
      setError('An error occurred while loading novels');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (novel: NovelData) => {
    navigate(`/admin/novels/edit/${novel.id}`);
  };

  const handleDelete = async (novel: NovelData) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete "${novel.title}"?`)) {
      return;
    }

    // Optimistic Update - Remove from UI immediately
    setNovels((prevNovels) => prevNovels.filter((n) => n.id !== novel.id));

    try {
      // Don't wait for completion to update UI
      await deleteNovel(novel.id);
      
      // Success - Silent, or toast if you want (UI already updated)
      console.log('Novel deleted successfully (Optimistic)');
    } catch (err) {
      console.error('Delete novel error:', err);
      // Revert optimization on error
      alert('An error occurred while deleting the novel');
      fetchNovels();
    }
  };

  const handleViewChapters = (novel: NovelData) => {
    navigate(`/admin/chapters?novelId=${novel.id}`);
  };

  // Table columns definition
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: any) => <span className={styles.novelTitle}>{value}</span>
    },
    {
      key: 'author_name',
      label: 'Author'
    },
    {
      key: 'categories',
      label: 'Categories',
      render: (value: any) => (
        <div className={styles.categories}>
          {value?.slice(0, 2).map((cat: any, index: any) => (
            <span key={index} className={styles.categoryBadge}>
              {cat}
            </span>
          ))}
          {value?.length > 2 && (
            <span className={styles.categoryBadge}>+{value.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: 'total_chapters',
      label: 'Chapters',
      render: (value: any) => <span className={styles.chapterCount}>{value || 0}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <span className={`${styles.statusBadge} ${styles[value?.toLowerCase()]}`}>
          {value}
        </span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading novels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className={styles.title}>Novel Management</h1>
            {user?.role === 'SUPER_ADMIN' && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs font-medium">
                    Global View
                </span>
            )}
          </div>
          <p className={styles.subtitle}>
            Manage all novels in the platform
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => navigate('/admin/novels/create')}
        >
          <Plus size={20} />
          <span>Create Novel</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <div className={styles.searchIcon}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search novels by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>

        <button
          className={styles.refreshButton}
          onClick={fetchNovels}
          title="Refresh"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchNovels} className={styles.retryLink}>
            Retry
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={novels}
        emptyMessage="No novels found. Create your first novel to get started!"
        actions={(novel: any) => (
          <>
            <button
              className={`${styles.actionButton} ${styles.view}`}
              onClick={() => handleViewChapters(novel)}
              title="View Chapters"
            >
              <BookOpen size={18} />
            </button>
            <button
              className={`${styles.actionButton} ${styles.edit}`}
              onClick={() => handleEdit(novel)}
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              className={`${styles.actionButton} ${styles.delete}`}
              onClick={() => handleDelete(novel)}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      />

      {/* Results count */}
      {novels.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.resultsCount}>
            Showing {novels.length} {novels.length === 1 ? 'novel' : 'novels'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NovelList;
