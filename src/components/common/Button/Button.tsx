import React from 'react';
import { ButtonProps } from '../../../types';
import styles from './ReadNowButton.module.scss';

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.readNowButton} ${className}`}
      disabled={disabled}
    >
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
};

export default Button;
