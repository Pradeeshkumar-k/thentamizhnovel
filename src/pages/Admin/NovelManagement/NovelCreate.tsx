import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNovel, AVAILABLE_CATEGORIES, NOVEL_STATUS, autoTranslate } from '../../../services/API/adminService';
import styles from './NovelManagement.module.scss';

/**
 * NovelCreate Component
 * Form for creating a new novel
 *
 * INTEGRATION: Replace createNovel() with real API call
 */

interface NovelFormData {
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

const NovelCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NovelFormData>({
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Compress image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG 0.7
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        // Check size
        console.log(`Original: ${file.size}, Compressed: ${compressedBase64.length * 0.75}`); // Approx size

        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, cover_image: compressedBase64 }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, cover_image: '' }));
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
      setLoading(true);
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

      const response = await createNovel(payload);

      // Relaxed success check: success flag OR valid ID returned
      if (response.success || response.id || response._id || response.data?.id) {
        alert('Novel created successfully!');
        navigate('/admin/novels');
      } else {
        alert('Failed to create novel: ' + (response.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Create novel error:', err);
      // Show specific error to help debugging (e.g. timeout, 413, 500)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      alert(`Error creating novel: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create New Novel</h1>
          <p className={styles.subtitle}>Add a new novel to the platform</p>
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
                    placeholder="Enter Tamil title"
                    className={`${styles.input} flex-1 ${errors.title ? styles.error : ''}`}
                />
                <button 
                  type="button"
                  disabled={translating.title}
                  className="px-3 bg-neon-gold/10 border border-neon-gold/50 text-neon-gold rounded-lg hover:bg-neon-gold/20 transition-all text-sm font-bold whitespace-nowrap disabled:opacity-50"
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
                placeholder="Enter English title"
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

            {/* Cover Image Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Cover Image</label>

              {!imagePreview ? (
                <div
                  className={`${styles.imageUploadCard} ${isDragging ? styles.dragging : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={styles.uploadIcon}>📁</div>
                  <p className={styles.uploadText}>
                    {isDragging ? 'Drop image here' : 'Drag and drop your image here'}
                  </p>
                  <p className={styles.uploadHint}>PNG, JPG, GIF up to 5MB</p>
                  <div className={styles.uploadDivider}>
                    <span>or</span>
                  </div>
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={() => document.getElementById('coverImageInput')?.click()}
                  >
                    📤 Choose File
                  </button>
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className={styles.imagePreviewCard}>
                  <img src={imagePreview} alt="Cover preview" className={styles.previewImage} />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeImageButton}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              <p className={styles.helpText}>Optional: Upload a cover image for the novel</p>
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Novel'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovelCreate;
