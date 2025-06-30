import React, { useState } from 'react';
import apiClient from '../services/api';

interface FileNode {
    name: string;
    path: string;
    isDirectory?: boolean;
    children?: FileNode[];
}

interface FileResponse {
    name: string;
    path: string;
    relative: string;
}

interface FileExplorerProps {
    onSelectFile: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onSelectFile }) => {
    const [folderPath, setFolderPath] = useState<string>('');
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const isFolderExpanded = (path: string) => {
        return expandedFolders.has(path);
    };

    const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);

        if (newExpanded.has(path)) {
            newExpanded.delete(path); // Colapsar
        } else {
            newExpanded.add(path);   // Expandir
        }

        setExpandedFolders(newExpanded);
    };

    const loadFiles = async () => {
        if (!folderPath) return;

        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post<FileResponse[]>('/list_sql_files', { path: folderPath });
            const files: FileResponse[] = response.data;

            const tree = buildFileTree(files);
            setFileTree(tree);
        } catch (err: any) {
            setError('No se pudo cargar la carpeta. Verifica que sea válida.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const buildFileTree = (files: { name: string; path: string; relative: string }[]): FileNode[] => {
        const root: FileNode = { name: 'root', path: '', children: [] };

        files.forEach(file => {
        const parts = file.relative.split(/[/\\]/);
        let current = root;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            let existing = current.children?.find(c => c.name === part);
            if (!existing) {
            existing = { name: part, path: '', isDirectory: true, children: [] };
            if (!current.children) current.children = [];
            current.children.push(existing);
            }
            current = existing;
        }

        current.children?.push({ name: parts[parts.length - 1], path: file.path });
        });

        return root.children || [];
    };

    const handleNodeClick = (node: FileNode) => {
        if (!node.isDirectory && node.path) {
        onSelectFile(node.path);
        }
    };

    const renderNode = (node: FileNode, depth = 0) => {
    const indent = { paddingLeft: `${depth * 20}px`, textAlign: 'left' as const };
    const isExpanded = isFolderExpanded(node.path);

    return (
        <div key={node.path || node.name}>
        <div
            style={indent}
            onClick={() => {
            if (node.isDirectory) {
                toggleFolder(node.path);
            } else if (!node.isDirectory && node.path) {
                onSelectFile(node.path);
            }
            }}
            className="file-node"
        >
            {node.isDirectory ? (
            <>
                {isExpanded ? '📂' : '📁'} {node.name}
            </>
            ) : (
            <>
                📄 {node.name}
            </>
            )}
        </div>

        {node.isDirectory && isExpanded && node.children && (
            <div>
            {node.children.map(child => renderNode(child, depth + 1))}
            </div>
        )}
        </div>
    );
    };

    return (
        <div style={{ padding: '1rem' }}>
        <h3>Explorador de Archivos</h3>

        <input
            type="text"
            placeholder="Ruta de la carpeta"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
        />

        <button onClick={loadFiles} disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar .sql'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {fileTree.length > 0 ? (
            fileTree.map(node => renderNode(node))
            ) : (
            <p>No se han cargado archivos aún.</p>
            )}
        </div>
        </div>
    );

};

export default FileExplorer;