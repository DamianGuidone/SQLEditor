import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/api';
import { FileSystemItem, DirectoryContents, FileOperation, FileOperationParams } from '../types/explorerTypes';

const useFileExplorer = () => {
    const [currentBasePath, setCurrentBasePath] = useState<string>('');
    const [currentDirectory, setCurrentDirectory] = useState<string>('');
    const [directoryContents, setDirectoryContents] = useState<DirectoryContents>({
        directories: [],
        files: []
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDirectoryContents = useCallback(async (basePath: string, path: string) => {
        setLoading(true);
        setError(null);
        
        try {
        const response = await apiClient.get('/api/files', {
            params: { path }
        });
        
        const items = response.data.files || [];
        
        const contents: DirectoryContents = {
            directories: items.filter((item: FileSystemItem) => item.isDirectory),
            files: items.filter((item: FileSystemItem) => !item.isDirectory)
        };
        
        setDirectoryContents(contents);
        localStorage.setItem('lastBasePath', basePath);
        localStorage.setItem('lastDirectory', path);
        } catch (err) {
            setError('Failed to load directory contents');
            console.error('Error fetching directory contents:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const selectBasePath = useCallback((basePath: string) => {
        setCurrentBasePath(basePath);
        setCurrentDirectory('');
    }, []);

    const navigateToDirectory = useCallback((path: string) => {
        setCurrentDirectory(path);
        fetchDirectoryContents(currentBasePath, path);
    }, [currentBasePath, fetchDirectoryContents]);

    const refreshDirectory = useCallback(() => {
        fetchDirectoryContents(currentBasePath, currentDirectory);
    }, [currentBasePath, currentDirectory, fetchDirectoryContents]);

    const performFileOperation = useCallback(async (params: FileOperationParams): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.post('/api/operations', params);
            
            if (response.data.success) {
                refreshDirectory();
                return true;
            }
            return false;
        } catch (err) {
            setError(`Failed to perform ${params.operation} operation`);
            console.error('Error performing file operation:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [refreshDirectory]);

    useEffect(() => {
        if (currentBasePath && currentDirectory !== undefined) {
            fetchDirectoryContents(currentBasePath, currentDirectory);
        }
    }, [currentBasePath, currentDirectory, fetchDirectoryContents]);

    return {
        currentDirectory,
        currentBasePath,
        directoryContents,
        loading,
        error,
        navigateToDirectory,
        selectBasePath,
        refreshDirectory,
        performFileOperation,
        fetchDirectoryContents,
    };
};

export default useFileExplorer;