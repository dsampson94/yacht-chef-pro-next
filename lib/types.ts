export interface Option {
    id: string | number;
    name: string;
}

export interface Field {
    label: string;
    key: string;
    type?: 'text' | 'password' | 'number' | 'date' | 'select' | 'multiselect';
    options?: Option[] | String[];
    required?: boolean;
}
