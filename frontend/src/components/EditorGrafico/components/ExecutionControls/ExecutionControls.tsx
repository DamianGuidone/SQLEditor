import React, { useState } from 'react';
import styles from './ExecutionControls.module.css';

interface ExecutionControlsProps {
    onExecute: () => void;
    onVariablesChange: (variables: Record<string, any>) => void;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({ 
    onExecute, 
    onVariablesChange 
}) => {
    const [varName, setVarName] = useState('');
    const [varValue, setVarValue] = useState('');
    const [variables, setVariables] = useState<Record<string, any>>({});

    const handleAddVariable = () => {
        if (varName) {
        const newVars = { ...variables, [varName]: varValue };
        setVariables(newVars);
        onVariablesChange(newVars);
        setVarName('');
        setVarValue('');
        }
    };

    return (
        <div className={styles.controls}>
        <div className={styles.variables}>
            {Object.entries(variables).map(([name, value]) => (
            <span key={name} className={styles.variableTag}>
                {name}: {value}
                <button 
                onClick={() => {
                    const newVars = { ...variables };
                    delete newVars[name];
                    setVariables(newVars);
                    onVariablesChange(newVars);
                }}
                >
                ×
                </button>
            </span>
            ))}
        </div>
        
        <div className={styles.inputGroup}>
            <input
            type="text"
            placeholder="Variable"
            value={varName}
            onChange={(e) => setVarName(e.target.value)}
            />
            <input
            type="text"
            placeholder="Valor"
            value={varValue}
            onChange={(e) => setVarValue(e.target.value)}
            />
            <button onClick={handleAddVariable}>
            <i className="fas fa-plus"></i>
            </button>
        </div>
        
        <button 
            className={styles.executeButton}
            onClick={onExecute}
        >
            <i className="fas fa-play"></i> Ejecutar
        </button>
        </div>
    );
};

export default ExecutionControls;