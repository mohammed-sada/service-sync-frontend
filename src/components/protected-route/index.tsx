'use client';

import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

import { useAuth } from 'src/contexts/AuthContext';
import { paths } from 'src/routes/paths';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect only if loading is false and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.replace(paths.loginBackground);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // Full viewport height
      >
        <CircularProgress size={60} />
      </Box>
    );
  }


  if (!isAuthenticated) {
    return null; // Prevent rendering children if not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
