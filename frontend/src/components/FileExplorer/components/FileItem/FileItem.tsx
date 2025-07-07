import React, { useContext, useState } from 'react';
import { FileSystemItem } from '../../types/explorerTypes';
import ContextMenu from '../ContextMenu/ContextMenu';
import styles from './FileItem.module.css';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

interface FileItemProps {
    item: FileSystemItem;
    onClick: () => void;
    isSelected: boolean;
    isOpen?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ item, onClick, isSelected = false, isOpen = false }) => {
    const { favorites, addFavorite, removeFavorite, performFileOperation } = useFileExplorerContext();
    const [isFavorite, setIsFavorite] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState<{x: number, y: number} | null>(null);
    const [newName, setNewName] = useState(item.name);
    const [isRenaming, setIsRenaming] = useState(false);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
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

    const handleFavorite = () => {
        if (isFavorite) {
        removeFavorite(item.path);
        } else {
        addFavorite(item);
        }
        setIsFavorite(!isFavorite);
    };

    // Verificar si el item está en favoritos
    const isFavorited = favorites.some(fav=> fav.path === item.path);

    function removeOpenFile(path: string) {
        throw new Error('Function not implemented.');
    }

    return (
        <div 
        className={`${styles.fileItem} ${isSelected ? styles.selected : ''} ${isOpen ? styles.openFile : ''}`}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        >
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
            <div className={styles.fileIcon}>
                {item.type === 'sql' ? (
                <i className="fas fa-file-code"></i>
                ) : item.type === 'sqlg' ? (
                <i className="fas fa-project-diagram"></i>
                ) : (
                <i className="fas fa-file"></i>
                )}
                {isFavorited && (
                <span className={styles.favoriteBadge}>
                    <i className="fas fa-star"></i>
                </span>
                )}
            </div>
            <span className={styles.fileName}>{item.name}</span>
            {isOpen && (
                <span className={styles.closeButton} onClick={(e) => {
                    e.stopPropagation();
                    removeOpenFile(item.path);
                }}>
                <i className="fas fa-times"></i>
                </span>
            )}
            {/* Botón de favoritos */}
            <button 
                className={styles.favoriteButton}
                onClick={(e) => {
                e.stopPropagation();
                isFavorited ? removeFavorite(item.path) : addFavorite(item);
                }}
                title={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                <i className={`fas fa-star${isFavorited ? '' : '-o'}`}></i>
            </button>

            {/* Botón de eliminar (solo visible en hover) */}
            <button 
                className={styles.removeButton}
                onClick={(e) => {
                e.stopPropagation();
                removeFavorite(item.path);
                }}
                title="Quitar de favoritos"
            >
                <i className="fas fa-times"></i>
            </button>
            </>
        )}
        
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

export default FileItem;