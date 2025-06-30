import React, { useState } from 'react';
import logo from './logo.svg';
import useLocalStorageState from 'use-local-storage-state';
import FileExplorer from './components/FileExplorer';
import EditorSQL from './components/EditorSQL';
import Sidebar from './components/Sidebar';
import './App.css';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useLocalStorageState<boolean>('sidebar-expanded', {defaultValue: true});

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (    
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar con explorador de archivos */}
      <Sidebar 
        title="Explorador"
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        defaultWidth={300}>
        <FileExplorer onSelectFile={setSelectedFile} />
      </Sidebar>

      {/* Botón para mostrar el sidebar cuando está oculto */}
      {!isExpanded && (
        <button
          style={{ animation: !isExpanded ? 'fadeIn 0.3s ease forwards' : 'none' }}
          className="sidebar-toggle-button"
          onClick={toggleExpand}
          aria-label="Mostrar explorador"
        >🏸
        </button>
      )}

      <div style={{ flex: 1, padding: '1rem' }}>
        {selectedFile ? (
          <EditorSQL selectedFile={selectedFile} />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Selecciona un archivo para ver su contenido</h2>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
