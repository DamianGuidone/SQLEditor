
import React from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import EditorTabs from './components/EditorTabs';
import ToolEditor from './components/ToolEditor';
import { Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTerminal, faCog, faPuzzlePiece, faSave } from '@fortawesome/free-solid-svg-icons';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const sidebarTabs = [
    {
      icon: <FontAwesomeIcon icon={faFolderOpen} />,
      children: <FileExplorer onSelectFile={setSelectedFile} />
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
          <EditorTabs tabs={[]} activeTabPath={''} />
        </Box>
        
        {/* Sidebar derecho – Herramientas */}
        <Sidebar tabs={toolTabs} position='right' id="right" />
      </Box>
    </Box>
  );
};

export default App;