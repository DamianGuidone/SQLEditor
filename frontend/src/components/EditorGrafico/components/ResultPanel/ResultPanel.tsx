import React from 'react';

interface ResultPanelProps {
    result?: any;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result }) => {
    return (
        <div style={{
            padding: '1rem',
            borderTop: '1px solid #ccc',
            height: '300px',
            overflowY: 'auto'
        }}>
            <h4>Resultado de consulta</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    );
};

export default ResultPanel;