let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let billItems = [];

// Populate invoice item dropdown
function updateInvoiceItemDropdown() {
  const dropdown = document.getElementById('invoiceItem');
  dropdown.innerHTML = "";
  inventory.forEach(item => {
    let option = document.createElement('option');
    option.value = item.name;
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
}

function addToInventory() {
  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const quantity = parseInt(document.getElementById('itemQuantity').value);

  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Please enter all item details.");
    return;
  }

  let item = inventory.find(i => i.name === name);
  if (item) {
    item.stock += quantity;
    item.price = price; // update price if changed
  } else {
    inventory.push({ name, price, stock: quantity });
  }

  localStorage.setItem('inventory', JSON.stringify(inventory));
  updateInvoiceItemDropdown();
  alert(`Added ${quantity} of ${name} to inventory.`);
}

function addItemToInvoice() {
  const name = document.getElementById('invoiceItem').value;
  const quantity = parseInt(document.getElementById('invoiceQuantity').value);
  const discount = parseFloat(document.getElementById('invoiceDiscount').value) || 0;

  let item = inventory.find(i => i.name === name);
  if (!item) {
    alert("Item not found in inventory.");
    return;
  }

  if (item.stock < quantity) {
    alert(`Insufficient stock for ${name}.`);
    return;
  }

  billItems.push({ name, price: item.price, quantity, discount });
  alert(`${name} added to bill.`);
}

function saveBill() {
  const gst = parseFloat(document.getElementById('gstPercent').value) || 0;
  const sgst = parseFloat(document.getElementById('sgstPercent').value) || 0;
  const cgst = parseFloat(document.getElementById('cgstPercent').value) || 0;
  const igst = parseFloat(document.getElementById('igstPercent').value) || 0;

  let subtotal = 0;
  let invoiceHTML = `
    <h2 style="text-align: center;">Alok Kirana Store</h2>
    <p style="text-align: center;">123 Main Street, City, PIN 123456</p>
    <hr>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Time: ${new Date().toLocaleTimeString()}</p>
    <hr>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Disc(%)</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  billItems.forEach(item => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    const total = discountedPrice * item.quantity;
    subtotal += total;

    invoiceHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.discount}</td>
        <td>${total.toFixed(2)}</td>
      </tr>
    `;

    // Reduce stock
    let stockItem = inventory.find(i => i.name === item.name);
    stockItem.stock -= item.quantity;
  });

  localStorage.setItem('inventory', JSON.stringify(inventory));

  const gstAmount = (subtotal * gst) / 100;
  const sgstAmount = (subtotal * sgst) / 100;
  const cgstAmount = (subtotal * cgst) / 100;
  const igstAmount = (subtotal * igst) / 100;
  const grandTotal = subtotal + gstAmount + sgstAmount + cgstAmount + igstAmount;

  invoiceHTML += `
      </tbody>
    </table>
    <hr>
    <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
    <p>GST: ₹${gstAmount.toFixed(2)}</p>
    <p>SGST: ₹${sgstAmount.toFixed(2)}</p>
    <p>CGST: ₹${cgstAmount.toFixed(2)}</p>
    <p>IGST: ₹${igstAmount.toFixed(2)}</p>
    <hr>
    <p><strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong></p>
  `;

  document.getElementById('invoice').innerHTML = invoiceHTML;
  alert("Bill saved!");
  billItems = []; // reset bill
}

function printInvoice() {
  window.print();
}

window.onload = updateInvoiceItemDropdown;
