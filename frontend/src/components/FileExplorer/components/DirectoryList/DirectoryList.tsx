import React, { useContext } from 'react';
import DirectoryItem from '../DirectoryItem/DirectoryItem';
import FileItem from '../FileItem/FileItem';
import styles from './DirectoryList.module.css';
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

const DirectoryList: React.FC<DirectoryListProps> = ({ 
    items, 
    isFavoriteList = false, 
    isOpenFilesList = false 
}) => {
    const { currentFile } = useFileExplorerContext();

    return (
        <ul className={styles.directoryList}>
            {items.map(item => (
                <li key={item.path} className={styles.listItem}>
                    {item.isDirectory ? (
                        <DirectoryItem 
                            item={item}
                            isExpanded={false}
                            onToggleExpand={() => {}}
                            isFavorite={isFavoriteList}
                        />
                    ) : (
                        <FileItem 
                                item={item}
                                isSelected={currentFile?.path === item.path}
                                isOpen={isOpenFilesList} onClick={function (): void {
                                    throw new Error('Function not implemented.');
                                } }                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default DirectoryList;