import React, { useState } from 'react';

interface ExecutionControlsProps {
    onExecute: () => void;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({ onExecute }) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <div style={{
            padding: '0.5rem',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <label>Variable: </label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Valor de variable"
                />
            </div>

            <button onClick={onExecute}>▶️ Ejecutar</button>
        </div>
    );
};

export default ExecutionControls;