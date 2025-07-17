
import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import FileExplorer from './components/FileExplorer/FileExplorer';
import EditorTabs from './components/EditorGrafico/EditorTabs';
import { FileExplorerProvider } from './components/FileExplorer/contexts/FileExplorerContext';
import ToolEditor from './components/ToolEditor';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTerminal, faCog, faPuzzlePiece, faSave } from '@fortawesome/free-solid-svg-icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
//import '@fortawesome/fontawesome-free/css/all.min.css';

const App: React.FC = () => {

  const sidebarTabs = [
    {
      icon: <FontAwesomeIcon icon={faFolderOpen} />,
      children:
                  <DndProvider backend={HTML5Backend}>
                    <FileExplorer />
                  </DndProvider>
    },
    {
      icon: <FontAwesomeIcon icon={faTerminal} />,
      children: <div>Contenido de log</div>
    },
    {
      icon: <FontAwesomeIcon icon={faCog} />,
      children: <div>Contenido de configuración</div>
    }
  ];

  const toolTabs = [
    {
      icon: <FontAwesomeIcon icon={faPuzzlePiece} />,
      children: <ToolEditor onDragStart={() => {}} />
    },
    {
      icon: <FontAwesomeIcon icon={faSave} />,
      children: <div>Guardado automático</div>
    }
  ];

  return (
    <FileExplorerProvider>
      <Box sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}>
        {/* Sidebar izquierdo – Explorador de archivos */}
        <Sidebar tabs={sidebarTabs} position='left' id="left" />
        
        {/* Contenedor principal con editor y sidebar derecho */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          minWidth: 0, // Importante para evitar desbordamiento
        }}>
          {/* Editor central */}
          <Box sx={{
            flex: 1,
            minWidth: 0, // Importante para evitar desbordamiento
            overflow: 'hidden'
          }}>
            <EditorTabs />
          </Box>
          
          {/* Sidebar derecho – Herramientas */}
          <Sidebar tabs={toolTabs} position='right' id="right" />
        </Box>
      </Box>
    </FileExplorerProvider>
  );
};

export default App;