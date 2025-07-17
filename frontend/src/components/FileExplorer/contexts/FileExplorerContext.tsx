import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FileExplorerContextType } from '../types/explorerTypes';
import useFavorites from '../hooks/useFavorites';
import useFileExplorer from '../hooks/useFileExplorer';
import useOpenFiles from '../hooks/useOpenFiles';

const FileExplorerContext = createContext<FileExplorerContextType | null>(null);

export const FileExplorerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const fileExplorer = useFileExplorer();
    const favorites = useFavorites(fileExplorer.currentBasePath);
    const openFiles = useOpenFiles();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [forceDirectorySelection, setForceDirectorySelection] = useState(false);

    
    // Nueva función para manejar la persistencia
    const handleDirectorySelect = async (basePath: string, initialPath: string = '') => {
        try {
            // 1. Guardar en localStorage
            localStorage.setItem('lastDirectoryPath', basePath);
            
            // 2. Actualizar estado
            fileExplorer.selectBasePath(basePath);
            fileExplorer.navigateToDirectory(initialPath);
            
            // 3. Cerrar el selector
            setShowPicker(false);
            setForceDirectorySelection(false);
            
            // 4. Refrescar contenido
            await fileExplorer.refreshDirectory();
        } catch (error) {
            console.error("Error selecting directory:", error);
            fileExplorer.error = "Failed to select directory";
        }
    };

    // Verificar directorio al iniciar
    useEffect(() => {
        const savedPath = localStorage.getItem('lastDirectoryPath');
        if (!savedPath) {
            setForceDirectorySelection(true);
        } else {
            handleDirectorySelect(savedPath).catch(console.error);
        }
    }, []);

    const contextValue = useMemo<FileExplorerContextType>(() => ({
        // Estado del explorador
        currentDirectory: fileExplorer.currentDirectory,
        currentBasePath: fileExplorer.currentBasePath,
        directoryContents: fileExplorer.directoryContents,
        loading: fileExplorer.loading,
        error: fileExplorer.error,
        
        // Funciones del explorador
        navigateToDirectory: fileExplorer.navigateToDirectory,
        selectBasePath: fileExplorer.selectBasePath,
        refreshDirectory: fileExplorer.refreshDirectory,
        performFileOperation: fileExplorer.performFileOperation,
        fetchDirectoryContents: fileExplorer.fetchDirectoryContents,
        
        // Favoritos
        favorites: favorites.favorites,
        addFavorite: favorites.addFavorite,
        removeFavorite: favorites.removeFavorite,
        addFavoriteFolder: favorites.addFavoriteFolder,
        
        // Archivos abiertos
        openFiles: openFiles.openFiles,
        currentFile: openFiles.currentFile,
        setOpenFiles: openFiles.setOpenFiles,
        setCurrentFile: openFiles.setCurrentFile,
        removeOpenFile: openFiles.removeOpenFile,
        addOpenFile: openFiles.addOpenFile,
        
        // UI State
        showPicker,
        setShowPicker,
        selectedFile,
        setSelectedFile,      
        forceDirectorySelection,
        setForceDirectorySelection,  
        handleDirectorySelect
    }), [fileExplorer, favorites, openFiles, showPicker, selectedFile, forceDirectorySelection]);

    return (
        <FileExplorerContext.Provider value={contextValue}>
            {children}
        </FileExplorerContext.Provider>
    );
};

export const useFileExplorerContext = () => {
    const context = useContext(FileExplorerContext);
    if (!context) {
        throw new Error('useFileExplorerContext must be used within a FileExplorerProvider');
    }
    return context;
};