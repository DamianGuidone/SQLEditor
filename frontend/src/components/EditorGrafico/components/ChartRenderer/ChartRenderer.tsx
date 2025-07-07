import React from 'react';
import styles from './ChartRenderer.module.css';

interface ChartRendererProps {
    chartData?: any;
    sql?: string;
    onChartChange?: (newChartData: any) => void;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ 
    chartData, 
    sql, 
    onChartChange 
    }) => {
    // En una implementación real, aquí iría React Flow u otra librería de gráficos
    // Esta es una versión simplificada para demostración

    const handleNodeAdd = (type: string) => {
        if (onChartChange) {
        const newNode = {
            id: `node-${Date.now()}`,
            type,
            position: { x: 100, y: 100 },
            data: { label: `${type} Node` }
        };
        onChartChange({
            ...chartData,
            nodes: [...(chartData?.nodes || []), newNode]
        });
        }
    };

    return (
        <div className={styles.chartContainer}>
        <div className={styles.chartToolbar}>
            <button 
            title="Añadir tabla"
            onClick={() => handleNodeAdd('table')}
            >
            <i className="fas fa-table"></i>
            </button>
            <button 
            title="Añadir join"
            onClick={() => handleNodeAdd('join')}
            >
            <i className="fas fa-project-diagram"></i>
            </button>
            <button 
            title="Añadir filtro"
            onClick={() => handleNodeAdd('filter')}
            >
            <i className="fas fa-filter"></i>
            </button>
        </div>

        {chartData?.nodes?.length > 0 ? (
            <div className={styles.chartArea}>
            {/* Aquí iría el renderizado real del gráfico */}
            <div className={styles.graphPlaceholder}>
                <p>Diagrama SQL interactivo</p>
                <p>Nodos: {chartData.nodes.length}</p>
                {sql && (
                <div className={styles.sqlPreview}>
                    <pre>{sql.substring(0, 100)}{sql.length > 100 ? '...' : ''}</pre>
                </div>
                )}
            </div>
            </div>
        ) : (
            <div className={styles.emptyChart}>
            <i className={`fas fa-project-diagram ${styles.emptyChartIcon}`}></i>
            <p>Arrastra elementos aquí para crear tu diagrama</p>
            <p>o genera uno automáticamente desde el código SQL</p>
            {sql && (
                <button 
                className={styles.generateButton}
                onClick={() => {
                    // Lógica para generar gráfico desde SQL
                }}
                >
                <i className="fas fa-magic"></i> Generar desde SQL
                </button>
            )}
            </div>
        )}
        </div>
    );
};

export default ChartRenderer;