'use client';

import React, { useState } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface DateBarProps {
    onWeekChange: (startDate: Date, endDate: Date) => void;
}

const DateBar: React.FC<DateBarProps> = ({ onWeekChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        const startDate = startOfWeek(date, { weekStartsOn: 1 });
        const endDate = endOfWeek(date, { weekStartsOn: 1 });
        onWeekChange(startDate, endDate);
    };

    const handlePrevWeek = () => {
        handleDateChange(subWeeks(selectedDate, 1));
    };

    const handleNextWeek = () => {
        handleDateChange(addWeeks(selectedDate, 1));
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <IconButton onClick={handlePrevWeek}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Select Week:</Typography>
            <TextField
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
            />
            <IconButton onClick={handleNextWeek}>
                <ArrowForwardIcon />
            </IconButton>
            <Button variant="contained" onClick={() => handleDateChange(new Date())}>
                Today
            </Button>
        </Box>
    );
};

export default DateBar;
