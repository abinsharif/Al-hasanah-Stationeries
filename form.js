document.getElementById('add-product').addEventListener('click', function() {
    let productGroup = `
        <div class="row mb-2">
            <div class="col-md-8">
                <select class="form-select" name="product[]" required>
                    <option value="Matador High-School Pen" data-price="6">Matador High-School Pen - 6tk</option>
                    <option value="Fresh All-Rounder Pen" data-price="10">Fresh All-Rounder Pen - 10tk</option>
                    <option value="Fresh Icon Pen" data-price="10">Fresh Icon Pen - 10tk</option>
                    <option value="Doms Fusion Pencil" data-price="15">Doms Fusion Pencil - 15tk</option>
                    <option value="Matador i-teen Rio Pencil" data-price="12">Matador i-teen Rio Pencil - 12tk</option>
                    <option value="Petra Pencil" data-price="12">Petra Pencil - 12tk</option>
                    <option value="1 Packet Highschool Pen (12x)" data-price="70">1 Packet Highschool Pen (12x) - 70tk</option>
                    <option value="1 Box Doms Fusion(10x with erasener & 15cm ruler)" data-price="150">1 Box Doms Fusion(10x with erasener & 15cm ruler) - 150tk</option>
                    <option value="Matador i-teen Erasers (Small)" data-price="10">Matador i-teen Erasers (Small) - 10tk</option>
                    <option value="Matador i-teen Sharpeners (Small)" data-price="10">Matador i-teen Sharpeners (Small) - 10tk</option>
                    <option value="Grade A Exercise Book (200pg)" data-price="90">Grade A Exercise Book (200pg) - 90tk</option>
                    <option value="Grade B Exercise Book (200pg)" data-price="75">Grade B Exercise Book (200pg) - 75tk</option>
                    <option value="Offer 1" data-price="150">Offer 1 - 150tk</option>
                    <option value="Offer 2" data-price="160">Offer 2 - 160tk</option>
                </select>
            </div>
            <div class="col-md-4">
                <input type="number" class="form-control" name="amount[]" placeholder="Qty" min="1" required>
            </div>
        </div>`;
    document.getElementById('products').insertAdjacentHTML('beforeend', productGroup);
    attachChangeEvent(); // Ensure new elements get the change event for calculation
});

function attachChangeEvent() {
    document.querySelectorAll('select[name="product[]"], input[name="amount[]"]').forEach(function(el) {
        el.addEventListener('change', calculateTotal);
    });
}

function calculateTotal() {
    const productSelects = document.querySelectorAll('select[name="product[]"]');
    const amounts = document.querySelectorAll('input[name="amount[]"]');
    let totalPrice = 0;
    let summary = '';

    productSelects.forEach((select, index) => {
        const productName = select.options[select.selectedIndex].text.split(' - ')[0];
        const productPrice = parseInt(select.options[select.selectedIndex].getAttribute('data-price'));
        const amount = parseInt(amounts[index].value);

        // Define the maximum quantity for each product
        const maxQuantity = getMaxQuantity(productName);

        if (amount > maxQuantity) {
            alert(`Warning: You can only order up to ${maxQuantity} ${productName}(s).`);
            amounts[index].value = maxQuantity;
            amount = maxQuantity;
        }

        if (!isNaN(amount) && amount > 0) {
            const lineTotal = productPrice * amount;
            totalPrice += lineTotal;
            summary += `${productName} - ${productPrice}tk x${amount} = ${lineTotal}tk<br>`;
        }
    });

    summary += `<strong>Total: ${totalPrice}tk</strong>`;
    document.getElementById('price-summary').innerHTML = summary;
}

// Define the maximum quantity for each product
function getMaxQuantity(productName) {
    switch (productName) {
        case "Matador High-School Pen":
            return 11;
        case "Fresh All-Rounder Pen":
            return 24;
        case "Fresh Icon Pen":
            return 24;
        case "Matador i-teen Rio Pencil":
            return 12;
        case "Petra Pencil":
            return 6;
        case "Doms Fusion Pencil":
            return 9;
        case "1 Packet Highschool Pen (12x)":
            return 3;
        case "1 Box Doms Fusion(10x with erasener & 15cm ruler)":
            return 2;
        case "Matador i-teen Erasers (Small)":
            return 8;
        case "Matador i-teen Sharpeners (Small)":
            return 6;
        case "Grade A Exercise Book (200pg)":
            return 5;
        case "Grade B Exercise Book (200pg)":
            return 5;
        case "Offer 1":
            return 2;
        case "Offer 2":
            return 2;
        default:
            return 1;
    }
}

// Attach change event to initial form elements
attachChangeEvent();
document.getElementById('delivery').addEventListener('change', function() {
    if (this.value === 'home') {
        document.getElementById('delivery-note').style.display = 'block';
        document.getElementById('address-group').style.display = 'block';
    } else {
        document.getElementById('delivery-note').style.display = 'none';
        document.getElementById('address-group').style.display = 'none';
    }
});
emailjs.init("SglXZfGv2oP3nL_cG");

const form = document.getElementById('order-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Validate Name
    const name = formData.get('name');
    if (!/^[a-zA-Z]+ [a-zA-Z]+/.test(name) || name.length < 3) {
        return showError('Please enter full name.');
    }

    // Validate Address
    const address = `Flat ${formData.get('flat')}, H - ${formData.get('house')}, Rd - ${formData.get('road')}, ${formData.get('place')}`;

    const number = formData.get('number');
    const email = formData.get('email');
    if (!number && !email) {
        return showError('Please provide at least one contact method: number or Email');
    }

    // Track total quantities of each product
    const productCounts = {};

    const productSelects = formData.getAll('product[]');
    const amounts = formData.getAll('amount[]');
    const emailData = [];
    let total = 0;

    for (let i = 0; i < productSelects.length; i++) {
        const product = document.querySelectorAll('select[name="product[]"]')[i];
        const amount = parseInt(amounts[i]);
        const productName = product.options[product.selectedIndex].value;
        const price = parseInt(product.options[product.selectedIndex].getAttribute('data-price'));

        if (!productCounts[productName]) {
            productCounts[productName] = 0;
        }
        productCounts[productName] += amount;
        // Ensure price and amount are valid
        if (!isNaN(amount) && amount > 0) {
            total += price * amount;
            emailData.push(`${productName} x${amount} = ${price * amount}tk`);
        }
    }

    const emailContent = emailData.join('\n');

    emailjs.send('service_5iqtwke', 'template_5jc3atl', {
        name: formData.get('name'),
        class: formData.get('class'),
        address: address,
        delivery: formData.get('delivery'),
        contact: number ? `number: ${number}` : `Email: ${email}`,
        order: emailContent,
        total: total
    }).then(() => {
        showError('');
        alert('Order placed successfully!');
    }).catch((error) => {
        alert('Failed to send order: ' + error);
    });
});

function showError(message) {
    document.getElementById('error-message').textContent = message;
}
