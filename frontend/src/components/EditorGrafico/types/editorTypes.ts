export interface ExecutionResult {
    data?: any;
    error?: string;
    executionTime?: number;
    rowCount?: number;
}

export interface SqlVariable {
    name: string;
    value: any;
    type?: string;
}

export interface EditorTab {
    path: string;
    content: string;
    isDirty: boolean;
    chartData?: any;
    lastSaved?: Date;
}