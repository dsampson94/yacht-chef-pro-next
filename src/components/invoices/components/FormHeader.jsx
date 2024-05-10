import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const FormHeader = ({ title, buttonText, onButtonClick }) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
            <Typography variant="h5">
                {title}
            </Typography>
            <Button variant="contained" color="primary" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </Box>
    );
};

export default FormHeader;
