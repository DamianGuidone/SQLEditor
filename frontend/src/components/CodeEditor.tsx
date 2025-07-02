import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    content: string;
    onChange?: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, onChange }) => {
    return (
        <div style={{ height: '100%' }}>
            <Editor
                height="100%"
                value={content}
                defaultLanguage="sql"
                theme="vs-dark"
                onChange={(value) => onChange?.(value || '')}
            />
        </div>
    );
};

export default CodeEditor;