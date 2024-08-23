import { auth, db } from './firebase.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
    } else {
        loadOrders();
        loadPreOrders();
    }
});

async function loadOrders() {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const ordersTable = document.getElementById('orders-table');
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const row = ordersTable.insertRow();
        row.insertCell(0).textContent = order.name;
        row.insertCell(1).textContent = order.class;
        row.insertCell(2).textContent = order.products.join(', ');
        row.insertCell(3).textContent = order.amounts.join(', ');
        row.insertCell(4).textContent = order.itemType;
        row.insertCell(5).textContent = order.timestamp.toDate().toLocaleString();
    });
}

async function loadPreOrders() {
    const preordersSnapshot = await getDocs(collection(db, 'preorders'));
    const preordersTable = document.getElementById('preorders-table');
    preordersSnapshot.forEach(doc => {
        const preorder = doc.data();
        const row = preordersTable.insertRow();
        row.insertCell(0).textContent = preorder.name;
        row.insertCell(1).textContent = preorder.class;
        row.insertCell(2).textContent = preorder.products.join(', ');
        row.insertCell(3).textContent = preorder.itemType;
        row.insertCell(4).textContent = preorder.timestamp.toDate().toLocaleString();
    });
}

// Add new entry form handling
const addEntryForm = document.getElementById('add-entry-form');
addEntryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const entryType = document.getElementById('entry-type').value;
    const name = document.getElementById('name').value;
    const classValue = document.getElementById('class').value;
    const products = document.getElementById('products').value.split(',').map(item => item.trim());
    const amounts = document.getElementById('amounts').value.split(',').map(item => item.trim());
    const itemType = document.getElementById('item-type').value;

    try {
        await addDoc(collection(db, entryType === 'order' ? 'orders' : 'preorders'), {
            name,
            class: classValue,
            products,
            amounts,
            itemType,
            timestamp: new Date()
        });

        document.getElementById('entry-message').textContent = 'Entry successfully added!';
        loadOrders(); // Refresh orders
        loadPreOrders(); // Refresh pre-orders
    } catch (error) {
        console.error('Error adding entry: ', error);
        document.getElementById('entry-message').textContent = 'Failed to add entry. Please try again.';
    }
});

// Sign out functionality (optional)
document.getElementById('signout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});
