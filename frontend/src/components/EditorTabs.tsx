import React from 'react';
import EditorGraphSQL from './EditorGraphSQL';

interface Tab {
    path: string;
    content: string;
    isDirty: boolean;
    chartData?: any;
}

interface EditorTabsProps {
    tabs: Tab[];
    activeTabPath: string;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ tabs, activeTabPath }) => {
    const activeTab = tabs.find(tab => tab.path === activeTabPath);

    if (!activeTab) {
        return <div>No hay pestaña activa</div>;
    }

    return (
        <EditorGraphSQL
        />
    );
};

export default EditorTabs;