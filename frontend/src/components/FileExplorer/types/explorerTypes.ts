export interface FileSystemItem {
    name: string;
    path: string;
    isDirectory: boolean;
    type?: 'sql' | 'sqlg' | null;
    relativePath?: string;
}

export interface DirectoryContents {
    directories: FileSystemItem[];
    files: FileSystemItem[];
}

export interface FavoriteItem {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FavoriteItem[];
}

export type FileOperation = 
    | 'delete' 
    | 'rename' 
    | 'create_dir' 
    | 'create_file' 
    | 'move' 
    | 'copy';

export interface FileOperationParams {
    operation: FileOperation;
    path: string;
    newName?: string;
    newPath?: string;
    content?: string;
}

export interface FileExplorerContextType {
    _fetchDirectoryContents: any;
    // Estado del explorador
    currentDirectory: string;
    currentBasePath: string;
    directoryContents: DirectoryContents;
    loading: boolean;
    error: string | null;
    
    // Funciones del explorador
    navigateToDirectory: (path: string) => void;
    selectBasePath: (basePath: string) => void;
    refreshDirectory: () => void;
    performFileOperation: (params: FileOperationParams) => Promise<boolean>;
    fetchDirectoryContents: (path: string) => Promise<FileSystemItem[]>;
    
    // Favoritos
    favorites: FavoriteItem[];
    addFavorite: (item: FileSystemItem) => void;
    removeFavorite: (path: string) => void;
    addFavoriteFolder: (folder: FavoriteItem) => void;
    
    // Archivos abiertos
    openFiles: FileSystemItem[];
    currentFile: FileSystemItem | null;
    setOpenFiles: (files: FileSystemItem[]) => void;
    setCurrentFile: (file: FileSystemItem | null) => void;
    removeOpenFile: (path: string) => void;
    addOpenFile: (file: FileSystemItem) => void;
    
    // UI State
    selectedFile: string | null;
    setSelectedFile: (path: string | null) => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    handleDirectorySelect: (basePath: string, initialPath: string) => void;
}