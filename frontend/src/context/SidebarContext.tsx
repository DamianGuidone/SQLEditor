import React, { createContext, useState, useContext, useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

// Definimos qué contiene nuestro contexto
interface SidebarContextType {
    isPanelVisible: boolean;
    tabValue: number | null;
    panelWidth: number;
    setIsPanelVisible: (value: boolean) => void;
    togglePanel: () => void;
    setTabValue: (value: number) => void;
    setPanelWidth: (width: number) => void;
}

// Creamos el contexto vacío
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Hook personalizado para usar el contexto fácilmente
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar debe usarse dentro de un SidebarProvider');
    }
    return context;
};

// Provider del contexto – lo envuelve todo
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estados con persistencia
    const [tabValue, setTabValue] = useLocalStorageState<number>('sidebar-tab', {defaultValue:0});
    const [isPanelVisible, setIsPanelVisible] = useLocalStorageState<boolean>('sidebar-visible', {defaultValue:true});
    const [panelWidth, setPanelWidth] = useLocalStorageState<number>('sidebar-width', {defaultValue:300});

    const togglePanel = useCallback(() => {
        setIsPanelVisible(prev => !prev);
    }, []);

    return (
        <SidebarContext.Provider value={{
            isPanelVisible,
            tabValue,
            panelWidth,
            setIsPanelVisible,
            togglePanel,
            setTabValue,
            setPanelWidth
        }}>
            {children}
        </SidebarContext.Provider>
    );
};