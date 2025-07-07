import React, { useContext, useEffect, useState } from 'react';
import { useFileExplorerContext } from '../FileExplorer/contexts/FileExplorerContext';
import styles from './EditorTabs.module.css';
import apiClient from '../../services/api';
import EditorGraphSQL from './components/EditorGraphSQL/EditorGraphSQL';
import { EditorTab } from './types/editorTypes';

const EditorTabs: React.FC = () => {    
    const { openFiles, currentFile, setCurrentFile, removeOpenFile, fetchDirectoryContents } = useFileExplorerContext();
    const [tabs, setTabs] = useState<EditorTab[]>([]);
    const [activeTabPath, setActiveTabPath] = useState<string>('');

    // Cargar contenido de archivos
    useEffect(() => {
        const loadFiles = async () => {
            const newTabs: EditorTab[] = [];
            
            for (const file of openFiles) {
                if (!tabs.some(t => t.path === file.path)) {
                    try {
                        const response = await apiClient.post('/get_sql_file', { path: file.path });
                        newTabs.push({
                            path: file.path,
                            content: response.data.content,
                            isDirty: false,
                            chartData: null
                        });
                    } catch (error) {
                        console.error(`Error loading file ${file.path}:`, error);
                        newTabs.push({
                            path: file.path,
                            content: `-- Error loading file\n-- ${error instanceof Error ? error.message : 'Unknown error'}`,
                            isDirty: false,
                            chartData: null
                        });
                    }
                }
            }
            
            if (newTabs.length > 0) {
                setTabs([...tabs, ...newTabs]);
            }
        };
            
        if (openFiles.length > 0) {
            loadFiles();
        }
    }, [openFiles]);

    // Sincronizar pestaña activa
    useEffect(() => {
        if (currentFile && openFiles.some(f => f.path === currentFile.path)) {
        setActiveTabPath(currentFile.path);
        } else if (openFiles.length > 0) {
        setCurrentFile(openFiles[0]);
        }
    }, [currentFile, openFiles]);

    const handleContentChange = (path: string, newContent: string) => {
        setTabs(tabs.map(tab => 
        tab.path === path ? { ...tab, content: newContent, isDirty: true } : tab
        ));
    };

    const handleSaveFile = async (path: string) => {
        const tab = tabs.find(t => t.path === path);
        if (tab) {
        try {
            await apiClient.post('/save_sql_file', {
            path: tab.path,
            content: tab.content
            });
            setTabs(tabs.map(t => 
            t.path === path ? { ...t, isDirty: false, lastSaved: new Date() } : t
            ));
        } catch (error) {
            console.error('Error saving file:', error);
            // Mostrar notificación de error al usuario
        }
        }
    };

    return (
        <div className={styles.editorContainer}>
        {tabs.length > 0 ? (
            <>
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                <div 
                    key={tab.path} 
                    className={`${styles.tab} ${activeTabPath === tab.path ? styles.active : ''}`}
                    onClick={() => setCurrentFile(openFiles.find(f => f.path === tab.path)!)}
                >
                    {tab.path.split('/').pop()}
                    {tab.isDirty && <span className={styles.unsavedDot}>•</span>}
                    <button 
                    className={styles.closeTab}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeOpenFile(tab.path);
                        setTabs(tabs.filter(t => t.path !== tab.path));
                    }}
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>
            
            {tabs.map(tab => (
                <div 
                key={tab.path} 
                style={{ display: activeTabPath === tab.path ? 'flex' : 'none' }}
                className={styles.tabContent}
                >
                <EditorGraphSQL
                    sqlContent={tab.content}
                    onSqlChange={(newContent: string) => handleContentChange(tab.path, newContent)}
                    onSave={() => handleSaveFile(tab.path)}
                    chartData={tab.chartData}
                />
                </div>
            ))}
            </>
        ) : (
            <div className={styles.noTabs}>
            <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
            <p>No hay archivos abiertos</p>
            <p>Selecciona un archivo del explorador para comenzar</p>
            </div>
        )}
        </div>
    );
};

export default EditorTabs;