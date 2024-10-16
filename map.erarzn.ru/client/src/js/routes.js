const signInRoute = () => {
    const authForm = document.getElementById('auth-form');

    if (authForm) {
        authForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            //TODO: добавить проверку что пользователь уже залогинен
            if (document.cookie.includes('user')) {
                return console.warn('Вы уже авторизованы.');
            }

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

                if (!response.ok) {
                    console.error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (data.message) {
                    Toastify({
                        text: data.message,
                        duration: 3000,
                        gravity: 'top',
                        position: 'center',
                        style: {
                            background: data.messageColor
                        },
                    }).showToast();
                }

                //TODO: сделать SPA?
                if (data.token) {
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            } catch (error) {
                Toastify({
                    text: 'Произошла ошибка! Попробуйте снова.',
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    style: {
                        background: data.messageColor || '#ff0000bd' //red
                    },
                }).showToast();

                console.error(error);
            }
        });
    }
};

/*
const personalRoute = () => {
    try {
        
    } catch (error) {
        Toastify({
            text: 'Произошла ошибка! Попробуйте снова.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            style: {
                background: data.messageColor || '#ff0000bd' //red
            },
        }).showToast();

        console.error(error);
    }
};
*/

signInRoute();
//personalRoute();
