import PDFDocument from 'pdfkit';

export function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', (err) => reject(err));

    // Adding header
    doc.fontSize(16).text('Quote Details', { align: 'center' });
    doc.moveDown();

    // Customer details
    doc.fontSize(12).text('Customer Details:', { underline: true });
    doc.text(`Name: ${data.customerDetails.name}`);
    doc.text(`Address: ${data.customerDetails.address}`);
    doc.text(`Email: ${data.customerDetails.email}`);
    doc.text(`Phone: ${data.customerDetails.phone}`);
    doc.moveDown();

    // Quote items table header
    doc.fontSize(14).text('Items:', { underline: true });
    doc.fontSize(12);
    doc.text('Item ID  Description  Quantity  Unit Price  Total Price', { bold: true });
    data.quoteItems.forEach(item => {
      doc.text(`${item.itemId}  ${item.description}  ${item.quantity}  ${item.unitPrice}  ${item.totalPrice}`);
    });
    doc.moveDown();

    // Subtotal, taxes, and total
    doc.text(`Subtotal: $${data.subtotal}`);
    doc.text(`Taxes (${data.taxes.taxName} at ${data.taxes.rate}%): $${data.taxes.amount}`);
    doc.text(`Total: $${data.total}`, { bold: true });
    doc.moveDown();

    // Additional notes
    doc.fontSize(12).text('Notes:', { underline: true });
    doc.text(data.notes || "No additional notes.");
    doc.moveDown();

    // Footer with date
    doc.fontSize(10).text(`Issued Date: ${data.issuedDate}`);
    doc.text(`Expiry Date: ${data.expiryDate}`);

    // Finish PDF generation
    doc.end();
  });
}
