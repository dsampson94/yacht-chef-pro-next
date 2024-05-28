import React from 'react';
import '../styles/tailwind.css';

export const metadata = {
    title: 'Yacht Chef Pro',
    description: 'Yacht Chef Pro - Home',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
