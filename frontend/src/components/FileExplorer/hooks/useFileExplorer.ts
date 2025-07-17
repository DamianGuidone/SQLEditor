import { useCallback, useEffect, useState } from "react";
import apiClient, { getDirectoryContents } from "../../../services/api";
import { DirectoryContents, FileOperationParams, FileSystemItem } from "../types/explorerTypes";

const useFileExplorer = () => {
    const [currentBasePath, setCurrentBasePath] = useState<string>('');
    const [currentDirectory, setCurrentDirectory] = useState<string>('');
    const [directoryContents, setDirectoryContents] = useState<DirectoryContents>({
        directories: [],
        files: []
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDirectoryContents = useCallback(async (basePath: string, path: string): Promise<FileSystemItem[]> => {
        setLoading(true);
        setError(null);
        try {
            const items = await getDirectoryContents(basePath, path);
            
            // Transformar la respuesta si es necesario
            return items.map(item => ({
                ...item,
                path: item.path.replace(/\\/g, '/') // Normalizar rutas
            }));
        } catch (error) {
            setError(`Error al cargar el directorio: ${error}`);
            console.error('Error fetching directory contents:', {
                basePath,
                path,
                error
            });
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Nueva función para cargar y actualizar el estado
    const loadAndSetDirectoryContents = useCallback(async (basePath: string, path: string) => {
        const items = await fetchDirectoryContents(basePath, path);
        setDirectoryContents({
            directories: items.filter(item => item.isDirectory),
            files: items.filter(item => !item.isDirectory)
        });
    }, [fetchDirectoryContents]);

    const selectBasePath = useCallback((basePath: string) => {
        setCurrentBasePath(basePath);
        setCurrentDirectory('');
        loadAndSetDirectoryContents(basePath, '');
    }, [loadAndSetDirectoryContents]);

    const navigateToDirectory = useCallback((path: string) => {
        setCurrentDirectory(path);
        loadAndSetDirectoryContents(currentBasePath, path);
    }, [currentBasePath, loadAndSetDirectoryContents]);

    const refreshDirectory = useCallback(() => {
        loadAndSetDirectoryContents(currentBasePath, currentDirectory);
    }, [currentBasePath, currentDirectory, loadAndSetDirectoryContents]);

    const performFileOperation = useCallback(async (params: FileOperationParams): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.post('/api/operations', params);
            
            if (response.data.success) {
                await refreshDirectory();
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

    // Efecto para cargar el directorio cuando cambia el basePath
    useEffect(() => {
        if (currentBasePath) {
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
        fetchDirectoryContents, // Ahora retorna Promise<FileSystemItem[]>
        loadAndSetDirectoryContents, // Nueva función para uso interno
        setError,
    };
};

export default useFileExplorer;