document.getElementById('add-product').addEventListener('click', function() {
    let productGroup = `
        <div class="row mb-2">
            <div class="col-md-8">
                <select class="form-select" name="product[]" required>
                    <option value="Matador High-School Pen" data-price="6">Matador High-School Pen - 6tk</option>
                    <option value="Fresh All-Rounder Pen" data-price="10">Fresh All-Rounder Pen - 10tk</option>
                    <option value="Doms Fusion Pencil" data-price="15">Doms Fusion Pencil - 15tk</option>
                    <option value="Matador i-teen Rio Pencil" data-price="12">Matador i-teen Rio Pencil - 12tk</option>
                    <option value="Petra Pencil" data-price="12">Petra Pencil - 12tk</option>
                    <option value="1 Packet Highschool Pen (12x)" data-price="70">1 Packet Highschool Pen (12x) - 70tk</option>
                    <option value="1 Box Doms Fusion(10x with erasener & 15cm ruler)" data-price="150">1 Box Doms Fusion - 150tk</option>
                    <option value="Matador i-teen Erasers" data-price="10">Matador i-teen Erasers - 10tk</option>
                    <option value="Matador i-teen Sharpners (Small)" data-price="10">Matador i-teen Sharpners (Small) - 10tk</option>
                    <option value="Exercise Book (Grade A)" data-price="90">Exercise Book (Grade A) - 90tk</option>
                    <option value="Exercise Book (Grade B)" data-price="75">Exercise Book (Grade B) - 75tk</option>
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

        if (!isNaN(amount) && amount > 0) {
            const lineTotal = productPrice * amount;
            totalPrice += lineTotal;
            summary += `${productName} x${amount} = ${lineTotal}tk<br>`;
        }
    });

    summary += `<strong>Total: ${totalPrice}tk</strong>`;
    document.getElementById('price-summary').innerHTML = summary;
}

// Attach change event to initial form elements
attachChangeEvent();

emailjs.init("SglXZfGv2oP3nL_cG");

const form = document.getElementById('order-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const whatsapp = formData.get('whatsapp');
    const email = formData.get('email');
    if (!whatsapp && !email) {
        return showError('Please provide at least one contact method: WhatsApp or Email');
    }

    const productSelects = formData.getAll('product[]');
    const amounts = formData.getAll('amount[]');
    const emailData = [];
    let total = 0;

    for (let i = 0; i < productSelects.length; i++) {
        const product = document.querySelectorAll('select[name="product[]"]')[i];
        const amount = parseInt(amounts[i]);
        const price = parseInt(product.options[product.selectedIndex].getAttribute('data-price'));

        // Ensure price and amount are valid
        if (!isNaN(amount) && amount > 0) {
            total += price * amount;
            emailData.push(`${product.options[product.selectedIndex].text.split(' - ')[0]} x${amount} = ${price * amount}tk`);
        }
    }

    const emailContent = emailData.join('\n');

    emailjs.send('service_5iqtwke', 'template_5jc3atl', {
        name: formData.get('name'),
        class: formData.get('class'),
        address: formData.get('address'),
        delivery: formData.get('delivery'),
        contact: whatsapp ? `WhatsApp: ${whatsapp}` : `Email: ${email}`,
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
