document.getElementById('add-product').addEventListener('click', function() {
    let productGroup = `
        <div class="row mb-2">
            <div class="col-md-8">
                <select class="form-select" name="product[]" required>
                    <option value="Matador High-School Pen" data-price="6">Matador High-School Pen - 6tk</option>
                    <option value="Fresh All-All-Rounder Pen" data-price="10">Fresh All-All-Rounder Pen - 10tk</option>
                    <option value="Doms Fusion Pencil" data-price="15">Doms Fusion Pencil - 15tk</option>
                    <option value="Matador i-teen Rio Pencil" data-price="12">Matador i-teen Rio Pencil - 12tk</option>
                    <option value="Petra Pencil" data-price="10">Petra Pencil - 10tk</option>
                    <option value="1 Packet Highschool Pen (12x)" data-price="70">1 Packet Highschool Pen (12x) - 70tk</option>
                    <option value="1 Box Doms Fusion" data-price="150">1 Box Doms Fusion - 150tk</option>
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
    attachChangeEvent();
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
emailjs.init('vZkHCL9fT2At1M9WE');
const form = document.getElementById('order-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const whatsapp = formData.get('whatsapp');
    const email = formData.get('email');
    if (!whatsapp && !email) {
        return showError('Please provide at least one contact method: WhatsApp or Email');
    }
    const amounts = formData.getAll('amount[]');
    const emailData = [];
    let total = 0;

    for (let i = 0; i < products.length; i++) {
        const amount = parseInt(amounts[i]);
        let price = 0;
        switch (products[i]) {
            case "Matador High-School Pen":
            case "Fresh All-All-Rounder Pen":
            case "Matador i-teen Rio Pencil":
            case "Petra Pencil":
            case "Doms Fusion Pencil":
                if (amount > 11) return showError('Maximum 11 individual items allowed');
                price = products[i].includes('High-School Pen') ? 6 : products[i].includes('Fresh') ? 10 : products[i].includes('Doms Fusion') ? 15 : products[i].includes('Rio') ? 12 : 10;
                break;
            case "1 Packet Highschool Pen (12x)":
                if (amount > 2) return showError('Maximum 2 boxes allowed');
                price = 70;
                break;
            case "1 Box Doms Fusion":
                if (amount > 2) return showError('Maximum 2 boxes allowed');
                price = 150;
                break;
            case "Matador i-teen Erasers":
                if (amount > 6) return showError('Maximum 6 erasers allowed');
                price = 10;
                break;
            case "Matador i-teen Sharpners (Small)":
                if (amount > 4) return showError('Maximum 4 sharpeners allowed');
                price = 10;
                break;
            case "Exercise Book (Grade A)":
                if (amount > 5) return showError('Maximum 5 Grade A exercise books allowed');
                price = 90;
                break;
            case "Exercise Book (Grade B)":
                if (amount > 5) return showError('Maximum 5 Grade B exercise books allowed');
                price = 75;
                break;
        }
        total += price * amount;
        emailData.push(`${products[i]} x${amount} = ${price * amount}tk`);
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
    calculateTotal();
});

function showError(message) {
    document.getElementById('error-message').textContent = message;
}