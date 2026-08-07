'use client';
import { useRef } from 'react';
import Button from '@/components/ui/Button';

export default function GSTBill({ order, bill }) {
  const billRef = useRef(null);

  if (!bill || !order) {
    return (
      <div className="text-center py-8 text-luna-dark/60">
        Bill not available. Please generate the bill first.
      </div>
    );
  }

  const gstRate = 18;
  const taxableValue = bill.taxableValue || order.subtotal;
  const totalCgst = bill.cgst || Math.round((order.subtotal * (gstRate / 2)) / 100);
  const totalSgst = bill.sgst || Math.round((order.subtotal * (gstRate / 2)) / 100);
  const totalGst = totalCgst + totalSgst;
  const grandTotal = taxableValue + totalGst;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the bill.');
      return;
    }
    printWindow.document.write(`
      <html>
      <head>
        <title>GST Bill - ${bill.billNumber || order.orderId}</title>
        <style>
          @page { margin: 15mm; }
          body { font-family: 'Courier New', monospace; font-size: 12px; color: #333; }
          .bill-container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 2px 0; font-size: 11px; }
          .bill-title { text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
          .section { margin-bottom: 15px; }
          .section-title { font-weight: bold; border-bottom: 1px solid #999; padding-bottom: 4px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; font-size: 11px; }
          th { background: #f0f0f0; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .total-row td { font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #999; padding-top: 10px; }
          .amount-in-words { margin: 10px 0; font-style: italic; }
          .signature { margin-top: 30px; display: flex; justify-content: space-between; }
          .signature div { width: 200px; text-align: center; }
          .signature .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="header">
            <h1>LUNA Beauty</h1>
            <p>123, Fashion Street, Colaba, Mumbai - 400001</p>
            <p>GSTIN: ${bill.gstin || '27ABCDE1234F1Z5'} | Email: hello@lunabeauty.in</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div class="bill-title">TAX INVOICE / GST BILL</div>
          <div class="section">
            <table>
              <tr><td style="width:50%;border:none"><strong>Bill No:</strong> ${bill.billNumber}</td>
                  <td style="border:none"><strong>Date:</strong> ${new Date(bill.generatedAt || Date.now()).toLocaleDateString('en-IN')}</td></tr>
              <tr><td style="border:none"><strong>Order ID:</strong> ${order.orderId}</td>
                  <td style="border:none"><strong>Place of Supply:</strong> ${bill.placeOfSupply || order.shippingAddress?.state || 'Maharashtra'}</td></tr>
            </table>
          </div>
          <div class="section">
            <div class="section-title">Bill To:</div>
            <p>${order.shippingAddress?.name || 'Customer'}</p>
            <p>${order.shippingAddress?.address || ''}</p>
            <p>${order.shippingAddress?.city || ''} ${order.shippingAddress?.pincode || ''}</p>
            <p>Phone: ${order.shippingAddress?.phone || ''}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, idx) => {
                const itemTotal = item.price * item.quantity;
                const igst = Math.round((itemTotal * gstRate) / 100);
                const cgst = Math.round(igst / 2);
                const sgst = Math.round(igst / 2);
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.hsnCode || '3304'}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">${item.price.toLocaleString()}</td>
                    <td class="text-right">${itemTotal.toLocaleString()}</td>
                    <td class="text-right">${cgst}</td>
                    <td class="text-right">${sgst}</td>
                    <td class="text-right">${(itemTotal + cgst + sgst).toLocaleString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="5" class="text-right">Total</td>
                <td class="text-right">${taxableValue.toLocaleString()}</td>
                <td class="text-right">${totalCgst.toLocaleString()}</td>
                <td class="text-right">${totalSgst.toLocaleString()}</td>
                <td class="text-right">${grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <div class="amount-in-words">
            <strong>Amount in Words:</strong> Rupees ${numberToWords(grandTotal)} Only
          </div>
          <table>
            <tr><td><strong>Subtotal:</strong></td><td class="text-right">${taxableValue.toLocaleString()}</td></tr>
            <tr><td><strong>CGST @ 9%:</strong></td><td class="text-right">${totalCgst.toLocaleString()}</td></tr>
            <tr><td><strong>SGST @ 9%:</strong></td><td class="text-right">${totalSgst.toLocaleString()}</td></tr>
            <tr class="total-row"><td><strong>Grand Total:</strong></td><td class="text-right">${grandTotal.toLocaleString()}</td></tr>
          </table>
          <div class="signature">
            <div>
              <div class="line">Customer Signature</div>
            </div>
            <div>
              <div class="line">Authorised Signature</div>
            </div>
          </div>
          <div class="footer">
            <p>This is a computer generated GST invoice | Subject to Mumbai jurisdiction</p>
            <p>Thank you for shopping with LUNA Beauty!</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const content = billRef.current?.innerHTML || '';
    const blob = new Blob([`
      <html>
      <head><title>GST_Bill_${bill.billNumber || order.orderId}</title></head>
      <body>${content}</body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GST_Bill_${bill.billNumber || order.orderId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Bill Preview */}
      <div ref={billRef} className="bg-white rounded-xl p-6 shadow-sm border border-luna-peach/20 text-sm">
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h2 className="font-playfair text-2xl text-luna-dark">LUNA Beauty</h2>
          <p className="text-xs text-gray-500">123, Fashion Street, Colaba, Mumbai - 400001</p>
          <p className="text-xs text-gray-500">GSTIN: {bill.gstin || '27ABCDE1234F1Z5'}</p>
        </div>
        <h3 className="text-center font-bold text-lg mb-4">TAX INVOICE / GST BILL</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div><strong>Bill No:</strong> {bill.billNumber}</div>
          <div className="text-right"><strong>Date:</strong> {new Date(bill.generatedAt || Date.now()).toLocaleDateString('en-IN')}</div>
          <div><strong>Order ID:</strong> {order.orderId}</div>
          <div className="text-right"><strong>Place:</strong> {bill.placeOfSupply || order.shippingAddress?.state || 'Maharashtra'}</div>
        </div>

        <div className="mb-4 text-xs">
          <strong className="block border-b border-gray-300 pb-1 mb-2">Bill To:</strong>
          <p>{order.shippingAddress?.name || 'Customer'}</p>
          <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          <p>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          <p>Phone: {order.shippingAddress?.phone || order.whatsappNumber || 'N/A'}</p>
        </div>

        <table className="w-full text-xs border-collapse mb-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1.5 text-left">#</th>
              <th className="border border-gray-300 p-1.5 text-left">Item</th>
              <th className="border border-gray-300 p-1.5 text-center">Qty</th>
              <th className="border border-gray-300 p-1.5 text-right">Rate</th>
              <th className="border border-gray-300 p-1.5 text-right">Taxable</th>
              <th className="border border-gray-300 p-1.5 text-right">CGST 9%</th>
              <th className="border border-gray-300 p-1.5 text-right">SGST 9%</th>
              <th className="border border-gray-300 p-1.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => {
              const itemTotal = item.price * item.quantity;
              const igst = Math.round((itemTotal * gstRate) / 100);
              const cgst = Math.round(igst / 2);
              const sgst = Math.round(igst / 2);
              return (
                <tr key={idx}>
                  <td className="border border-gray-300 p-1.5">{idx + 1}</td>
                  <td className="border border-gray-300 p-1.5">{item.name}</td>
                  <td className="border border-gray-300 p-1.5 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-1.5 text-right">₹{item.price.toLocaleString()}</td>
                  <td className="border border-gray-300 p-1.5 text-right">₹{itemTotal.toLocaleString()}</td>
                  <td className="border border-gray-300 p-1.5 text-right">₹{cgst}</td>
                  <td className="border border-gray-300 p-1.5 text-right">₹{sgst}</td>
                  <td className="border border-gray-300 p-1.5 text-right">₹{(itemTotal + cgst + sgst).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-50">
              <td colSpan={4} className="border border-gray-300 p-1.5 text-right">Total</td>
              <td className="border border-gray-300 p-1.5 text-right">₹{taxableValue.toLocaleString()}</td>
              <td className="border border-gray-300 p-1.5 text-right">₹{totalCgst.toLocaleString()}</td>
              <td className="border border-gray-300 p-1.5 text-right">₹{totalSgst.toLocaleString()}</td>
              <td className="border border-gray-300 p-1.5 text-right">₹{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div className="text-right space-y-1 text-xs">
          <p>Subtotal: ₹{taxableValue.toLocaleString()}</p>
          <p>CGST @ 9%: ₹{totalCgst.toLocaleString()}</p>
          <p>SGST @ 9%: ₹{totalSgst.toLocaleString()}</p>
          <p className="font-bold text-base pt-1 border-t border-gray-300">Grand Total: ₹{grandTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={handlePrint} className="flex-1">
          🖨️ Print Bill
        </Button>
        <Button variant="outline" onClick={handleDownload} className="flex-1">
          ⬇️ Download Bill
        </Button>
      </div>
    </div>
  );
}

// Simple number to words converter
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  
  return convert(num);
}