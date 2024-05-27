import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

const MenuItem = ({ name, description }) => {
  return (
      <ListItem>
        <ListItemText primary={name} secondary={description} />
      </ListItem>
  );
};

export default MenuItem;
