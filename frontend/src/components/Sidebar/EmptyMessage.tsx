import React from 'react';
import styles from './EmptyMessage.module.css';

interface EmptyMessageProps {
    children: React.ReactNode;
    icon?: string;
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({ children, icon = 'info-circle' }) => {
    return (
        <div className={styles.emptyMessage}>
            <i className={`fas fa-${icon} ${styles.icon}`}></i>
            <span className={styles.text}>{children}</span>
        </div>
    );
};

export default EmptyMessage;