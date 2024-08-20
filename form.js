window.onload = function() {
    emailjs.init('vZkHCL9fT2At1M9WE'); // Initialize EmailJS with your new public key

    const form = document.getElementById('order-form');
    form.addEventListener('submit', (e) => {
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
            console.error('Error sending email:', error);
            alert('Failed to send order: ' + error);
        });
    });

    function showError(message) {
        document.getElementById('error-message').textContent = message;
    }
};
