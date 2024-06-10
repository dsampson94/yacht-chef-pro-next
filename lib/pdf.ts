import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function createPDF(order: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    const fontSize = 12;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let yPosition = height - fontSize * 2;

    page.drawText(`Order ID: ${order.id}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
    });

    yPosition -= fontSize * 2;
    page.drawText(`User: ${order.user.username}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
    });

    yPosition -= fontSize * 2;
    page.drawText(`Date: ${new Date(order.date).toLocaleDateString()}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
    });

    yPosition -= fontSize * 2;
    page.drawText(`Status: ${order.status}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
    });

    yPosition -= fontSize * 2;
    page.drawText(`Order Items:`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
    });

    order.orderItems.forEach((item: any, index: number) => {
        yPosition -= fontSize * 2;
        page.drawText(`${index + 1}. Ingredient: ${item.ingredient.name}, Supplier: ${item.supplier.name}, Location: ${item.location.city}, Quantity: ${item.quantity}`, {
            x: 70,
            y: yPosition,
            size: fontSize,
            font,
        });
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
