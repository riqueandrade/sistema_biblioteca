document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const loginError = document.getElementById('loginError');

    // Configurar toggle de senha
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('bi-eye');
        togglePassword.querySelector('i').classList.toggle('bi-eye-slash');
    });

    // Limpar mensagem de erro quando o usuário começa a digitar
    emailInput.addEventListener('input', () => {
        loginError.classList.add('d-none');
        if (emailInput.validity.valid) {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        }
    });

    passwordInput.addEventListener('input', () => {
        loginError.classList.add('d-none');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.add('d-none');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...';
        
        const loginData = {
            email: emailInput.value,
            senha: passwordInput.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar o token no localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.nome);
                
                // Redirecionar para a página de livros
                window.location.href = '/livros.html';
            } else {
                // Feedback visual específico para cada tipo de erro
                loginError.textContent = data.message;
                loginError.classList.remove('d-none');
                
                // Destacar o campo com erro
                if (data.message.includes('email')) {
                    emailInput.classList.add('is-invalid');
                    passwordInput.classList.remove('is-invalid');
                } else if (data.message.includes('senha')) {
                    passwordInput.classList.add('is-invalid');
                    emailInput.classList.remove('is-invalid');
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        } catch (error) {
            console.error('Erro:', error);
            loginError.textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
            loginError.classList.remove('d-none');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    });
}); 