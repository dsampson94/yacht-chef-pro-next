import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb } from 'pdf-lib';
import prisma from '../../../lib/prisma';

export const config = {
    api: {
        bodyParser: false,
    },
};

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                menu: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: {
                                    include: {
                                        ingredient: {
                                            include: {
                                                supplierIngredients: {
                                                    include: { supplier: true, location: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderItems: {
                    include: {
                        ingredient: {
                            include: {
                                supplierIngredients: {
                                    include: { supplier: true, location: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

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

        page.drawText('Menu', { x: 50, y, size: 16, color: rgb(0, 0, 0) });
        y -= 20;

        if (order.menu) {
            page.drawText(`Menu Name: ${order.menu.name}`, { x: 50, y, size: 14 });
            y -= 20;
            order.menu.recipes.forEach(recipe => {
                page.drawText(`Recipe: ${recipe.name}`, { x: 50, y, size: 12 });
                y -= 20;
                recipe.ingredients.forEach(ri => {
                    const ingredient = ri.ingredient;
                    page.drawText(`Ingredient: ${ingredient.name}, Weight: ${ingredient.weight}, Price: ${ingredient.price}`, { x: 70, y, size: 12 });
                    y -= 20;
                    ingredient.supplierIngredients.forEach(si => {
                        page.drawText(`  Supplier: ${si.supplier.name}, Location: ${si.location.city}, ${si.location.country}`, { x: 90, y, size: 12 });
                        y -= 20;
                    });
                });
            });
        }

        y -= 30;
        page.drawText('Order Items', { x: 50, y, size: 16, color: rgb(0, 0, 0) });
        y -= 20;
        order.orderItems.forEach(item => {
            const ingredient = item.ingredient;
            page.drawText(`Ingredient: ${ingredient.name}, Quantity: ${item.quantity}`, { x: 50, y, size: 12 });
            y -= 20;
            const supplierIngredient = ingredient.supplierIngredients.find(si => si.supplierId === item.supplierId && si.locationId === item.locationId);
            if (supplierIngredient) {
                page.drawText(`  Supplier: ${supplierIngredient.supplier.name}, Location: ${supplierIngredient.location.city}, ${supplierIngredient.location.country}`, { x: 70, y, size: 12 });
                y -= 20;
            }
        });

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=order_${orderId}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Error generating PDF' });
    }
};
