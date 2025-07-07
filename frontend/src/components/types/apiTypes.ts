// Tipos generales para respuestas API
export interface ApiResponse<T = any> {
    data?: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

// Tipos para elementos del sistema de archivos
export interface DirectoryItem {
    id?: string;
    name?: string;
    path?: string;
    isDirectory?: boolean;
    type?: string;
    [key: string]: any; // Propiedades adicionales
}

// Extensión para items con hijos (árbol de directorios)
export interface DirectoryTreeItem extends DirectoryItem {
    children?: DirectoryTreeItem[];
}