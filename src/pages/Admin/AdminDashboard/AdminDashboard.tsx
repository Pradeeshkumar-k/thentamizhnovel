import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../../services/API/adminService';
import StatCard from '../../../components/admin/StatCard/StatCard';
import { Book, FileText, Users, Star, FilePen, PlusCircle, List, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './AdminDashboard.module.scss';
import { DashboardStats } from '../../../types';
import { motion } from 'framer-motion';

import { useAuth } from '../../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(false);
  // ... (rest of state)

  // ... (useEffects)

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.header}>
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="flex items-center gap-3">
                <h1 className={styles.title}>Dashboard Overview</h1>
                {user?.role === 'SUPER_ADMIN' && (
                    <span className="px-3 py-1 bg-neon-gold/20 text-neon-gold border border-neon-gold/50 rounded-full text-xs font-bold uppercase tracking-wider">
                        Super Admin
                    </span>
                )}
            </div>
            <p className={styles.subtitle}>Welcome back, {user?.name || 'Administrator'}.</p>
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
        <div className={styles.sectionHeader} onClick={() => setSectionExpanded(!sectionExpanded)}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <button className={styles.expandButton}>
                {sectionExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
        </div>

        {sectionExpanded && (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.activityList}
        >
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
              </div>
            ))
          ) : (
             <div className="p-12 text-center text-secondary font-medium opacity-50 italic">No recent activity detected.</div>
          )}
        </motion.div>
        )}
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
