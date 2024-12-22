'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



import { Snackbar, SnackbarCloseReason } from '@mui/material';
import React from 'react';
import { updateUserProfile } from 'src/api';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useAuth } from 'src/contexts/AuthContext';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function EcommerceAccountPersonalView() {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const openSnackbar = () => {
    setOpen(true);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const UserProfileSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      )
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot exceed 20 characters'), email: Yup.string().email('Invalid email address').required('Email is required'),
    name: Yup.string().required('Name is required'),
    address: Yup.string().nullable(),
    contact: Yup.string().nullable(),
    avatar: Yup.string().nullable(),
  });

  const defaultValues = {
    username: user?.username || '',
    email: user?.email || '',
    name: user?.name || '',
    address: user?.address || '',
    contact: user?.contact || '',
    avatar: user?.avatar || null,
  };

  const methods = useForm({
    resolver: yupResolver(UserProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = (data as Record<string, any>)[key];
        if (value) {
          formData.append(key, value);
        }
      });

      await updateUserProfile(formData);
      openSnackbar();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Personal
      </Typography>

      <Box
        rowGap={2.5}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        <RHFTextField name="name" label="Name" />

        <RHFTextField name="username" label="Username" />

        <RHFTextField name="email" label="Email Address" />

        <RHFTextField name="address" label="Phone Number" />

        <RHFTextField name="contact" label="Contact" />
      </Box>


      <LoadingButton
        sx={{ marginTop: 5 }}
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Save Changes
      </LoadingButton>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Updated Successfully"
      />
    </FormProvider>
  );
}
