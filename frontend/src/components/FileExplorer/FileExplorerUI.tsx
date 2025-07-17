import React, { useEffect, useState } from 'react';
import { EmptyExplorerState } from './components/EmptyExplorerState/EmptyExplorerState';
import DirectoryList from './components/DirectoryList/DirectoryList';
import ShowDirectoryPicker from './components/ShowDirectoryPicker/ShowDirectoryPicker';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { useFileExplorerContext } from './contexts/FileExplorerContext';
import styles from './FileExplorer.module.css';
import Section from '../Sidebar/Section';
import DirectoryTree from './components/DirectoryTree/DirectoryTree';
import EmptyMessage from '../Sidebar/EmptyMessage';

const FileExplorerUI: React.FC = () => {
    const {
        showPicker,
        forceDirectorySelection,
        setShowPicker,
        setForceDirectorySelection,
        currentBasePath,
        directoryContents,
        favorites,
        openFiles,
        loading,
        error,
        refreshDirectory,
        handleDirectorySelect
    } = useFileExplorerContext();

    const [forceShowPicker, setForceShowPicker] = useState(false);

    useEffect(() => {
        console.log('Current Base Path:', currentBasePath);
        console.log('Directory Contents:', directoryContents);
    }, [currentBasePath, directoryContents]);

    const handleSelectDirectory = () => {
        setForceDirectorySelection(true);
    };

    
    const handleReloadRoot = () => {
        handleDirectorySelect(currentBasePath, '');
    };

    // Mostrar el selector si no hay directorio base o si se fuerza
    const shouldShowPicker = forceShowPicker || !currentBasePath;

    if (showPicker || forceDirectorySelection) {
        return (
            <div className={styles.fileExplorerContainer}>
                <ShowDirectoryPicker 
                    onDirectorySelect={handleDirectorySelect}
                    onCancel={() => setForceDirectorySelection(false)}
                />
            </div>
        );
    }

    // Verificar si el directorio está vacío
    const isEmptyDirectory = directoryContents.directories.length === 0 && 
                            directoryContents.files.length === 0;

    return (
        <div className={styles.mainExplorer}>
            {/* Sección de Favoritos */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <i className="fas fa-star"></i>
                    <span>FAVORITOS</span>
                </div>
                <div className={styles.scrollableContent}>
                    {favorites.length > 0 ? (
                        <DirectoryList items={favorites} />
                    ) : (
                        <EmptyMessage>No hay favoritos</EmptyMessage>
                    )}
                </div>
            </div>

            {/* Sección de Archivos Abiertos */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <i className="fas fa-file-alt"></i>
                    <span>ARCHIVOS ABIERTOS</span>
                </div>
                <div className={styles.scrollableContent}>
                    {openFiles.length > 0 ? (
                        <DirectoryList items={openFiles} />
                    ) : (
                        <EmptyMessage>No hay archivos abiertos</EmptyMessage>
                    )}
                </div>
            </div>

            {/* Explorador Principal */}
            <div className={styles.section} style={{ borderBottom: 'none', flex: 1 }}>
                <div className={styles.toolbar}>
                    <Breadcrumbs />
                    <div className={styles.actions}>
                        <button onClick={refreshDirectory} title="Recargar directorio">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button onClick={() => handleDirectorySelect('', '')} title="Cambiar directorio raíz">
                            <i className="fas fa-folder-open"></i>
                        </button>
                    </div>
                </div>
                <div className={styles.treeContainer}>
                    {currentBasePath ? (
                        <DirectoryTree 
                            item={{ 
                                name: currentBasePath.split(/[\\/]/).pop() || currentBasePath, 
                                path: currentBasePath, 
                                isDirectory: true 
                            }} 
                        />
                    ) : (
                        <EmptyMessage icon="folder-open">
                            Selecciona un directorio para comenzar
                        </EmptyMessage>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileExplorerUI;