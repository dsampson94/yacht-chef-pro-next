'use client';

import React, { ChangeEvent } from 'react';
import {
    Autocomplete,
    AutocompleteChangeReason,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import { Field, Option } from '../lib/types';

interface Params {
    fields: Field[];
    item: { [key: string]: any };
    errors: { [key: string]: string };
    handleFieldChange: (key: string, value: any, field: Field) => void;
}

const renderTextField = (
    field: Field,
    value: any,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
    errors: { [key: string]: string }
) => (
    <>
        <TextField
            label={field.label}
            value={value}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type={field.type}
        />
        {errors[field.key] && <div style={{ color: 'red' }}>{errors[field.key]}</div>}
    </>
);

const renderSelectField = (
    field: Field,
    value: any,
    handleChange: (event: SelectChangeEvent) => void,
    errors: { [key: string]: string }
) => (
    <FormControl fullWidth margin="normal">
        <InputLabel>{field.label}</InputLabel>
        <Select
            label={field.label}
            value={value}
            onChange={handleChange}
        >
            {field.options?.map(option => (
                <MenuItem key={option.id} value={option.id}>
                    {option.name}
                </MenuItem>
            ))}
        </Select>
        {errors[field.key] && <div style={{ color: 'red' }}>{errors[field.key]}</div>}
    </FormControl>
);

const renderMultiSelectField = (
    field: Field,
    value: any,
    handleChange: (event: React.ChangeEvent<{}>, newValue: Option[] | null, reason: AutocompleteChangeReason) => void,
    errors: { [key: string]: string }
) => (
    <Autocomplete
        multiple
        options={field.options || []}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={handleChange}
        renderTags={(value: Option[], getTagProps) =>
            value.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
            ))
        }
        renderInput={(params) => (
            <TextField
                {...params}
                label={field.label}
                margin="normal"
                fullWidth
            />
        )}
    />
);

const fieldRenderers: { [key: string]: any } = {
    text: renderTextField,
    number: renderTextField,
    date: renderTextField,
    select: renderSelectField,
    multiselect: renderMultiSelectField,
};

const DynamicForm: React.FC<Params> = ({ fields, item, errors, handleFieldChange }) => (
    <>
        {fields.map(field => (
            <div key={field.key}>
                {fieldRenderers[field.type || 'text'](
                    field,
                    item?.[field.key] || (field.type === 'multiselect' ? [] : ''),
                    (e: any, newValue: any) => handleFieldChange(field.key, field.type === 'multiselect' ? newValue : e.target.value, field),
                    errors
                )}
            </div>
        ))}
    </>
);

export default DynamicForm;
