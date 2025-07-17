// frontend/src/services/api.ts
import axios, { AxiosProgressEvent, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import '../components/types/apiTypes';
import { FileSystemItem } from '../components/FileExplorer/types/explorerTypes';

// Crear instancia de axios con tipos correctos
const apiClient = axios.create({
    baseURL: 'http://localhost:5006',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para solicitudes
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.data && config.headers?.['Content-Type'] === 'application/json') {
        config.data = JSON.stringify(config.data);
    }
    return config;
});

// Interceptor para respuestas
// En tu archivo apiClient.ts
apiClient.interceptors.response.use(
    response => {
        // Normaliza respuestas exitosas
        if (response.data && !Array.isArray(response.data)) {
            if (!response.data.directories && Object.keys(response.data).length === 1) {
                // Si data tiene solo una propiedad, asumir que es la que contiene los datos
                const firstKey = Object.keys(response.data)[0];
                if (Array.isArray(response.data[firstKey])) {
                    response.data.directories = response.data[firstKey];
                }
            }
        }
        return response;
    },
    error => {
        // Normaliza errores
        return Promise.reject({
            message: error.message,
            response: error.response,
            data: error.response?.data
        });
    }
);

// Tipos para upload
export interface UploadProgressEvent {
  loaded: number;
  total?: number;
  progress: number;
}

// Función para subir archivos con tipos correctos
export const uploadFile = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  await apiClient.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Función para descargar archivos con tipos correctos
export const downloadFile = async (path: string): Promise<Blob> => {
  const response = await apiClient.get('/api/download', {
    params: { path: encodeURIComponent(path) },
    responseType: 'blob',
  });
  return response.data;
};


export const getDirectoryContents = async (basePath: string, path: string): Promise<FileSystemItem[]> => {
    try {
        // Verifica si el path está vacío para evitar doble barra
        const apiPath = path ? `${basePath}/${path}` : basePath;
        
        const response = await apiClient.get('/api/files', {
            params: {
                path: apiPath
            }
        });
        
        // Asegúrate que la respuesta coincide con tu backend
        return response.data.files || [];
    } catch (error) {
        console.error('API Error fetching directory contents:', {
            basePath,
            path,
            error
        });
        throw error;
    }
};

export default apiClient;