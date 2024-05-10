'use client';

import React from 'react';
import { Box, Grid, IconButton, TextField } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import FormHeader from '@/components/invoices/components/FormHeader';

const InvoiceItemsForm = ({ items, onItemChange, onAddItem, onRemoveItem, onFormSave }) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormHeader
                title="Add Invoice Items"
                buttonText="Save"
                onButtonClick={ onFormSave } />
            <Box sx={ { overflowY: 'auto', maxHeight: '50vh' } }>
                { items.map((item, index) => (
                    <Grid container spacing={ 2 } key={ index } alignItems="center">
                        <Grid item xs={ 4 }>
                            <TextField
                                label="Item Name"
                                value={ item.name }
                                onChange={ (e) => onItemChange(index, 'name', e.target.value) }
                                fullWidth
                                size="small"
                                required
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={ 4 }>
                            <TextField
                                label="Amount"
                                value={ item.amount }
                                onChange={ (e) => onItemChange(index, 'amount', e.target.value) }
                                type="number"
                                fullWidth
                                size="small"
                                required
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={ 4 }>
                            { index === items.length - 1 ? (
                                <IconButton onClick={ onAddItem }>
                                    <AddCircleOutline />
                                </IconButton>
                            ) : (
                                <IconButton onClick={ () => onRemoveItem(index) }>
                                    <RemoveCircleOutline />
                                </IconButton>
                            ) }
                        </Grid>
                    </Grid>
                )) }
            </Box>
        </Box>
    );
};

export default InvoiceItemsForm;
