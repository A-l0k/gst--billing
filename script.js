let inventory = {};
let invoiceNumber = 1;

document.addEventListener('DOMContentLoaded', () => {
  generateInvoiceHeader();
});

function generateInvoiceHeader() {
  const now = new Date();
  document.getElementById('invoice-number').textContent = `Invoice #: ${invoiceNumber}`;
  document.getElementById('invoice-date').textContent = now.toLocaleDateString();
}

function toggleInventory() {
  document.getElementById('inventory').classList.toggle('hidden');
}

function printInvoice() {
  window.print();
}

function clearInvoice() {
  document.getElementById('invoice-items').innerHTML = '';
  document.getElementById('total').textContent = '0.00';
  invoiceNumber++;
  generateInvoiceHeader();
}

function handleBarcode(event) {
  const barcode = event.target.value.trim();
  if (inventory[barcode]) {
    document.getElementById('itemName').value = inventory[barcode].name;
    document.getElementById('itemPrice').value = inventory[barcode].price;
  }
}

function addItemToInventory() {
  const barcode = document.getElementById('barcode').value.trim();
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  if (!barcode || !name || isNaN(price)) {
    alert('Please fill all fields.');
    return;
  }
  inventory[barcode] = { name, price };
  updateInventoryTable();
  alert('Item saved to inventory.');
}

function updateInventoryTable() {
  const table = document.getElementById('inventoryTable');
  table.innerHTML = '';
  for (const [barcode, item] of Object.entries(inventory)) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${barcode}</td><td>${item.name}</td><td>₹${item.price.toFixed(2)}</td>`;
    table.appendChild(row);
  }
}

function addItemToInvoice() {
  const barcode = document.getElementById('barcode').value.trim();
  let name = document.getElementById('itemName').value.trim();
  let price = parseFloat(document.getElementById('itemPrice').value);
  let qty = parseInt(document.getElementById('itemQty').value);
  if (!barcode || !name || isNaN(price) || isNaN(qty) || qty < 1) {
    alert('Please fill all fields.');
    return;
  }

  // If barcode exists in inventory, use stored name/price
  if (inventory[barcode]) {
    name = inventory[barcode].name;
    price = inventory[barcode].price;
  }

  const totalItemPrice = price * qty;

  // Add to invoice
  const invoiceItems = document.getElementById('invoice-items');
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  itemDiv.innerHTML = `<span>${name} x${qty}</span><span>₹${totalItemPrice.toFixed(2)}</span>`;
  invoiceItems.appendChild(itemDiv);

  updateTotal();

  // Clear inputs
  document.getElementById('barcode').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemQty').value = 1;
}

function updateTotal() {
  let total = 0;
  const items = document.querySelectorAll('#invoice-items .item');
  items.forEach(item => {
    const priceText = item.querySelector('span:last-child').textContent.replace('₹', '');
    total += parseFloat(priceText);
  });
  document.getElementById('total').textContent = total.toFixed(2);
}
