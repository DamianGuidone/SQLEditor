import React, { useContext, useState } from 'react';
import { FileSystemItem } from '../../types/explorerTypes';
import ContextMenu from '../ContextMenu/ContextMenu';
import styles from './DirectoryItem.module.css';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

interface DirectoryItemProps {
    item: FileSystemItem;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isFavorite?: boolean;
}

const DirectoryItem: React.FC<DirectoryItemProps> = ({ 
    item,  
    isExpanded, 
    onToggleExpand,
    isFavorite = false
}) => {
    const { navigateToDirectory, addFavorite, removeFavorite, performFileOperation } = useFileExplorerContext();    
    const [contextMenuPos, setContextMenuPos] = useState<{x: number, y: number} | null>(null);
    const [newName, setNewName] = useState(item.name);
    const [isRenaming, setIsRenaming] = useState(false);

    const handleClick = () => {
        navigateToDirectory(item.path);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleRename = async () => {
        if (newName !== item.name) {
        const success = await performFileOperation({
            operation: 'rename',
            path: item.path,
            newName
        });
        if (success) {
            setIsRenaming(false);
        }
        } else {
        setIsRenaming(false);
        }
    };

    const handleDelete = async () => {
        await performFileOperation({
        operation: 'delete',
        path: item.path
        });
    };

    const handleCreateFile = async () => {
        const fileName = prompt('Enter new file name (include .sql or .sqlg extension):');
        if (fileName) {
        await performFileOperation({
            operation: 'create_file',
            path: `${item.path}/${fileName}`
        });
        }
    };

    const handleCreateDirectory = async () => {
        const dirName = prompt('Enter new directory name:');
        if (dirName) {
        await performFileOperation({
            operation: 'create_dir',
            path: `${item.path}/${dirName}`
        });
        }
    };

    const handleFavorite = () => {
        if (isFavorite) {
        removeFavorite(item.path);
        } else {
        addFavorite(item);
        }
    };

    return (
        <div 
            className={styles.directoryItem}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
        >
        <div className={styles.directoryHeader}>
            <button 
            className={styles.expandButton}
            onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
            }}
            >
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
            </button>
            
            {isRenaming ? (
            <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                className={styles.renameInput}
            />
            ) : (
            <>
                <div className={styles.directoryIcon}>
                <i className="fas fa-folder"></i>
                </div>
                <span className={styles.directoryName}>{item.name}</span>
                {!isFavorite && (
                <button 
                    className={styles.favoriteButton}
                    onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite();
                    }}
                    title="Add to favorites"
                >
                    <i className="fas fa-star-o"></i>
                </button>
                )}
            </>
            )}
        </div>

        {contextMenuPos && (
            <ContextMenu
            x={contextMenuPos.x}
            y={contextMenuPos.y}
            onClose={() => setContextMenuPos(null)}
            items={[
                {
                label: 'Rename',
                icon: 'fas fa-pen',
                action: () => {
                    setIsRenaming(true);
                    setContextMenuPos(null);
                }
                },
                {
                label: 'Delete',
                icon: 'fas fa-trash',
                action: handleDelete
                },
                {
                label: 'New File',
                icon: 'fas fa-file',
                action: handleCreateFile
                },
                {
                label: 'New Folder',
                icon: 'fas fa-folder-plus',
                action: handleCreateDirectory
                },
                {
                label: isFavorite ? 'Remove Favorite' : 'Add Favorite',
                icon: isFavorite ? 'fas fa-star' : 'fas fa-star-o',
                action: handleFavorite
                }
            ]}
            />
        )}
        </div>
    );
};

export default DirectoryItem;