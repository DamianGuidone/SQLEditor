import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFileCode, faStar as solidStar, faStarHalfAlt as regularStar, faSearch, faTimes, faHome, faDesktop, faDownload, faBookmark } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FileNode {
    name: string;
    path: string;
    isDirectory?: boolean;
    children?: FileNode[];
}

interface FileResponse {
    name: string;
    path: string;
    relative: string;
}

interface FileExplorerProps {
    onSelectFile: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectFile }) => {
    const [folderPath, setFolderPath] = useState('');
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useLocalStorage<string[]>('file-explorer-favorites', []);
    const [quickAccess] = useState([
        { name: 'Home', path: require('os').homedir(), icon: faHome },
        { name: 'Desktop', path: require('path').join(require('os').homedir(), 'Desktop'), icon: faDesktop },
        { name: 'Downloads', path: require('path').join(require('os').homedir(), 'Downloads'), icon: faDownload },
        { name: 'Projects', path: require('path').join(require('os').homedir(), 'Projects'), icon: faBookmark }
    ]);

    // Cargar favoritos al iniciar
    useEffect(() => {
        if (favorites.length > 0 && !folderPath) {
            setFolderPath(favorites[0]);
        }
    }, [favorites]);

    const isFolderExpanded = (path: string) => expandedFolders.has(path);

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        newExpanded.has(path) ? newExpanded.delete(path) : newExpanded.add(path);
        setExpandedFolders(newExpanded);
    };

    const toggleFavorite = (path: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => 
            prev.includes(path) 
                ? prev.filter(p => p !== path) 
                : [...prev, path]
        );
    };

    const loadFiles = async (path?: string) => {
        const targetPath = path || folderPath;
        if (!targetPath) return;

        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post<FileResponse[]>('/list_sql_files', { path: targetPath });
            const tree = buildFileTree(response.data);
            setFileTree(tree);
            if (!path) setFolderPath(targetPath);
        } catch (err) {
            setError('Error al cargar el directorio. Verifica la ruta.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const buildFileTree = (files: FileResponse[]): FileNode[] => {
        const root: FileNode = { name: 'root', path: '', children: [] };

        files.forEach(file => {
            const parts = file.relative.split(/[/\\]/);
            let current = root;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                let existing = current.children?.find(c => c.name === part);
                if (!existing) {
                    existing = { name: part, path: '', isDirectory: true, children: [] };
                    current.children = [...(current.children || []), existing];
                }
                current = existing;
            }

            current.children = [...(current.children || []), { 
                name: parts[parts.length - 1], 
                path: file.path 
            }];
        });

        return root.children || [];
    };

    const filteredTree = searchQuery 
        ? filterTree(fileTree, searchQuery.toLowerCase())
        : fileTree;

    function filterTree(nodes: FileNode[], query: string): FileNode[] {
        return nodes
        .map(node => ({ ...node }))
        .filter(node => {
            if (node.isDirectory && node.children) {
                node.children = filterTree(node.children, query);
                return node.children.length > 0 || node.name.toLowerCase().includes(query);
            }
            return node.name.toLowerCase().includes(query);
        });
    }

    const renderNode = (node: FileNode, depth = 0) => {
        const isExpanded = isFolderExpanded(node.path);
        const isFavorite = node.path ? favorites.includes(node.path) : false;

        return (
        <div key={node.path || node.name} className="file-node-container">
            <div
            className="file-node"
            style={{ paddingLeft: `${depth * 16}px` }}
            onClick={() => node.isDirectory ? toggleFolder(node.path) : onSelectFile(node.path)}
            >
            <span className="file-icon">
                {node.isDirectory ? (
                <FontAwesomeIcon icon={isExpanded ? faFolderOpen : faFolder} />
                ) : (
                <FontAwesomeIcon icon={faFileCode} />
                )}
            </span>
            
            <span className="file-name">{node.name}</span>
            
            {node.path && (
                <button 
                className="favorite-btn"
                onClick={(e) => toggleFavorite(node.path, e)}
                >
                <FontAwesomeIcon 
                    icon={isFavorite ? solidStar : regularStar} 
                    color={isFavorite ? '#ffc107' : '#9ca0a4'} 
                />
                </button>
            )}
            </div>

            {node.isDirectory && isExpanded && node.children && (
            <div className="file-children">
                {node.children.map(child => renderNode(child, depth + 1))}
            </div>
            )}
        </div>
        );
    };

    return (
        <div className="file-explorer-container">
        <div className="file-explorer-header">
            <h3>
            <FontAwesomeIcon icon={faFolderOpen} /> Explorador de Archivos
            </h3>
            
            <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                <FontAwesomeIcon icon={faTimes} />
                </button>
            )}
            </div>
        </div>

        <div className="quick-access">
            <h4>Acceso Rápido</h4>
            <div className="quick-access-list">
            {quickAccess.map(item => (
                <div 
                key={item.path} 
                className="quick-access-item"
                onClick={() => loadFiles(item.path)}
                >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.name}</span>
                </div>
            ))}
            </div>
        </div>

        {favorites.length > 0 && (
            <div className="favorites-section">
            <h4>Favoritos</h4>
            <div className="favorites-list">
                {favorites.map(path => (
                <div 
                    key={path} 
                    className="favorite-item"
                    onClick={() => loadFiles(path)}
                >
                    <FontAwesomeIcon icon={solidStar} color="#ffc107" />
                    <span>{path.split(/[/\\]/).pop() || path}</span>
                </div>
                ))}
            </div>
            </div>
        )}

        <div className="path-input-container">
            <input
            type="text"
            placeholder="Ruta del directorio..."
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadFiles()}
            />
            <button 
            onClick={() => loadFiles()}
            disabled={loading}
            className="load-button"
            >
            {loading ? 'Cargando...' : 'Abrir'}
            </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="file-tree-container">
            {filteredTree.length > 0 ? (
            filteredTree.map(node => renderNode(node))
            ) : (
            <div className="empty-state">
                {searchQuery 
                ? 'No se encontraron resultados'
                : 'No hay archivos para mostrar'}
            </div>
            )}
        </div>
        </div>
    );
};

export default FileExplorer;