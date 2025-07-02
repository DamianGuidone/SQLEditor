import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

interface ToolNode {
    id: string;
    label: string;
    type: string; // select, if, table, etc.
}

const ToolSidebar: React.FC<{ onDragStart: (node: ToolNode) => void }> = ({ onDragStart }) => {
    const [isExpanded, setIsExpanded] = useLocalStorageState<boolean>('tool-sidebar-expanded', {defaultValue:true});
    const [width, setWidth] = useLocalStorageState<number>('tool-sidebar-width', {defaultValue:250});
    const [isResizing, setIsResizing] = useState(false);

    // Nodos disponibles para arrastrar
    const toolNodes: ToolNode[] = [
        { id: 'select', label: 'SELECT', type: 'select' },
        { id: 'if', label: 'IF', type: 'condition' },
        { id: 'while', label: 'WHILE', type: 'loop' },
        { id: 'table', label: 'Tabla', type: 'table' },
        { id: 'join', label: 'JOIN', type: 'join' }
    ];

    return (
        <div style={{
        display: isExpanded ? 'flex' : 'none',
        width: `${width}px`,
        flexShrink: 0,
        borderLeft: '1px solid #333',
        backgroundColor: '#2d2f31',
        color: 'white',
        flexDirection: 'column',
        overflowY: 'auto'
        }}>
        {/* Título */}
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid #444',
            fontWeight: 'bold'
        }}>
            Herramientas de Edición Gráfica
        </div>

        {/* Nodos arrastrables */}
        <div style={{ padding: '1rem' }}>
            {toolNodes.map(node => (
            <div
                key={node.id}
                draggable
                onDragStart={() => onDragStart(node)}
                style={{
                padding: '0.7rem',
                margin: '0.5rem 0',
                backgroundColor: '#1e1e1e',
                borderRadius: '4px',
                cursor: 'grab',
                textAlign: 'center',
                userSelect: 'none'
                }}
            >
                {node.label}
            </div>
            ))}
        </div>

        {/* Divisor de redimensionado */}
        <div
            onMouseDown={(e) => setIsResizing(true)}
            style={{
            width: '5px',
            background: '#555',
            cursor: 'col-resize',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000
            }}
        />
        </div>
    );
};

export default ToolSidebar;