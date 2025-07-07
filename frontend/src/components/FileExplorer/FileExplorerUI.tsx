import React from 'react';
import DirectoryList from './components/DirectoryList/DirectoryList';
import ShowDirectoryPicker from './components/ShowDirectoryPicker/ShowDirectoryPicker';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { useFileExplorerContext } from './contexts/FileExplorerContext';
import styles from './FileExplorer.module.css';
import AccordionSection from '../Sidebar/AccordionSection';
import DirectoryTree from './components/DirectoryTree/DirectoryTree';

const FileExplorerUI: React.FC = () => {
    const {
        showPicker,
        setShowPicker,
        currentDirectory,
        currentBasePath,
        directoryContents,
        favorites,
        openFiles,
        loading,
        error,
        navigateToDirectory,
        selectBasePath,
        refreshDirectory,
        addFavorite,
        removeFavorite,
        selectedFile,
        setSelectedFile,
        handleDirectorySelect
    } = useFileExplorerContext();

    if (showPicker) {
        return (
        <div className={styles.fileExplorerContainer}>
            <ShowDirectoryPicker onDirectorySelect={(basePath, initialPath = '') => handleDirectorySelect(basePath, initialPath)} />
        </div>
        );
    }

    return (
        <div className={styles.fileExplorerContainer}>
            <AccordionSection title="Favoritos" defaultExpanded={true}>
                {favorites.length > 0 ? (
                    <DirectoryList items={favorites} isFavoriteList />
                ) : (
                    <div className={styles.emptyMessage}>No hay favoritos</div>
                )}
            </AccordionSection>
            
            <AccordionSection title="Archivos abiertos">
                {openFiles.length > 0 ? (
                    <DirectoryList 
                        items={openFiles} 
                        isOpenFilesList
                    />
                    ) : (
                        <div className={styles.emptyMessage}>No hay archivos abiertos</div>
                    )}
            </AccordionSection>
            
            <AccordionSection title="Explorador">
                <Breadcrumbs />
                <DirectoryTree 
                    item={{ 
                        name: currentBasePath, 
                        path: '', 
                        isDirectory: true 
                    }} 
                />
            </AccordionSection>
        </div>
    );
};

export default FileExplorerUI;