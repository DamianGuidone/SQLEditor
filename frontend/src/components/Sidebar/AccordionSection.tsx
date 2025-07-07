import React, { useState } from 'react';
import styles from './AccordionSection.module.css';

interface AccordionSectionProps {
    title: string;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ 
    title, 
    defaultExpanded = true,
    children 
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className={styles.accordion}>
            <div 
                className={styles.header}
                onClick={() => setExpanded(!expanded)}
            >
                <span>{title}</span>
                <i className={`fas fa-chevron-${expanded ? 'down' : 'right'}`}></i>
            </div>
            {expanded && (
                <div className={styles.content}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionSection;