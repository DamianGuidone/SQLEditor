import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
    content: string;
    onChange?: (newContent: string) => void;
    onSave?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
    content, 
    onChange, 
    onSave 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [localContent, setLocalContent] = useState(content);

    // Sincronizar contenido cuando cambia la prop
    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    const handleEditorDidMount = () => {
        setIsLoading(false);
    };

    const handleChange = (value?: string) => {
        setLocalContent(value || '');
        if (onChange) {
        onChange(value || '');
        }
    };

    // Manejar atajos de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (onSave) onSave();
        }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onSave]);

    return (
        <div className={styles.editorWrapper}>
        {isLoading && (
            <div className={styles.loadingEditor}>
            <i className="fas fa-spinner fa-spin"></i> Cargando editor...
            </div>
        )}
        
        <Editor
            height="100%"
            defaultLanguage="sql"
            value={localContent}
            theme="vs-dark"
            onChange={handleChange}
            onMount={handleEditorDidMount}
            options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            suggest: {
                showKeywords: true,
                showSnippets: true
            }
            }}
        />
        
        <div className={styles.statusBar}>
            <span>SQL</span>
            {onSave && (
            <button 
                className={styles.saveButton}
                onClick={onSave}
                title="Guardar (Ctrl+S)"
            >
                <i className="fas fa-save"></i> Guardar
            </button>
            )}
        </div>
        </div>
    );
};

export default CodeEditor;