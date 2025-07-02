import React, { useState } from 'react';

interface ToolNode {
    id: string;
    label: string;
    type: string;
}

const ToolEditor: React.FC<{ onDragStart: (node: ToolNode) => void }> = ({ onDragStart }) => {
    const toolNodes: ToolNode[] = [
        { id: 'select', label: 'SELECT', type: 'select' },
        { id: 'if', label: 'IF', type: 'condition' },
        { id: 'while', label: 'WHILE', type: 'loop' },
        { id: 'table', label: 'Tabla', type: 'table' },
        { id: 'join', label: 'JOIN', type: 'join' }
    ];

    return (
    <div>
        {toolNodes.map(node => (
            <div
            key={node.id}
            draggable
            onDragStart={() => onDragStart(node)}
            >
            {node.label}
            </div>
        ))}
        </div>
    );
};

export default ToolEditor;