import React, { useContext, useState } from 'react';
import { FileSystemItem } from '../../types/explorerTypes';
import styles from './DirectoryTree.module.css';
import FileItem from '../FileItem/FileItem';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

interface DirectoryTreeProps {
    item: FileSystemItem;
    level?: number;
}

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ item, level = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<FileSystemItem[]>([]);
    const { navigateToDirectory, fetchDirectoryContents } = useFileExplorerContext();

    const handleToggle = async () => {
        if (!expanded) {
            const contents = await fetchDirectoryContents(item.path);
            setChildren(contents);
        }
        setExpanded(!expanded);
    };

    return (
        <div className={styles.treeItem} style={{ paddingLeft: `${level * 12}px` }}>
            <div className={styles.treeHeader} onClick={handleToggle}>
                <i className={`fas fa-folder${expanded ? '-open' : ''}`}></i>
                <span className={styles.treeName}>{item.name}</span>
                <i className={`fas fa-chevron-${expanded ? 'down' : 'right'} ${styles.caret}`}></i>
            </div>
            
            {expanded && (
                <div className={styles.treeChildren}>
                    {children.map(child => (
                        child.isDirectory ? (
                            <DirectoryTree key={child.path} item={child} level={level + 1} />
                        ) : (
                            <FileItem key={child.path} item={child} onClick={function (): void {
                                    throw new Error('Function not implemented.');
                                } } isSelected={false} />
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default DirectoryTree;