import React, { useContext, useMemo } from 'react';
import styles from './Breadcrumbs.module.css';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

const Breadcrumbs: React.FC = () => {
    const { currentDirectory, currentBasePath, navigateToDirectory } = useFileExplorerContext();

    
    const pathParts = useMemo(() => {
        const parts = currentBasePath.split(/[\\/]/);
        return parts.filter(Boolean);
    }, [currentBasePath]);
    
    const handleClick = (index: number) => {
        const newPath = pathParts.slice(0, index + 1).join('/');
        navigateToDirectory(newPath);
    };

    return (
        <div className={styles.breadcrumbs}>
            {pathParts.map((part, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className={styles.separator}>/</span>}
                    <span className={styles.part}>{part}</span>
                </React.Fragment>
            ))}
            {currentDirectory && (
                <>
                    <span className={styles.separator}>/</span>
                    <span className={styles.part}>{currentDirectory}</span>
                </>
            )}
        </div>
    );
};

export default Breadcrumbs;