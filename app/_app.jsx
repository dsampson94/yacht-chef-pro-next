import { SessionProvider } from 'next-auth/react';
import '../styles/tailwind.css';
import React from 'react';

export const metadata = {
    title: {
        template: 'Yacht Chef Pro',
        default: 'Yacht Chef Pro - Home'
    },
    description: '',
    alternates: {
        types: {
            'application/rss+xml': `${ process.env.NEXT_PUBLIC_SITE_URL }/feed.xml`
        }
    }
};

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp;
