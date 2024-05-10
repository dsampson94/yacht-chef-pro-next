import React from 'react';
import { Box, TextField } from '@mui/material';
import FormHeader from '@/components/invoices/components/FormHeader';

const InvoiceDetailsForm = ({ userName, setUserName, clientName, setClientName, invoiceName, setInvoiceName, invoiceNumber, setInvoiceNumber, onFormSave }) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormHeader
                title="Let's begin!"
                buttonText="Save"
                onButtonClick={ onFormSave }
            />
            <Box sx={ { overflowY: 'auto', maxHeight: '50vh' } }>
                <TextField
                    label="Invoice Name"
                    value={ invoiceName }
                    onChange={ (e) => setInvoiceName(e.target.value) }
                    fullWidth
                    size="small"
                    required
                    margin="dense"
                />
                <TextField
                    label="Invoice Number"
                    value={ invoiceNumber }
                    onChange={ (e) => setInvoiceNumber(e.target.value) }
                    fullWidth
                    size="small"
                    required
                    margin="dense"
                />
                <TextField
                    label="My Name"
                    value={ userName }
                    onChange={ (e) => setUserName(e.target.value) }
                    fullWidth
                    size="small"
                    required
                    margin="dense"
                />
                <TextField
                    label="Their Name"
                    value={ clientName }
                    onChange={ (e) => setClientName(e.target.value) }
                    fullWidth
                    size="small"
                    required
                    margin="dense"
                />
                {/* You can re-enable these components when they're ready to be included */ }
                {/*<InvoiceItemsForm
                items={items}
                onItemChange={handleItemChange}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
            />*/ }
                {/*<Button type="submit" variant="contained" color="primary" sx={ { mt: 2 } }>*/ }
                {/*    Generate PDF*/ }
                {/*</Button>*/ }
            </Box>
        </Box>
    );
};

export default InvoiceDetailsForm;
