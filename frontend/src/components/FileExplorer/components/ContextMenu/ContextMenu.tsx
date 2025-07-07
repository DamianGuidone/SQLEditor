import React from 'react';
import styles from './ContextMenu.module.css';

interface ContextMenuItem {
    label: string;
    icon: string;
    action: () => void;
}

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    items: ContextMenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, items }) => {
    React.useEffect(() => {
        const handleClickOutside = () => {
        onClose();
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div 
        className={styles.contextMenu}
        style={{
            left: x,
            top: y
        }}
        onClick={(e) => e.stopPropagation()}
        >
        {items.map((item, index) => (
            <div 
            key={index}
            className={styles.menuItem}
            onClick={(e) => {
                e.stopPropagation();
                item.action();
                onClose();
            }}
            >
            <i className={`${item.icon} ${styles.menuIcon}`}></i>
            <span>{item.label}</span>
            </div>
        ))}
        </div>
    );
};

export default ContextMenu;