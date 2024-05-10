import React from 'react';
import { Providers } from '@/app/providers';
import '@/styles/tailwind.css';
import { Header } from '@/components/Header';
import Background from '@/components/Background';

const MyApp = ({ Component, pageProps }) => {
    return (
        <Providers>
            <Header />
            <Component { ...pageProps } />
            <Background />
        </Providers>
    );
};

export default MyApp;
