'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { activateAccount } from 'src/api';
import { paths } from 'src/routes/paths';

const VerifyView = () => {
  const router = useRouter();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      try {
        // Send a GET request to verify the account
        await activateAccount(token as string);
        setSuccess(true);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || 'Something went wrong. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleGoToLogin = () => {
    router.push(paths.loginBackground);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : success ? (
        <>
          <Typography variant="h4" gutterBottom>
            Account Verified Successfully!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Your account has been successfully activated. You can now log in.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" color="error" gutterBottom>
            Verification Failed
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </>
      )}
    </Box>
  );
};

export default VerifyView;
