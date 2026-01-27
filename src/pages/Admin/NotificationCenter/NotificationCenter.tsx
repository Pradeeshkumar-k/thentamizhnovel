import { useState, useEffect } from 'react';
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../services/API/adminService';
import styles from './NotificationCenter.module.scss';

/**
 * NotificationCenter Component
 * Display and manage admin notifications
 * INTEGRATION: Replace API calls with real endpoints
 */

interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notification Center</h1>
          <p className={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllButton} onClick={handleMarkAllAsRead}>
            Mark All as Read
          </button>
        )}
      </div>

      <div className={styles.notificationList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <h2>No Notifications</h2>
            <p>You're all caught up! No new notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
            >
              <div className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>

              <div className={styles.notificationContent}>
                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <p className={styles.notificationTime}>
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>

              {!notification.read && (
                <button
                  className={styles.markReadButton}
                  onClick={() => handleMarkAsRead(String(notification.id))}
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
