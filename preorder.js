import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

document.getElementById('preorder-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const classValue = document.getElementById('class').value;
    const products = Array.from(document.getElementById('preorder-products').selectedOptions).map(option => option.value);

    try {
        await addDoc(collection(db, "preorders"), {
            name,
            class: classValue,
            products,
            timestamp: new Date()
        });

        document.getElementById('message').textContent = "Pre-order successfully submitted!";
    } catch (error) {
        console.error("Error adding pre-order: ", error);
        document.getElementById('message').textContent = "Failed to submit pre-order. Please try again.";
    }
});
