import React from 'react';
import { FileExplorerProvider } from './contexts/FileExplorerContext';
import FileExplorerUI from './FileExplorerUI';

const FileExplorer: React.FC = () => {
    return (
        <FileExplorerProvider>
            <FileExplorerUI />
        </FileExplorerProvider>
    );
};

export default FileExplorer;