import { useState, useEffect } from 'react';
import { getDashboardStats, deleteActivityLog } from '../../../services/API/adminService';
import StatCard from '../../../components/admin/StatCard/StatCard';
import { Book, FileText, Users, Star, FilePen, PlusCircle, List, RefreshCw, MoreVertical, Eye, Trash2 } from 'lucide-react';
import styles from './AdminDashboard.module.scss';
import { DashboardStats } from '../../../types';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();

    // Close dropdown when clicking outside
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this activity log?")) return;

    try {
       await deleteActivityLog(id);
       // Optimistically update UI
       setStats(prev => prev ? ({
          ...prev,
          recentActivity: prev.recentActivity.filter(a => String(a.id) !== String(id))
       }) : null);
    } catch (err) {
       console.error("Failed to delete activity:", err);
       alert("Failed to delete activity log");
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Failed to Load Dashboard</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={fetchDashboardStats}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.header}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back, administrator.</p>
        </motion.div>
        
        <button 
          className={styles.refreshButton}
          onClick={fetchDashboardStats}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Grid */}
      <motion.div 
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          title="Total Novels"
          value={stats?.totalNovels || 0}
          icon={<Book size={24} />}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Chapters"
          value={stats?.totalChapters || 0}
          icon={<FileText size={24} />}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users size={24} />}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Subscriptions"
          value={stats?.totalSubscriptions || 0}
          icon={<Star size={24} />}
          color="orange"
          loading={loading}
        />
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        className={styles.activitySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          {loading ? (
             <div className="divide-y divide-white/5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-5 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-white/5"></div>
                        <div className="flex-1 space-y-2">
                             <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                             <div className="h-3 w-1/4 bg-white/5 rounded"></div>
                        </div>
                    </div>
                ))}
             </div>
          ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                    <FilePen size={20} className="text-neon-blue" />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <p className={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                {/* Action Dropdown */}
                <div className={styles.actionDropdownContainer} onClick={(e) => e.stopPropagation()}>
                    <button 
                        className={styles.dropdownTrigger}
                        onClick={() => setActiveDropdownId(activeDropdownId === String(activity.id) ? null : String(activity.id))}
                    >
                        <MoreVertical size={18} />
                    </button>
                    
                    {activeDropdownId === String(activity.id) && (
                        <div className={styles.dropdownMenu}>
                            <button 
                                className={styles.dropdownItem}
                                onClick={() => {
                                    alert(`View details for: ${activity.action}`);
                                    setActiveDropdownId(null);
                                }}
                            >
                                <Eye size={14} />
                                <span>View Details</span>
                            </button>
                            <button 
                                className={`${styles.dropdownItem} ${styles.delete}`}
                                onClick={() => handleDeleteActivity(String(activity.id))}
                            >
                                <Trash2 size={14} />
                                <span>Delete Log</span>
                            </button>
                        </div>
                    )}
                </div>
              </div>
            ))
          ) : (
             <div className="p-12 text-center text-secondary font-medium opacity-50 italic">No recent activity detected.</div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className={styles.quickActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/novels/create" className={styles.actionCard}>
            <PlusCircle size={32} className="text-neon-blue" />
            <span className={styles.actionLabel}>Create Novel</span>
          </a>
          <a href="/admin/chapters" className={styles.actionCard}>
            <List size={32} className="text-neon-blue" />
            <span className={styles.actionLabel}>Manage Chapters</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
