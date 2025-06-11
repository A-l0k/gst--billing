let inventory = {};

function toggleInventory() {
  const inventoryDiv = document.getElementById('inventory');
  inventoryDiv.classList.toggle('hidden');
}

function printInvoice() {
  window.print();
}

function handleBarcode(event) {
  const barcode = event.target.value.trim();
  if (inventory[barcode]) {
    document.getElementById('itemName').value = inventory[barcode].name;
    document.getElementById('itemPrice').value = inventory[barcode].price;
  }
}

function addItem() {
  const barcode = document.getElementById('barcode').value.trim();
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  if (!barcode || !name || isNaN(price)) {
    alert('Please fill all fields.');
    return;
  }

  // Add to inventory
  inventory[barcode] = { name, price };
  updateInventoryTable();

  // Add to invoice
  const invoiceItems = document.getElementById('invoice-items');
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  itemDiv.innerHTML = `<span>${name}</span><span>$${price.toFixed(2)}</span>`;
  invoiceItems.appendChild(itemDiv);

  // Update total
  updateTotal();

  // Clear inputs
  document.getElementById('barcode').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
}

function updateInventoryTable() {
  const table = document.getElementById('inventoryTable');
  table.innerHTML = '';
  for (const [barcode, item] of Object.entries(inventory)) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${barcode}</td><td>${item.name}</td><td>$${item.price.toFixed(2)}</td>`;
    table.appendChild(row);
  }
}

function updateTotal() {
  let total = 0;
  const items = document.querySelectorAll('#invoice-items .item');
  items.forEach(item => {
    const priceText = item.querySelector('span:last-child').textContent.replace('$', '');
    total += parseFloat(priceText);
  });
  document.getElementById('total').textContent = total.toFixed(2);
}
