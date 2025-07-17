import React from 'react';
import { FileExplorerProvider } from './contexts/FileExplorerContext';
import FileExplorerUI from './FileExplorerUI';
import styles from './FileExplorer.module.css';

const FileExplorer: React.FC = () => {
    return (
        <FileExplorerProvider>
            <div className={styles.sidebarFileExplorer}>
                <FileExplorerUI />
            </div>
        </FileExplorerProvider>
    );
};

export default FileExplorer;