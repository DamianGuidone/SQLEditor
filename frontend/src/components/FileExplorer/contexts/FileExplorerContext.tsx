import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import useFileExplorer from '../hooks/useFileExplorer';
import useFavorites from '../hooks/useFavorites';
import useOpenFiles from '../hooks/useOpenFiles';
import { FileExplorerContextType } from '../types/explorerTypes';

const FileExplorerContext = createContext<FileExplorerContextType | null>(null);

export const FileExplorerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const fileExplorer = useFileExplorer();
    const favorites = useFavorites(fileExplorer.currentBasePath);
    const openFiles = useOpenFiles();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    /**
     * Called when a directory is selected from the picker.
     * Updates the context with the new base path and initial directory.
     * Also sets showPicker to false to hide the picker.
     * @param basePath the base path of the directory that was selected
     * @param initialPath the initial path to navigate to inside the selected directory
     * @returns void
     */
    const handleDirectorySelect = (basePath: string, initialPath: string = '') => {
        selectBasePath(basePath);
        navigateToDirectory(initialPath);
        setShowPicker(false);
    };

    const contextValue = useMemo<FileExplorerContextType>(() => ({
        // Estado del explorador
        ...fileExplorer,
        
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
        
        _fetchDirectoryContents: fileExplorer.fetchDirectoryContents,
        get fetchDirectoryContents() {
            return this._fetchDirectoryContents;
        },
        set fetchDirectoryContents(value) {
            this._fetchDirectoryContents = value;
        },
        performFileOperation: fileExplorer.performFileOperation,
        navigateToDirectory: fileExplorer.navigateToDirectory,
        selectBasePath: fileExplorer.selectBasePath,
        refreshDirectory: fileExplorer.refreshDirectory,
        handleDirectorySelect: handleDirectorySelect
    }), [fileExplorer, favorites, openFiles, showPicker, selectedFile]);

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

function selectBasePath(basePath: string) {
    throw new Error('Function not implemented.');
}
function navigateToDirectory(initialPath: string) {
    throw new Error('Function not implemented.');
}

