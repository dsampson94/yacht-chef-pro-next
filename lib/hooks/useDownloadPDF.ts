import { PDFDocument, rgb } from 'pdf-lib';

const useDownloadPDF = () => {
    const generatePDF = async (order: any) => {
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
        order.orderItems.forEach((item: any) => {
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
        a.download = `order_${order.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleDownloadPDF = async (orderId: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            if (response.ok) {
                const order = await response.json();
                await generatePDF(order);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('An error occurred while downloading the PDF.');
        }
    };

    return { handleDownloadPDF };
};

export default useDownloadPDF;
