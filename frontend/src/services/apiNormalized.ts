import '../components/types/apiTypes';

export const normalizeDirectoryResponse = (response: any): any[] => {
  // Caso 1: Respuesta completa de Axios con data.directories
  if (response?.data?.directories && Array.isArray(response.data.directories)) {
    return response.data.directories;
  }
  
  // Caso 2: Respuesta directa con array en data
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  
  // Caso 3: Respuesta con array en propiedad directories
  if (Array.isArray(response?.directories)) {
    return response.directories;
  }
  
  // Caso 4: La propia respuesta es un array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Caso 5: Data contiene un array
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Caso 6: Respuesta inesperada - registro detallado
  console.warn('Formato de respuesta inesperado:', {
    responseType: typeof response,
    keys: response ? Object.keys(response) : 'null',
    dataKeys: response?.data ? Object.keys(response.data) : 'no data',
    sampleFirstItem: response?.data?.directories?.[0] || 'n/a'
  });
  
  return []; // Retorna array vacío como fallback seguro
};