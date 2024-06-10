import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getOrderDetails = async (orderId) => {
    return prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            orderItems: {
                include: {
                    ingredient: true,
                    supplier: true,
                    location: true,
                },
            },
        },
    });
};

type OrderWithDetails = Awaited<ReturnType<typeof getOrderDetails>>;

export const generatePdf = async (order: OrderWithDetails): Promise<string> => {
    if (!order) throw new Error('Order not found');

    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${order.id}.pdf`);

    const supplierDetails = order.orderItems.map((item) => ({
        name: item.supplier.name,
        email: item.supplier.email,
        phone: item.supplier.phone,
        location: `${item.location.city}, ${item.location.country}`,
    }));

    const uniqueSuppliersMap = new Map();
    supplierDetails.forEach((supplier) => {
        const key = `${supplier.name}-${supplier.email}`;
        if (!uniqueSuppliersMap.has(key)) {
            uniqueSuppliersMap.set(key, supplier);
        }
    });
    const uniqueSuppliers = Array.from(uniqueSuppliersMap.values());

    const docDefinition = {
        content: [
            { text: `Order ID: ${order.id}`, style: 'header' },
            { text: `User: ${order.user.username}`, style: 'subheader' },
            { text: `Date: ${order.date}`, style: 'subheader' },
            { text: `Status: ${order.status}`, style: 'subheader' },
            { text: 'Supplier Details:', style: 'subheader' },
            {
                table: {
                    widths: ['*', '*', '*', '*'],
                    body: [
                        ['Name', 'Email', 'Phone', 'Location'],
                        ...uniqueSuppliers.map((supplier) => [
                            supplier.name,
                            supplier.email,
                            supplier.phone,
                            supplier.location,
                        ]),
                    ],
                },
                layout: 'lightHorizontalLines',
            },
            { text: 'Order Items:', style: 'subheader', margin: [0, 10, 0, 10] },
            {
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        ['Ingredient', 'Weight', 'Price', 'Quantity'],
                        ...order.orderItems.map((item) => [
                            item.ingredient.name,
                            `${item.ingredient.weight} kg`,
                            `$${item.ingredient.price.toFixed(2)}`,
                            item.quantity,
                        ]),
                    ],
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#aaa',
                    vLineColor: () => '#aaa',
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5],
            },
        },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);

    pdfDoc.getBuffer((buffer) => {
        if (!fs.existsSync(path.dirname(pdfPath))) {
            fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        }
        fs.writeFileSync(pdfPath, buffer);
    });

    return `/pdfs/${order.id}.pdf`;
};
