'use client';

import React from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PDFDocument, rgb } from 'pdf-lib';
import { useResource } from '../lib/hooks/useResource';

interface Field {
    label: string;
    key: string;
}

interface ResourceListProps {
    resource: string;
    displayFields: Field[];
}

const ResourceList = ({ resource, displayFields }: ResourceListProps) => {
    const { items, deleteItem, error } = useResource(resource);
    const router = useRouter();

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleDownloadPDF = async (orderId: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            if (response.ok) {
                const order = await response.json();
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([600, 800]);
                const { height } = page.getSize();
                let y = height - 50;

                page.drawText('Order Details', { x: 50, y, size: 20, color: rgb(0, 0, 0) });
                y -= 40;

                page.drawText(`Order ID: ${order.id}`, { x: 50, y, size: 12 });
                y -= 20;
                page.drawText(`User: ${order.user.username}`, { x: 50, y, size: 12 });
                y -= 20;
                page.drawText(`Date: ${new Date(order.date).toLocaleDateString()}`, { x: 50, y, size: 12 });
                y -= 20;
                page.drawText(`Status: ${order.status}`, { x: 50, y, size: 12 });
                y -= 30;

                page.drawText('Order Items', { x: 50, y, size: 16, color: rgb(0, 0, 0) });
                y -= 20;
                order.orderItems.forEach(item => {
                    const ingredient = item.ingredient;
                    page.drawText(`Ingredient: ${ingredient.name}, Quantity: ${item.quantity}`, { x: 50, y, size: 12 });
                    y -= 20;
                    page.drawText(`  Supplier: ${item.supplier.name}, Location: ${item.location.city}, ${item.location.country}`, { x: 70, y, size: 12 });
                    y -= 20;
                });

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `order_${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('An error occurred while downloading the PDF.');
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h1>{resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
                <Link href={`/${resource.slice(0, -1)}/create`} passHref>
                    <Button variant="contained" color="primary">Create New {resource.slice(0, -1)}</Button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {displayFields.map(field => (
                                <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>{field.label}</TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                {displayFields.map(field => (
                                    <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>{item[field.key]}</TableCell>
                                ))}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => router.push(`/${resource.slice(0, -1)}/${item.id}`)}
                                    >
                                        Edit/View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteItem(item.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                    {resource === 'orders' && (
                                        <Button
                                            variant="contained"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => handleDownloadPDF(item.id)}
                                        >
                                            Download PDF
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ResourceList;
