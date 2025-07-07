import { useState } from 'react';
import { FileSystemItem } from '../types/explorerTypes';

const useOpenFiles = () => {
    const [openFiles, setOpenFiles] = useState<FileSystemItem[]>([]);
    const [currentFile, setCurrentFile] = useState<FileSystemItem | null>(null);

    const addOpenFile = (file: FileSystemItem) => {
        if (!openFiles.some(f => f.path === file.path)) {
            setOpenFiles([...openFiles, file]);
        }
        setCurrentFile(file);
    };

    const removeOpenFile = (path: string) => {
        setOpenFiles(openFiles.filter(file => file.path !== path));
        if (currentFile?.path === path) {
            setCurrentFile(openFiles.length > 1 ? openFiles[0] : null);
        }
    };

    return {
        openFiles,
        currentFile,
        addOpenFile,
        removeOpenFile,
        setOpenFiles,
        setCurrentFile
    };
};

export default useOpenFiles;