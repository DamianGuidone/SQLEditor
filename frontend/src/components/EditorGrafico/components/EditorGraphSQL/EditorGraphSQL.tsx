import React, { useState } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';
import ChartRenderer from '../ChartRenderer/ChartRenderer';
import ResultPanel from '../ResultPanel/ResultPanel';
import ExecutionControls from '../ExecutionControls/ExecutionControls';
import styles from './EditorGraphSQL.module.css';

interface EditorGraphSQLProps {
    sqlContent: string;
    chartData?: any;
    onSqlChange?: (newContent: string) => void;
    onExecute?: (sql: string) => Promise<any>;
    onSave?: () => void;
}

const EditorGraphSQL: React.FC<EditorGraphSQLProps> = ({ 
    sqlContent, 
    chartData, 
    onSqlChange,
    onExecute,
    onSave 
}) => {
    const [result, setResult] = useState<any>(null);
    const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
    const [variables, setVariables] = useState<Record<string, any>>({});

    const handleExecute = async () => {
    if (onExecute) {
        try {
            const result = await onExecute(sqlContent);
            setResult(result);
        } catch (error) {
            let errorMessage = 'Error desconocido';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            setResult({ error: errorMessage });
        }
    }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const nodeType = e.dataTransfer.getData('application/node-type');
        // Lógica para agregar nodos al diagrama
    };

    return (
        <div 
            className={`${styles.editorGraph} ${styles[layout]}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className={styles.codeSection}>
                <CodeEditor 
                    content={sqlContent} 
                    onChange={onSqlChange} 
                />
                <ExecutionControls 
                    onExecute={handleExecute}
                    onVariablesChange={setVariables}
                />
                <ResultPanel result={result} />
            </div>
            
            <div className={styles.chartSection}>
                <div className={styles.toolbar}>
                    <button onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}>
                        <i className={`fas fa-${layout === 'horizontal' ? 'columns' : 'rows'}`}></i>
                    </button>
                </div>
                <ChartRenderer 
                    chartData={chartData} 
                    sql={sqlContent}
                    onChartChange={(newChartData: any) => {
                        // Actualizar chartData en el tab correspondiente
                    }}
                />
            </div>
        </div>
    );
};

export default EditorGraphSQL;