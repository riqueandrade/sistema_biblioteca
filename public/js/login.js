document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginData = {
        email: document.getElementById('email').value,
        senha: document.getElementById('password').value
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
            alert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer login');
    }
}); 