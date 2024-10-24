import { showMessage } from './utils/showMessage.js';

const signInRoute = () => {
    const authForm = document.getElementById('auth-form');

    if (authForm) {
        authForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (document.cookie.includes('user')) return console.warn('Вы уже авторизованы.');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) console.error(`Error: ${response.status} ${response.statusText}`);

                const data = await response.json();

                if (data.message) showMessage({ text: data.message, color: data.messageColor });

                if (data.token) {
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            } catch (error) {
                showMessage({ text: error, type: 'error' });
            }
        });
    }
};

const signOutRoute = () => {
    const signOutButton = document.getElementById('singout');

    if (signOutButton) {
        signOutButton.addEventListener('click', async (event) => {
            event.preventDefault();

            try {
                const response = await fetch('/signout', {
                    method: 'GET',
                });

                const data = await response.json();

                if (data) {
                    showMessage({ text: data.message, color: data.messageColor });

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            } catch (error) {
                showMessage({ text: error, type: 'error' });
            }
        });
    }
};

/*
const personalRoute = () => {
    try {
        
    } catch (error) {
        showMessage({ text: error, type: 'error' });
    }
};
*/

signInRoute();
signOutRoute();
//personalRoute();
