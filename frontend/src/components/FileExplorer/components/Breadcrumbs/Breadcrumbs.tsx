import React, { useContext } from 'react';
import styles from './Breadcrumbs.module.css';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

const Breadcrumbs: React.FC = () => {
    const { currentDirectory, currentBasePath, navigateToDirectory } = useFileExplorerContext();

    const pathParts = currentDirectory.split('/').filter(part => part.length > 0);
    
    const handleClick = (index: number) => {
        const newPath = pathParts.slice(0, index + 1).join('/');
        navigateToDirectory(newPath);
    };

    return (
        <div className={styles.breadcrumbs}>
        <span 
            className={styles.crumb} 
            onClick={() => navigateToDirectory('')}
            title={currentBasePath}
        >
            <i className="fas fa-home"></i> Root
        </span>
        
        {pathParts.map((part, index) => (
            <React.Fragment key={index}>
            <span className={styles.separator}>/</span>
            <span 
                className={styles.crumb}
                onClick={() => handleClick(index)}
            >
                {part}
            </span>
            </React.Fragment>
        ))}
        </div>
    );
};

export default Breadcrumbs;