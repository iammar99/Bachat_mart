import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { message } from 'antd';

export const generateInvoice = async (order) => {
    const invoiceElement = document.getElementById(`invoice-${order._id}`);

    if (invoiceElement) {
        invoiceElement.style.display = 'block'; // Temporarily make it visible
    } else {
        message.error('Invoice element not found!');
        return;
    }

    try {
        const canvas = await html2canvas(invoiceElement, {
            scale: 2,  // Higher scale improves image quality
            useCORS: true,  // To handle CORS issues with images
            backgroundColor: '#ffffff',  // Set background color to white
        });

        if (canvas.width === 0 || canvas.height === 0) {
            message.error('Failed to capture invoice. The captured area is empty.');
            return;
        }

        const imgData = canvas.toDataURL('image/png');

        // Setup PDF with page dimensions
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;
        const contentHeight = pageHeight - margin * 2;

        // Calculate scaled dimensions to fit the page
        const canvasAspectRatio = canvas.height / canvas.width;
        let scaledWidth = contentWidth;
        let scaledHeight = contentWidth * canvasAspectRatio;

        if (scaledHeight > contentHeight) {
            scaledHeight = contentHeight;
            scaledWidth = scaledHeight * (canvas.width / canvas.height);
        }

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

        // Save the PDF
        const orderId = String(order._id || Date.now()).slice(-8);
        pdf.save(`LuxeFits-Invoice-${orderId}.pdf`);
        message.success('Invoice downloaded successfully!');

    } catch (error) {
        console.error('Error generating invoice:', error);
        message.error('An unexpected error occurred while generating the invoice.');
    } finally {
        // Hide the invoice after generating the PDF
        if (invoiceElement) {
            invoiceElement.style.display = 'none'; // Hide the invoice again
        }
    }
};
