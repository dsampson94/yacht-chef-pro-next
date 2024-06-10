import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getOrderDetails = async (orderId: string) => {
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

    const docDefinition = {
        content: [
            { text: `Order ID: ${order.id}`, style: 'header' },
            { text: `User: ${order.user.username}`, style: 'subheader' },
            { text: `Date: ${order.date}`, style: 'subheader' },
            { text: `Status: ${order.status}`, style: 'subheader' },
            { text: 'Order Items:', style: 'subheader' },
            ...order.orderItems.map((item, index) => ({
                text: `${index + 1}. Ingredient: ${item.ingredient.name}, Quantity: ${item.quantity}, Supplier: ${item.supplier.name}, Location: ${item.location.city}, ${item.location.country}`
            })),
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            }
        }
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
