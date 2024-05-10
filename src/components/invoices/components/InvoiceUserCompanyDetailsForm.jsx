import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import FormHeader from '@/components/invoices/components/FormHeader';

const InvoiceUserCompanyDetailsForm = ({ userDetails, setUserDetails, companyDetails, setCompanyDetails, onFormSave }) => {
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    return (
        <Box display="flex" flexDirection="column">
            <FormHeader
                title="Add My Details"
                buttonText="Save"
                onButtonClick={ onFormSave } />
            <Box sx={ { overflowY: 'auto', maxHeight: '47vh' } }>
                <Grid container spacing={ 1 }>
                    {/* User Details */ }
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="firstName"
                            label="First Name"
                            value={ userDetails.firstName }
                            onChange={ handleUserChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="lastName"
                            label="Last Name"
                            value={ userDetails.lastName }
                            onChange={ handleUserChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            name="email"
                            label="Email Address"
                            value={ userDetails.email }
                            onChange={ handleUserChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="username"
                            label="Username"
                            value={ userDetails.username }
                            onChange={ handleUserChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="password"
                            label="Password"
                            value={ userDetails.password }
                            onChange={ handleUserChange }
                            type="password"
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    {/* Company Details */ }
                    <Grid item xs={ 12 }>
                        <Typography variant="h5" sx={ { mt: 4, mb: 2 } }>Add My Company Details</Typography>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            name="name"
                            label="Company Name"
                            value={ companyDetails.name }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    {/* Add other company details fields here */ }
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="taxId"
                            label="Tax ID"
                            value={ companyDetails.taxId }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            name="phoneNumber"
                            label="Phone Number"
                            value={ companyDetails.phoneNumber }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            name="address"
                            label="Address"
                            value={ companyDetails.address }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            name="website"
                            label="Website"
                            value={ companyDetails.website }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            name="email"
                            label="Company Email"
                            value={ companyDetails.email }
                            onChange={ handleCompanyChange }
                            fullWidth
                            size="small"
                            margin="dense"
                        />
                    </Grid>
                    {/*<Grid item xs={ 12 } sx={ { mt: 2 } }>*/ }
                    {/*    <Button*/ }
                    {/*        variant="contained"*/ }
                    {/*        color="primary"*/ }
                    {/*        onClick={ handleSubmit }*/ }
                    {/*    >*/ }
                    {/*        Save Details*/ }
                    {/*    </Button>*/ }
                    {/*</Grid>*/ }
                </Grid>
            </Box>
        </Box>
    );
};

export default InvoiceUserCompanyDetailsForm;
