import React, { useContext, useState } from 'react';
import DirectoryItem from '../DirectoryItem/DirectoryItem';
import FileItem from '../FileItem/FileItem';
import styles from './DirectoryList.module.css';
import { FileSystemItem } from '../../types/explorerTypes';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

interface DirectoryListProps {
    items: Array<{
        name: string;
        path: string;
        isDirectory: boolean;
        type?: 'sql' | 'sqlg' | null;
    }>;
    isFavoriteList?: boolean;
    isOpenFilesList?: boolean;
}

const DirectoryList: React.FC<DirectoryListProps> = ({ items, isFavoriteList = false, isOpenFilesList = false }) => {
    const { navigateToDirectory, selectedFile, setCurrentFile, setSelectedFile, currentFile } = useFileExplorerContext();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (path: string) => {
        setExpandedItems(prev => ({
        ...prev,
        [path]: !prev[path]
        }));
    };

    const handleItemClick = (item: FileSystemItem) => {
        if (item.isDirectory) {
            navigateToDirectory(item.path);
        } else {
            setCurrentFile(item);
            // Aquí podrías también agregar a openFiles si no está ya
        }
    };

    return (
        <ul className={styles.directoryList}>
            {items.map(item => (
                <li key={item.path} className={styles.listItem}>
                    {item.isDirectory ? (
                        <DirectoryItem item={item} onClick={function (): void {
                            throw new Error('Function not implemented.');
                        } } isExpanded={false} onToggleExpand={function (): void {
                            throw new Error('Function not implemented.');
                        } } />
                    ) : (
                        <FileItem 
                            item={item} 
                            onClick={() => handleItemClick(item)}
                            isSelected={currentFile?.path === item.path}
                            isOpen={isOpenFilesList}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default DirectoryList;