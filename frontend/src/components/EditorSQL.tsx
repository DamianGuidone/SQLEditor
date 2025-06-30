import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useLocalStorageState from 'use-local-storage-state';
import apiClient from '../services/api';

interface Tab {
    path: string;
    content: string;
    isDirty: boolean;
}

interface SqlFileResponse {
    content: string;
}

const EditorSQL: React.FC<{ selectedFile?: string }> = ({ selectedFile }) => {
    const [tabs, setTabs] = useLocalStorageState<Tab[]>('editor-tabs', {defaultValue: []});
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // Cargar archivo cuando se selecciona uno nuevo
    useEffect(() => {
        if (!selectedFile || tabs.some(tab => tab.path === selectedFile)) return;

        // Llamamos al backend para obtener el contenido del archivo
        apiClient.post<SqlFileResponse>('/get_sql_file', { path: selectedFile })
            .then(response => {
                const content = response.data.content;
                setTabs((prevTabs: Tab[]) => [
                    ...prevTabs,
                    { path: selectedFile, content, isDirty: false }
                ]);
                setActiveTab(selectedFile);
            })
            .catch(err => {
                console.error("Error al cargar el archivo:", err);
                alert("No se pudo leer el archivo desde el servidor.");
            });
    }, [selectedFile]);

    const activeTabData = tabs.find(tab => tab.path === activeTab);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #ccc' }}>
            {tabs.map(tab => (
            <div
                key={tab.path}
                style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                backgroundColor: tab.path === activeTab ? '#eee' : 'white',
                fontWeight: tab.isDirty ? 'bold' : 'normal',
                borderRight: '1px solid #ccc'
                }}
                onClick={() => setActiveTab(tab.path)}
            >
                {tab.path.split('/').pop()}
            </div>
            ))}
        </div>

        {/* Editor */}
        {activeTabData && (
            <div style={{ flex: 1 }}>
            <Editor
                height="100%"
                defaultLanguage="sql"
                value={activeTabData.content}
                theme="vs-dark"
            />
            </div>
        )}

        {/* Barra inferior */}
        <div style={{ padding: '0.5rem', borderTop: '1px solid #ccc' }}>
            {activeTabData && <span>{activeTabData.path}</span>}
        </div>
        </div>
    );
};

export default EditorSQL;