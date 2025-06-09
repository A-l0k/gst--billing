let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let invoiceItems = [];

function addToInventory() {
  const barcode = document.getElementById('itemBarcode').value.trim();
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  const quantity = parseInt(document.getElementById('itemQuantity').value);

  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Please enter all item details.");
    return;
  }

  let item = inventory.find(i => (barcode && i.barcode === barcode) || i.name === name);

  if (item) {
    item.stock += quantity;
    item.price = price;
    if (barcode) item.barcode = barcode;
  } else {
    inventory.push({ barcode, name, price, stock: quantity });
  }

  localStorage.setItem('inventory', JSON.stringify(inventory));
  updateInvoiceItemDropdown();
  updateInventoryTable();

  document.getElementById('itemBarcode').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemQuantity').value = '';
}

document.getElementById('itemBarcode').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const barcode = e.target.value.trim();
    let item = inventory.find(i => i.barcode === barcode);
    if (item) {
      document.getElementById('itemName').value = item.name;
      document.getElementById('itemPrice').value = item.price;
    } else {
      alert("Item not found. Please fill manually.");
    }
  }
});

function updateInvoiceItemDropdown() {
  const select = document.getElementById('invoiceItem');
  select.innerHTML = '';
  inventory.forEach(item => {
    let option = document.createElement('option');
    option.value = item.name;
    option.text = item.name;
    select.appendChild(option);
  });
}

function addToInvoice() {
  const selectedItemName = document.getElementById('invoiceItem').value;
  const quantity = parseInt(document.getElementById('invoiceQuantity').value);
  const discount = parseFloat(document.getElementById('invoiceDiscount').value) || 0;

  let item = inventory.find(i => i.name === selectedItemName);
  if (!item || quantity > item.stock) {
    alert("Invalid item or insufficient stock.");
    return;
  }

  invoiceItems.push({
    name: item.name,
    price: item.price,
    quantity,
    discount
  });

  item.stock -= quantity;
  localStorage.setItem('inventory', JSON.stringify(inventory));

  updateInvoiceItemDropdown();
  updateInvoiceTable();
  updateInventoryTable();
}

function updateInvoiceTable() {
  const detailsDiv = document.getElementById('invoiceDetails');
  detailsDiv.innerHTML = '';
  let table = '<table><tr><th>Item</th><th>Price</th><th>Qty</th><th>Discount %</th><th>Total</th></tr>';
  let subtotal = 0;

  invoiceItems.forEach(item => {
    let discountedPrice = item.price * (1 - item.discount / 100);
    let total = discountedPrice * item.quantity;
    subtotal += total;
    table += `<tr>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>${item.discount}</td>
      <td>${total.toFixed(2)}</td>
    </tr>`;
  });

  table += '</table>';
  detailsDiv.innerHTML = table;

  let sgst = subtotal * (parseFloat(document.getElementById('sgstPercent').value) / 100);
  let cgst = subtotal * (parseFloat(document.getElementById('cgstPercent').value) / 100);
  let igst = subtotal * (parseFloat(document.getElementById('igstPercent').value) / 100);
  let grandTotal = subtotal + sgst + cgst + igst;

  const totalSection = document.getElementById('totalSection');
  totalSection.innerHTML = `
    <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
    <p>SGST: ₹${sgst.toFixed(2)}</p>
    <p>CGST: ₹${cgst.toFixed(2)}</p>
    <p>IGST: ₹${igst.toFixed(2)}</p>
    <h3>Grand Total: ₹${grandTotal.toFixed(2)}</h3>
  `;
}

function saveBill() {
  const savedBills = JSON.parse(localStorage.getItem('savedBills')) || [];
  savedBills.push({
    items: invoiceItems,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('savedBills', JSON.stringify(savedBills));
  alert("Bill saved successfully.");
  invoiceItems = [];
  updateInvoiceTable();
}

function printInvoice() {
  window.print();
}

function toggleInventory() {
  const section = document.getElementById('inventorySection');
  if (section.style.display === 'none') {
    updateInventoryTable();
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

function updateInventoryTable() {
  const tableBody = document.querySelector('#inventoryTable tbody');
  tableBody.innerHTML = '';
  inventory.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.barcode || '-'}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.stock}</td>
    `;
    tableBody.appendChild(row);
  });
}

window.onload = () => {
  updateInvoiceItemDropdown();
  updateInventoryTable();
};
