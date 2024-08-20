import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html'; // Redirect to dashboard after successful login
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('login-message').textContent = 'Login failed. Please check your credentials.';
    }
});
