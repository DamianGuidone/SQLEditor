import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

interface SidebarProps {
    title: string;
    children: React.ReactNode;
    defaultWidth?: number;
    isExpanded: boolean;
    toggleExpand: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
        title, 
        children, 
        defaultWidth = 300, 
        isExpanded, 
        toggleExpand  
    }) => {
    const [width, setWidth] = useLocalStorageState<number>('sidebar-width', {defaultValue: 100});

    const handleResize = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const mouseMoveHandler = (e: MouseEvent) => {
            if (e.clientX < 200 || e.clientX > window.innerWidth - 200) return;

            setWidth(e.clientX);
        };

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    return (
        <div
            style={{
                display: isExpanded ? 'flex' : 'none',
                flexDirection: 'column',
                width: `${width}px`,
                borderRight: '1px solid #ccc',
                overflowY: 'auto',
                position: 'relative'
            }}
        >
        {/* Título del sidebar */}
        <div
            style={{
                padding: '1rem',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer'
            }}
            onClick={toggleExpand}
        >
            {title} {isExpanded ? '<<' : '>>'}
        </div>

        {/* Contenido del sidebar */}
        <div style={{ flex: 1, padding: '1rem' }}>{children}</div>

        {/* Resizer */}
        <div
            style={{
                width: '5px',
                cursor: 'col-resize',
                background: '#ccc',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000
            }}
            onMouseDown={handleResize}
        />
        </div>
    );
};

export default Sidebar;