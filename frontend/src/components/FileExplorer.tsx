import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFileCode, faStar as solidStar, faStar as regularStar, faSearch, faTimes, faHome, faDesktop, faDownload, faBookmark, faSyncAlt, faArrowUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../services/api';

interface FileNode {
    name: string;
    path: string;
    isDirectory?: boolean;
    children?: FileNode[];
}

interface ApiFile {
    name: string;
    path: string;
    relative: string;
}

interface ApiResponse {
    files: ApiFile[]; 
    current_path: string;
}

interface ApiFileContent {
    content: string;
}

interface FileExplorerProps {
    onSelectFile: (filePath: string, content: string) => void;
    currentFilePath?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectFile, currentFilePath }) => {
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [currentDirContents, setCurrentDirContents] = useState<FileNode[]>([]);

    // Directorios rápidos (podrías obtenerlos del backend)
    const quickAccess = [
        { name: 'Home', path: '~', icon: faHome },
        { name: 'Desktop', path: '~/Desktop', icon: faDesktop },
        { name: 'Downloads', path: '~/Downloads', icon: faDownload },
        { name: 'Projects', path: '~/Projects', icon: faBookmark }
    ];

    const [currentPath, setCurrentPath] = useState<string>(() => {
        // 1. Intenta cargar de localStorage
        const savedPath = localStorage.getItem('lastExplorerPath');
        
        // 2. Si no hay en localStorage, usa el primer favorito
        if (savedPath) return savedPath;
        if (favorites.length > 0) return favorites[0];
        
        // 3. Si no hay favoritos, usa el primer acceso rápido
        if (quickAccess.length > 0) return quickAccess[0].path;
        
        // 4. Último recurso: directorio actual del servidor
        return ''; // El backend deberá manejar el path vacío
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Estado adicional
    const [isFirstRun, setIsFirstRun] = useState<boolean>(true);
    

    // Modificamos loadFiles para trabajar con navegación
    const loadFiles = async (newPath: string, addToHistory = true) => {
        if (!newPath) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post<ApiResponse>('/list_sql_files', { path: newPath });
            const files: ApiFile[] = response.data.files;
            const serverCurrentPath: string = response.data.current_path;
            
            const contents: FileNode[] = [];
            const dirs: {[key: string]: FileNode} = {};
            
            files.forEach((file) => {
                const parts = file.relative.split(/[/\\]/);
                if (parts.length === 1) {
                    // Archivo en el directorio actual
                    contents.push({
                        name: parts[0],
                        path: file.path
                    });
                } else {
                    // Subdirectorio
                    const dirName = parts[0];
                    if (!dirs[dirName]) {
                        dirs[dirName] = {
                            name: dirName,
                            path: `${serverCurrentPath}/${dirName}`,
                            isDirectory: true,
                            children: []
                        };
                        contents.push(dirs[dirName]);
                    }
                    
                    // Si hay más niveles, los agregamos como hijos
                    let current = dirs[dirName];
                    for (let i = 1; i < parts.length - 1; i++) {
                        const part = parts[i];
                        let existing = current.children?.find(c => c.name === part);
                        if (!existing) {
                            existing = { 
                                name: part, 
                                path: `${current.path}/${part}`,
                                isDirectory: true, 
                                children: [] 
                            };
                            current.children = [...(current.children || []), existing];
                        }
                        current = existing;
                    }
                    
                    // Agregar el archivo final
                    if (parts.length > 1) {
                        const fileName = parts[parts.length - 1];
                        current.children = [...(current.children || []), {
                            name: fileName,
                            path: file.path
                        }];
                    }
                }
            });

            setCurrentDirContents(contents);
            setCurrentPath(serverCurrentPath);
            
            // Manejo del historial de navegación
            if (addToHistory) {
                const newHistory = navigationHistory.slice(0, historyIndex + 1);
                newHistory.push(newPath);
                setNavigationHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    // Cargar contenido del archivo
    const handleFileSelect = async (path: string) => {
        setSelectedFile(path);
        try {
            const response = await apiClient.post<ApiFileContent>('/get_sql_file', { path });
            onSelectFile(path, response.data.content);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al cargar el archivo');
        }
    };

    // Navegar hacia arriba
    const navigateUp = () => {
        const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
        loadFiles(parentPath);
    };

    // Navegar hacia atrás/adelante
    const navigateHistory = (delta: number) => {
        const newIndex = historyIndex + delta;
        if (newIndex >= 0 && newIndex < navigationHistory.length) {
            setHistoryIndex(newIndex);
            loadFiles(navigationHistory[newIndex], false);
        }
    };
    
    const isFolderExpanded = (path: string) => expandedFolders.has(path);

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        
        // Si ya está expandido, lo contraemos
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            // Si no está expandido, colapsamos todo y expandimos solo este
            newExpanded.clear();
            newExpanded.add(path);
            
            // Opcional: expandir también todos los padres del path
            const parts = path.split(/[/\\]/);
            let currentPath = '';
            for (const part of parts) {
                if (currentPath) currentPath += '/';
                currentPath += part;
                newExpanded.add(currentPath);
            }
        }
        
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

    const filteredTree = searchQuery 
        ? fileTree.filter(node => 
            node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (node.children && node.children.some(child => 
            child.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        )
        : fileTree;

    // Modificamos renderNode para usar doble click
    const renderNode = (node: FileNode) => {
        const isSelected = currentFilePath === node.path;
        
        return (
            <div 
                key={node.path}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected 
                    ? '#569cd6' 
                    : isHovered === node.path 
                        ? '#3d3f41' 
                        : node.isDirectory 
                        ? 'transparent' 
                        : '#1e1e1e',
                    borderRadius: '4px',
                    margin: '2px 0'
                }}
                onClick={() => {
                    if (!node.isDirectory) {
                        handleFileSelect(node.path);
                    }
                }}
                onDoubleClick={() => {
                    if (node.isDirectory) {
                        loadFiles(node.path);
                    }
                }}
            >
                <span style={{ marginRight: '8px', width: '20px' }}>
                    {node.isDirectory ? (
                        <FontAwesomeIcon icon={faFolder} />
                    ) : (
                        <FontAwesomeIcon icon={faFileCode} />
                    )}
                </span>
            
                <span style={{ flex: 1 }}>{node.name}</span>
                
                {node.path && (
                    <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(node.path, e);
                        }}
                    >
                        <FontAwesomeIcon 
                            icon={favorites.includes(node.path) ? solidStar : regularStar} 
                            color={favorites.includes(node.path) ? '#ffc107' : '#9ca0a4'} 
                        />
                    </button>
                )}
            </div>
        );
    };


    // Efecto para cargar archivos al iniciar
    useEffect(() => {
        // Cargar favoritos desde localStorage
        const savedFavorites = localStorage.getItem('fileExplorerFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        // Cargar archivos
        if (currentPath || currentPath === '') {
            loadFiles(currentPath);
            setIsFirstRun(false); // Asegurarse de que no permanezca en primera ejecución
        }
    }, []);

    return (
        <div style={{            
                padding: '16px',
                background: '#2d2f31',
                color: '#e0e0e0',
                height: '100vh', 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden' 
            }}>
            {isFirstRun && !currentPath && (
            <div style={{
                    textAlign: 'center',
                    margin: 'auto',
                    maxWidth: '500px'
                }}>
                <h3>Bienvenido a SQL Editor</h3>
                <p>Selecciona un directorio para comenzar:</p>
                <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: '24px'
                    }}
                >
                {quickAccess.map(item => (
                    <button 
                    key={item.path}
                    onClick={() => {
                        loadFiles(item.path);
                        setIsFirstRun(false);
                    }}
                    >
                    <FontAwesomeIcon icon={item.icon} />
                    {item.name}
                    </button>
                ))}
                </div>
            </div>
            )}

            {/* Resto de tu interfaz normal */}
            {!isFirstRun && (
                <div style={{
                    padding: '16px',
                    background: '#2d2f31',
                    color: '#e0e0e0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    {/* Header con botón de recargar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ marginTop: 0 }}>
                            <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: '8px' }} />
                            Explorador de Archivos
                        </h3>
                        <button 
                            onClick={() => loadFiles(currentPath)}
                            style={{ background: 'none', border: 'none', color: '#9ca0a4', cursor: 'pointer' }}
                            title="Recargar"
                        >
                            <FontAwesomeIcon icon={faSyncAlt} spin={loading} />
                        </button>
                    </div>

                    {/* Barra de búsqueda */}
                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                        <FontAwesomeIcon 
                        icon={faSearch} 
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca0a4'
                        }} 
                    />
                        <input
                            type="text"
                            placeholder="Buscar archivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 8px 8px 32px',
                                background: '#1e1e1e',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                color: '#fff'
                            }}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#9ca0a4',
                                    cursor: 'pointer'
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>

                    {/* Controles de navegación */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '16px'
            }}>
                <button 
                    onClick={() => navigateHistory(-1)}
                    disabled={historyIndex === 0}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: historyIndex === 0 ? '#6c757d' : '#e0e0e0',
                        cursor: historyIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                <button 
                    onClick={() => navigateHistory(1)}
                    disabled={historyIndex === navigationHistory.length - 1}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: historyIndex === navigationHistory.length - 1 ? '#6c757d' : '#e0e0e0',
                        cursor: historyIndex === navigationHistory.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                
                <button 
                    onClick={navigateUp}
                    disabled={currentPath === '/' || currentPath.split('/').length <= 1}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: (currentPath === '/' || currentPath.split('/').length <= 1) ? '#6c757d' : '#e0e0e0',
                        cursor: (currentPath === '/' || currentPath.split('/').length <= 1) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
                
                <div style={{ 
                    flex: 1,
                    padding: '8px',
                    background: '#3d3f41',
                    borderRadius: '4px',
                    wordBreak: 'break-all'
                }}>
                    {currentPath}
                </div>
            </div>

            {/* Mostrar favoritos con ruta completa */}
            {favorites.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Favoritos</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {favorites.map(path => (
                            <div 
                                key={path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    background: path === currentPath ? '#569cd6' : '#3d3f41',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => loadFiles(path)}
                            >
                                <FontAwesomeIcon icon={solidStar} color="#ffc107" />
                                <span title={path}>
                                    {path.split('/').pop()} 
                                    <small style={{ 
                                        marginLeft: '8px', 
                                        color: '#adb5bd',
                                        fontSize: '0.8em'
                                    }}>
                                        ({path})
                                    </small>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contenido del directorio actual */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#9ca0a4' }}>
                        Cargando...
                    </div>
                ) : currentDirContents.length > 0 ? (
                    currentDirContents.map(node => renderNode(node))
                ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#9ca0a4', fontStyle: 'italic' }}>
                        El directorio está vacío
                    </div>
                )}
            </div>
        </div>
    )}</div>);}

export default FileExplorer;