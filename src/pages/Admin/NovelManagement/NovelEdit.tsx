import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNovelByIdAdmin, updateNovel, AVAILABLE_CATEGORIES, NOVEL_STATUS, autoTranslate } from '../../../services/API/adminService';
import styles from './NovelManagement.module.scss';

/**
 * NovelEdit Component
 * Form for editing an existing novel
 *
 * INTEGRATION: Replace getNovelByIdAdmin() and updateNovel() with real API calls
 */

interface NovelEditFormData {
  title: string;
  title_en: string; // New
  author_name: string;
  categories: string[];
  novel_summary: string;
  summary_en: string; // New
  status: string;
  cover_image: string;
}

interface FormErrors {
  title?: string;
  author_name?: string;
  categories?: string;
  novel_summary?: string;
  [key: string]: string | undefined;
}

const NovelEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<NovelEditFormData>({
    title: '',
    title_en: '',
    author_name: '',
    categories: [],
    novel_summary: '',
    summary_en: '',
    status: 'Draft',
    cover_image: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [translating, setTranslating] = useState<Record<string, boolean>>({});

  const handleTranslate = async (field: 'title' | 'summary') => {
    const textToTranslate = field === 'title' ? formData.title : formData.novel_summary;
    if (!textToTranslate) {
      alert(`Please enter a Tamil ${field} first.`);
      return;
    }

    try {
      setTranslating(prev => ({ ...prev, [field]: true }));
      const response = await autoTranslate(textToTranslate);
      if (response.success && response.data.translatedText) {
        setFormData(prev => ({
          ...prev,
          [field === 'title' ? 'title_en' : 'summary_en']: response.data.translatedText
        }));
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Translation failed: ${msg}`);
    } finally {
      setTranslating(prev => ({ ...prev, [field]: false }));
    }
  };

  useEffect(() => {
    fetchNovel();
  }, [id]);

  const fetchNovel = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API call
      if (!id) return;
      const response = await getNovelByIdAdmin(id);

      if (response.success && response.data) {
        const novel = response.data;
        setFormData({
          title: novel.title || '',
          title_en: novel.title_en || novel.titleEn || '',
          author_name: novel.author_name || '',
          categories: novel.categories || [],
          novel_summary: novel.novel_summary || '',
          summary_en: novel.summary_en || novel.descriptionEn || '',
          status: novel.status || 'Draft',
          cover_image: novel.cover_image || ''
        });
      } else {
        alert('Novel not found');
        navigate('/admin/novels');
      }
    } catch (err) {
      console.error('Fetch novel error:', err);
      alert('Error loading novel');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author_name.trim()) newErrors.author_name = 'Author name is required';
    if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
    if (!formData.novel_summary.trim()) newErrors.novel_summary = 'Summary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      // Payload mapping with robust image fields
      const payload = {
        title: formData.title,
        titleEn: formData.title_en,
        author: formData.author_name,
        description: formData.novel_summary,
        descriptionEn: formData.summary_en,
        categories: formData.categories,
        status: formData.status,
        coverImage: formData.cover_image,
        // Add variations for backend compatibility
        image: formData.cover_image,
        coverImageUrl: formData.cover_image
      };

      if (!id) return;
      const response = await updateNovel(id, payload);

      // Relaxed success check
      if (response.success || response.id || response._id || response.data?.id) {
        alert('Novel updated successfully!');
        navigate('/admin/novels');
      } else {
        alert('Failed to update novel: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Update novel error:', err);
      alert('An error occurred while updating the novel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading novel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Novel</h1>
          <p className={styles.subtitle}>Update novel information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            {/* Title */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Title (Tamil) <span className={styles.required}>*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter novel title in Tamil"
                  className={`${styles.input} flex-1 ${errors.title ? styles.error : ''}`}
                />
                <button 
                  type="button"
                  disabled={translating.title}
                  className="px-3 bg-neon-gold/10 border border-neon-gold/50 text-neon-gold rounded-lg hover:bg-neon-gold/20 transition-all text-sm font-bold disabled:opacity-50"
                  onClick={() => handleTranslate('title')}
                >
                  {translating.title ? '...' : '✨ Translate'}
                </button>
              </div>
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            {/* Title EN */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Title (English)</label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                placeholder="Enter novel title in English"
                className={styles.input}
              />
            </div>

            {/* Author */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Author Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`${styles.input} ${errors.author_name ? styles.error : ''}`}
              />
              {errors.author_name && <p className={styles.errorText}>{errors.author_name}</p>}
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
                aria-label="Select status"
              >
                {NOVEL_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Cover Image URL */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Cover Image URL</label>
              <input
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                className={styles.input}
              />
            </div>

            {/* Categories */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Categories <span className={styles.required}>*</span>
              </label>
              <div className={styles.categorySelector}>
                {AVAILABLE_CATEGORIES.map(category => (
                  <div
                    key={category}
                    className={`${styles.categoryOption} ${
                      formData.categories.includes(category) ? styles.selected : ''
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
              {errors.categories && <p className={styles.errorText}>{errors.categories}</p>}
              <p className={styles.helpText}>
                Selected: {formData.categories.length > 0 ? formData.categories.join(', ') : 'None'}
              </p>
            </div>

            {/* Summary */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className="flex justify-between items-center mb-1">
                <label className={styles.label}>
                  Novel Summary (Tamil) <span className={styles.required}>*</span>
                </label>
                <button 
                  type="button"
                  disabled={translating.summary}
                  className="px-3 py-1 bg-neon-gold/10 border border-neon-gold/50 text-neon-gold rounded-lg hover:bg-neon-gold/20 transition-all text-xs font-bold disabled:opacity-50"
                  onClick={() => handleTranslate('summary')}
                >
                  {translating.summary ? 'Translating...' : '✨ Auto-Translate Summary'}
                </button>
              </div>
              <textarea
                name="novel_summary"
                value={formData.novel_summary}
                onChange={handleChange}
                placeholder="Enter summary in Tamil"
                className={`${styles.textarea} ${errors.novel_summary ? styles.error : ''}`}
              />
              {errors.novel_summary && <p className={styles.errorText}>{errors.novel_summary}</p>}
            </div>

            {/* Summary EN */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Novel Summary (English)</label>
              <textarea
                name="summary_en"
                value={formData.summary_en}
                onChange={handleChange}
                placeholder="Enter summary in English"
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/admin/novels')}
              className={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovelEdit;
