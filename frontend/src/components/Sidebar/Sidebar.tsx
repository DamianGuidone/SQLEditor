import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, } from '@mui/material';
import './Sidebar.module.css';
import { SidebarProps, SidebarTabProps } from './types/sidebarTypes';

const Sidebar: React.FC<SidebarProps> = ({ tabs, position, id }) => {
    // Usamos el id para hacer únicas las keys en localStorage
    const [tabValue, setTabValue] = useState<number>(() => {
        const saved = localStorage.getItem(`sidebar-${id}-tab`);
        return saved ? parseInt(saved) : 0;
    });

    const [isPanelVisible, setIsPanelVisible] = useState<boolean>(() => {
        const saved = localStorage.getItem(`sidebar-${id}-visible`);
        return saved ? JSON.parse(saved) : true;
    });

    const [panelWidth, setPanelWidth] = useState<number>(() => {
        const saved = localStorage.getItem(`sidebar-${id}-width`);
        return saved ? parseInt(saved) : 500;
    });

    // Persistencia independiente para cada sidebar
    useEffect(() => {
        localStorage.setItem(`sidebar-${id}-tab`, tabValue.toString());
        localStorage.setItem(`sidebar-${id}-visible`, JSON.stringify(isPanelVisible));
        localStorage.setItem(`sidebar-${id}-width`, panelWidth.toString());
    }, [tabValue, isPanelVisible, panelWidth, id]);
    
    const [isResizing, setIsResizing] = useState<boolean>(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const newWidth = position === 'left' 
                ? e.clientX 
                : window.innerWidth - e.clientX;

            // Limites mínimos y máximos
            const minWidth = 200;
            const maxWidth = 1000;
            
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setPanelWidth(newWidth);
            }
        };

        const handleMouseUp = () => setIsResizing(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, position]);

    const handleTabClick = (index: number) => {
        if (index === tabValue && isPanelVisible) {
            setIsPanelVisible(false); // Ocultar panel
        } else {
            setTabValue(index); // Cambiar pestaña
            if (!isPanelVisible) {
                setIsPanelVisible(true); // Mostrar panel si estaba oculto
            }
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            position: 'relative',
            flexDirection: id === 'right' ? 'row-reverse' : 'row',
            flexShrink: 0 // Importante para evitar que el sidebar crezca
        }}>
            {/* Columna de pestañas */}
            <Box sx={{
                width: '60px',
                flexShrink: 0,
                borderRight: id === 'right' ? 'none' : '1px solid #333',
                borderLeft: id === 'right' ? '1px solid #333' : 'none',
                backgroundColor: '#2d2f31',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflowY: 'auto'
            }}>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    aria-label="Vertical tabs example"
                    variant="scrollable"
                    sx={{
                        '& .MuiTab-root': {
                        minHeight: '48px',
                        minWidth: '48px',
                        borderRadius: '0',
                        padding: '12px 0',
                        color: '#9ca0a4',
                        '&.Mui-selected': id === 'left' ? { color: '#fff', borderLeft: '5px solid #569cd6', backgroundColor: '#1e1e1e' }
                                                        : { color: '#fff', borderRight: '5px solid #569cd6', backgroundColor: '#1e1e1e' },
                        '&:hover': {
                            background: '#333',
                            color: '#fff'
                        }
                        },
                        '& .MuiTabs-indicator': id === 'left' ?  { left: 0, width: '5px', backgroundColor: '#569cd6' }
                                                                : { right: 0, width: '5px', backgroundColor: '#569cd6' }
                    }}
                >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        icon={tab.icon as React.ReactElement}
                        iconPosition="start"
                        {...a11yProps(index)}
                        onClick={() => handleTabClick(index)}
                    />
                ))}
                </Tabs>
            </Box>

            {/* Panel de contenido */}
            {isPanelVisible && tabValue !== null && (
            <Box
                sx={{
                    width: `${panelWidth}px`,
                    flexShrink: 0,
                    borderRight: id === 'left' ? '1px solid #333' : 'none',
                    borderLeft: id === 'right' ? '1px solid #333' : 'none',
                    backgroundColor: '#1e1e1e',
                    overflowY: 'auto',
                    position: 'relative',
                    height: '100%' // Asegura que ocupe toda la altura
                }}
            >
                <div style={{ padding: '1rem' }}>
                    {tabs[tabValue]?.children}
                </div>

                {/* Divisor de redimensionamiento */}
                <Box
                    onMouseDown={() => setIsResizing(true)}
                    sx={{
                        position: 'absolute',
                        left: id === 'right' ? 0 : undefined,
                        right: id === 'left' ? 0 : undefined,
                        top: 0,
                        bottom: 0,
                        width: '5px',
                        bgcolor: '#555',
                        cursor: 'col-resize',
                        zIndex: 1000,
                        opacity: isResizing ? 1 : 0.4,
                        transition: 'opacity 0.2s ease',
                        '&:hover': { opacity: 0.8 }
                    }}
                />
            </Box>
            )}

        </Box>
    );
};

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`
    };
}

export default Sidebar;