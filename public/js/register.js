document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const passwordMatch = document.getElementById('passwordMatch');

    // Elementos de verificação de senha
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const specialCheck = document.getElementById('special-check');

    // Função para alternar visibilidade da senha
    function setupPasswordToggle(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggle.querySelector('i').classList.toggle('bi-eye');
            toggle.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    // Configurar toggles de senha
    setupPasswordToggle('password', 'togglePassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');

    // Verificar requisitos da senha
    function checkPasswordRequirements(value) {
        const requirements = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };

        // Atualizar indicadores visuais
        lengthCheck.innerHTML = `<i class="bi bi-${requirements.length ? 'check-circle text-success' : 'x-circle text-danger'}"></i> Mínimo de 8 caracteres`;
        
        uppercaseCheck.innerHTML = `<i class="bi bi-${requirements.uppercase ? 'check-circle text-success' : 'x-circle text-danger'}"></i> Uma letra maiúscula`;
        
        specialCheck.innerHTML = `<i class="bi bi-${requirements.special ? 'check-circle text-success' : 'x-circle text-danger'}"></i> Um caractere especial`;

        return requirements.length && requirements.uppercase && requirements.special;
    }

    // Verificar se as senhas coincidem
    function checkPasswordsMatch() {
        const match = password.value === confirmPassword.value;
        if (password.value && confirmPassword.value) {
            passwordMatch.innerHTML = match ? 
                '<i class="bi bi-check-circle text-success"></i> Senhas coincidem' : 
                '<i class="bi bi-x-circle text-danger"></i> Senhas não coincidem';
        } else {
            passwordMatch.innerHTML = '';
        }
        return match;
    }

    // Verificar se o formulário está válido
    function validateForm() {
        const isPasswordValid = checkPasswordRequirements(password.value);
        const doPasswordsMatch = checkPasswordsMatch();
        const areFieldsFilled = form.checkValidity();

        submitBtn.disabled = !(isPasswordValid && doPasswordsMatch && areFieldsFilled);
    }

    // Event listeners
    password.addEventListener('input', () => {
        checkPasswordRequirements(password.value);
        checkPasswordsMatch();
        validateForm();
    });

    confirmPassword.addEventListener('input', () => {
        checkPasswordsMatch();
        validateForm();
    });

    form.addEventListener('input', validateForm);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: password.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro realizado com sucesso!');
                window.location.href = '/login.html';
            } else {
                alert(data.message || 'Erro ao registrar');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao registrar usuário');
        }
    });
}); 