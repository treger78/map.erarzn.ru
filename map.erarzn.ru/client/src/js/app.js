const authForm = document.getElementById('auth-form');

if (authForm) {
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
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
    
            const data = await response.json();
    
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            
        }
    });
}
