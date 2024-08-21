import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

document.getElementById('add-product').addEventListener('click', function() {
    let productGroup = `
        <div class="row mb-2">
            <div class="col-md-8">
                <select class="form-select" name="product[]" required>
                    <option value="Matador High-School Pen">Matador High-School Pen - 5tk</option>
                    <option value="Fresh All-All-Rounder Pen">Fresh All-All-Rounder Pen - 10tk</option>
                    <option value="Matador i-teen Rio Pencil">Matador i-teen Rio Pencil - 10tk</option>
                    <option value="Matador i-teen Erasers">Matador i-teen Erasers - 10tk</option>
                    <option value="Matador i-teen Sharpners (Small)">Matador i-teen Sharpners (Small) - 10tk</option>
                    <option value="Exercise Book (Grade A)">Exercise Book (Grade A) - 100tk</option>
                    <option value="Exercise Book (Grade B)">Exercise Book (Grade B) - 90tk</option>
                </select>
            </div>
            <div class="col-md-4">
                <input type="number" class="form-control" name="amount[]" placeholder="Qty" min="1" required>
            </div>
        </div>`;
    document.getElementById('products').insertAdjacentHTML('beforeend', productGroup);
});
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
    const products = formData.getAll('product[]');
    const amounts = formData.getAll('amount[]');
    const emailData = [];
    let total = 0;
    for (let i = 0; i < products.length; i++) {
        const amount = parseInt(amounts[i]);
        let price = 0;
        switch (products[i]) {
            case "Matador High-School Pen":
                if (amount > 12) return showError('Maximum 12 pens allowed');
                price = 5;
                break;
            case "Fresh All-All-Rounder Pen":
                if (amount > 12) return showError('Maximum 12 pens allowed');
                price = 10;
                break;
            case "Matador i-teen Rio Pencil":
                if (amount > 12) return showError('Maximum 12 pencils allowed');
                price = 10;
                break;
            case "Matador i-teen Erasers":
                if (amount > 6) return showError('Maximum 6 erasers allowed');
                price = 10;
                break;
            case "Matador i-teen Sharpners (Small)":
                if (amount > 4) return showError('Maximum 4 sharpners allowed');
                price = 10;
                break;
            case "Exercise Book (Grade A)":
                if (amount > 5) return showError('Maximum 5 Grade A exercise books allowed');
                price = 100;
                break;
            case "Exercise Book (Grade B)":
                if (amount > 5) return showError('Maximum 5 Grade B exercise books allowed');
                price = 90;
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
        alert('Order placed successfully!');
    }).catch((error) => {
        alert('Failed to send order: ' + error);
    });

     e.preventDefault();

    const name = formData.get('name');
    const classValue = formData.get('class');

    // Save to Firestore
    try {
        await addDoc(collection(db, "orders"), {
            name,
            class: classValue,
            products,
            amounts,
            timestamp: new Date()
        });

        alert('Order successfully placed!');
    } catch (error) {
        console.error("Error adding order: ", error);
        alert('Failed to place order. Please try again.');
    }

});
function showError(message) {
    document.getElementById('error-message').textContent = message;
}