import React, { useState, useEffect } from 'react'
import GridWrapper from '../GridWrapper/GridWrapper'
import BasicSnackbar from '../BasicSnackbar/BasicSnackbar';
import BasicCard from '../BasicCard/BasicCard';
import UsersList from '../../Pages/UsersList';

const Storage = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

    return (
      <GridWrapper>
        <BasicCard 
          content={<UsersList onError={() => setOpen(true)} />}
        />
        <BasicSnackbar
          open={open}
          severity="error"
          message="Data couldn't be fetched"
          onClose={handleClose}
        />
      </GridWrapper>
    )
}

export default Storage
