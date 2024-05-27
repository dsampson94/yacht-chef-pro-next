import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const { data: session, status } = useSession();

        useEffect(() => {
            if (status === 'unauthenticated') {
                signIn();
            }
        }, [status]);

        if (status === 'loading') {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (session) {
            return <WrappedComponent {...props} />;
        }

        return null;
    };

    AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthComponent;
};

export default withAuth;
