import { useNavigate } from 'react-router-dom';
import styles from './ForbiddenPage.module.scss';

/**
 * ForbiddenPage Component
 * Displayed when authenticated users try to access admin routes
 * without required permissions (ADMIN or EDITOR role)
 */

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>403</div>
        <h1 className={styles.title}>Access Forbidden</h1>
        <p className={styles.message}>
          You don't have permission to access this page.
          <br />
          Admin access is restricted to ADMIN and EDITOR roles only.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate('/novels')}
          >
            <span>🏠</span>
            <span>Go to Homepage</span>
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className={styles.helpText}>
          <p>If you believe this is an error, please contact your administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
