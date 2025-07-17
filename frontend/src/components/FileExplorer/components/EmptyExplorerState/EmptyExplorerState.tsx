import React from 'react';
import styles from './EmptyExplorerState.module.css';

interface EmptyExplorerStateProps {
    onSelectDirectory: () => void;
    message?: string;
}

export const EmptyExplorerState: React.FC<EmptyExplorerStateProps> = ({ onSelectDirectory, message = "Selecciona un directorio para comenzar"  }) => {
    return (
        <div className={styles.emptyStateContainer}>
            <i className={`fas fa-folder-open ${styles.emptyStateIcon}`}></i>
            <p className={styles.emptyStateText}>{message}</p>
            <button 
                className={styles.selectDirectoryButton}
                onClick={onSelectDirectory}
            >
                <i className="fas fa-folder-plus"></i> Seleccionar Directorio
            </button>
        </div>
    );
};