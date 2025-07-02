import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import ChartRenderer from './ChartRenderer';
import ResultPanel from './ResultPanel';
import ExecutionControls from './ExecutionControls';

interface EditorGraphSQLProps {
    sqlContent: string;
    chartData?: any;
    onSqlChange?: (newContent: string) => void;
    onExecute?: (variables: Record<string, any>) => void;
    result?: any;
}

const EditorGraphSQL: React.FC = () => {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const nodeData = JSON.parse(e.dataTransfer.getData('application/node'));
        // Agregar el nuevo nodo al diagrama
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {/* Área del diagrama */}
        </div>
    );
};

export default EditorGraphSQL;