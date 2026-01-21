document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginContainer = document.querySelector('.login-form');
    const signupContainer = document.querySelector('.signup-form');
    const toggleSignup = document.getElementById('toggle-signup');
    const toggleLogin = document.getElementById('toggle-login');
    const microsoftBtn = document.getElementById('microsoftLoginBtn');

    // Toggle Forms
    toggleSignup.addEventListener('click', function (e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'flex';
    });

    toggleLogin.addEventListener('click', function (e) {
        e.preventDefault();
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
    });

    // Microsoft Login listener removed - handled by HTML anchor tag now

    // Handle Signup
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Auto-redirect after signup
                window.location.href = '/welcome?type=signup';
            } else {
                alert(data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during signup.');
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to welcome page
                window.location.href = '/welcome?type=login';
            } else {
                alert(data.message || 'Invalid credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login.');
        }
    });
});
