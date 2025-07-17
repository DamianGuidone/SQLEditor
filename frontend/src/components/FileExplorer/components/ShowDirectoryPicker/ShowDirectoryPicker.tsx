import React, { useState, useEffect } from 'react';
import apiClient from '../../../../services/api';
import styles from './ShowDirectoryPicker.module.css';

interface ShowDirectoryPickerProps {
    onDirectorySelect: (basePath: string, initialPath?: string) => void;
    onCancel?: () => void;
}

const ShowDirectoryPicker: React.FC<ShowDirectoryPickerProps> = ({ onDirectorySelect, onCancel }) => {
    const [availableDirectories, setAvailableDirectories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchDirectories = async () => {
        try {
            const response = await apiClient.get('/api/directories');
            setAvailableDirectories(response.data.data?.directories || []);
        } catch (err) {
            setError('Failed to load available directories');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchDirectories();
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const path = (e.dataTransfer.files[0] as any).path;
            const directoryPath = path.split('\\').slice(0, -1).join('\\');
            onDirectorySelect('custom', directoryPath);
        }
    };

    const handleFileDialog = async () => {
        try {
        // This would require Electron dialog in a desktop app
        // For web, we'll use a fallback to manual input
        const path = prompt('Enter the directory path:');
        if (path) {
            onDirectorySelect('custom', path);
        }
        } catch (err) {
        console.error('Error opening file dialog:', err);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading directories...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.pickerContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Select Working Directory</h2>
                {onCancel && (
                    <button 
                        className={styles.closeButton}
                        onClick={onCancel}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        <div className={styles.options}>
            <div 
            className={`${styles.dropArea} ${dragActive ? styles.active : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            >
            <i className={`fas fa-folder-open ${styles.dropIcon}`}></i>
            <p>Drag & Drop a folder here</p>
            <button 
                className={styles.browseButton}
                onClick={handleFileDialog}
            >
                Or browse your files
            </button>
            </div>

            <div className={styles.predefined}>
            <h3>Or select a predefined directory:</h3>
            <ul className={styles.directoryList}>
                {availableDirectories.map(dir => (
                <li key={dir} className={styles.directoryItem}>
                    <button 
                    onClick={() => onDirectorySelect(dir)}
                    className={styles.directoryButton}
                    >
                    <i className="fas fa-folder"></i> {dir}
                    </button>
                </li>
                ))}
            </ul>
            </div>
        </div>
        </div>
    );
};

export default ShowDirectoryPicker;