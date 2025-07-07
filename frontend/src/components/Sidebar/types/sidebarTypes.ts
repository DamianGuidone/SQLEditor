export interface SidebarTabProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

export interface SidebarProps {
    tabs: SidebarTabProps[];
    position: 'left' | 'right';
    id: string; // Identificador único para cada sidebar
}