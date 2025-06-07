let itemIdCounter = 0;

function addItem() {
  const itemsContainer = document.getElementById('items');
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item';
  itemDiv.id = `item-${itemIdCounter}`;

  itemDiv.innerHTML = `
    <label>Item Name: <input type="text" class="itemName"></label>
    <label>Price (per unit): <input type="number" class="itemPrice" step="0.01"></label>
    <label>Quantity: <input type="number" class="itemQuantity"></label>
    <label>Discount (%): <input type="number" class="itemDiscount" step="0.01"></label>
    <button onclick="removeItem(${itemIdCounter})">Remove Item</button>
  `;

  itemsContainer.appendChild(itemDiv);
  itemIdCounter++;
}

function removeItem(id) {
  const itemDiv = document.getElementById(`item-${id}`);
  if (itemDiv) {
    itemDiv.remove();
  }
}

function saveBill() {
  const buyerName = document.getElementById('buyerName').value;
  const sgstRate = parseFloat(document.getElementById('sgst').value) || 0;
  const cgstRate = parseFloat(document.getElementById('cgst').value) || 0;
  const igstRate = parseFloat(document.getElementById('igst').value) || 0;

  if (!buyerName) {
    alert('Please enter buyer name.');
    return;
  }

  const itemElements = document.querySelectorAll('.item');
  if (itemElements.length === 0) {
    alert('Please add at least one item.');
    return;
  }

  const items = [];
  let subtotal = 0;

  itemElements.forEach(item => {
    const name = item.querySelector('.itemName').value;
    const price = parseFloat(item.querySelector('.itemPrice').value) || 0;
    const quantity = parseInt(item.querySelector('.itemQuantity').value) || 0;
    const discountRate = parseFloat(item.querySelector('.itemDiscount').value) || 0;

    const gross = price * quantity;
    const discount = (gross * discountRate) / 100;
    const net = gross - discount;

    subtotal += net;

    items.push({
      name,
      price: price.toFixed(2),
      quantity,
      discountRate,
      discountAmount: discount.toFixed(2),
      netAmount: net.toFixed(2)
    });
  });

  // Calculate GST
  const sgstAmount = (subtotal * sgstRate) / 100;
  const cgstAmount = (subtotal * cgstRate) / 100;
  const igstAmount = (subtotal * igstRate) / 100;
  const totalGST = sgstAmount + cgstAmount + igstAmount;
  const totalAmount = subtotal + totalGST;

  const bill = {
    buyerName,
    items,
    subtotal: subtotal.toFixed(2),
    sgstRate,
    sgstAmount: sgstAmount.toFixed(2),
    cgstRate,
    cgstAmount: cgstAmount.toFixed(2),
    igstRate,
    igstAmount: igstAmount.toFixed(2),
    totalGST: totalGST.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    dateTime: new Date().toLocaleString()
  };

  localStorage.setItem('lastBill', JSON.stringify(bill));
  alert('Bill saved successfully!');

  displayBill(bill);
}

function displayBill(bill) {
  let itemsHTML = `<table border="1" cellspacing="0" cellpadding="5">
    <tr>
      <th>Item Name</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Discount (%)</th>
      <th>Discount Amt</th>
      <th>Net Amt</th>
    </tr>`;

  bill.items.forEach(item => {
    itemsHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.discountRate}%</td>
        <td>₹${item.discountAmount}</td>
        <td>₹${item.netAmount}</td>
      </tr>`;
  });

  itemsHTML += `</table>`;

  const billHTML = `
    <h2>Tax Invoice</h2>
    <p><strong>Buyer Name:</strong> ${bill.buyerName}</p>
    ${itemsHTML}
    <p><strong>Subtotal:</strong> ₹${bill.subtotal}</p>
    <p><strong>SGST (${bill.sgstRate}%):</strong> ₹${bill.sgstAmount}</p>
    <p><strong>CGST (${bill.cgstRate}%):</strong> ₹${bill.cgstAmount}</p>
    <p><strong>IGST (${bill.igstRate}%):</strong> ₹${bill.igstAmount}</p>
    <p><strong>Total GST:</strong> ₹${bill.totalGST}</p>
    <p><strong>Total Amount:</strong> ₹${bill.totalAmount}</p>
    <p><strong>Date & Time:</strong> ${bill.dateTime}</p>
  `;

  const billOutput = document.getElementById('billOutput');
  billOutput.innerHTML = billHTML;
}

function printBill() {
  const billData = localStorage.getItem('lastBill');
  if (!billData) {
    alert('No bill found. Please save a bill first.');
    return;
  }

  const bill = JSON.parse(billData);

  // Render the bill exactly as shown in displayBill
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>Tax Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: center; }
        h2 { text-align: center; }
      </style>
    </head>
    <body>
      <h2>Tax Invoice</h2>
      <p><strong>Buyer Name:</strong> ${bill.buyerName}</p>
      <table>
        <tr>
          <th>Item Name</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Discount (%)</th>
          <th>Discount Amt</th>
          <th>Net Amt</th>
        </tr>
        ${bill.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.discountRate}%</td>
            <td>₹${item.discountAmount}</td>
            <td>₹${item.netAmount}</td>
          </tr>`).join('')}
      </table>
      <p><strong>Subtotal:</strong> ₹${bill.subtotal}</p>
      <p><strong>SGST (${bill.sgstRate}%):</strong> ₹${bill.sgstAmount}</p>
      <p><strong>CGST (${bill.cgstRate}%):</strong> ₹${bill.cgstAmount}</p>
      <p><strong>IGST (${bill.igstRate}%):</strong> ₹${bill.igstAmount}</p>
      <p><strong>Total GST:</strong> ₹${bill.totalGST}</p>
      <p><strong>Total Amount:</strong> ₹${bill.totalAmount}</p>
      <p><strong>Date & Time:</strong> ${bill.dateTime}</p>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
