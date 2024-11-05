// Funções globais
window.editarLivro = function(id, titulo, autor, ano) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitulo').value = titulo;
    document.getElementById('editAutor').value = autor;
    document.getElementById('editAno').value = ano;
    
    const modal = new bootstrap.Modal(document.getElementById('editarModal'));
    modal.show();
}

window.deletarLivro = async function(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/livros/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                carregarLivros();
                showAlert('Livro excluído com sucesso!', 'success');
            } else {
                showAlert('Erro ao excluir livro', 'danger');
            }
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao excluir livro', 'danger');
        }
    }
}

window.showAlert = function(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

window.carregarLivros = async function() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/livros', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        const livros = await response.json();
        
        const tbody = document.getElementById('livrosTableBody');
        tbody.innerHTML = '';
        
        livros.forEach(livro => {
            tbody.innerHTML += `
                <tr>
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarLivro(${livro.id}, '${livro.titulo}', '${livro.autor}', ${livro.ano})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletarLivro(${livro.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao carregar livros', 'danger');
    }
}

// Event Listener quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Configurar nome do usuário
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('userName').textContent = `Olá, ${userName}`;
    }

    // Configurar logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/';
    });

    // Carregar livros inicialmente
    carregarLivros();
    
    // Configurar formulário de adição
    document.getElementById('livroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        
        const livro = {
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            ano: document.getElementById('ano').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/livros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(livro)
            });

            if (response.ok) {
                carregarLivros();
                document.getElementById('livroForm').reset();
                bootstrap.Collapse.getInstance(document.getElementById('formCollapse')).hide();
                showAlert('Livro adicionado com sucesso!', 'success');
            } else {
                showAlert('Erro ao adicionar livro', 'danger');
            }
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao adicionar livro', 'danger');
        } finally {
            submitBtn.disabled = false;
        }
    });

    // Configurar edição
    document.getElementById('salvarEdicao').addEventListener('click', async () => {
        const id = document.getElementById('editId').value;
        const livro = {
            titulo: document.getElementById('editTitulo').value,
            autor: document.getElementById('editAutor').value,
            ano: document.getElementById('editAno').value
        };

        try {
            const response = await fetch(`http://localhost:3000/api/livros/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(livro)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
                modal.hide();
                carregarLivros();
                showAlert('Livro atualizado com sucesso!', 'success');
            } else {
                showAlert('Erro ao atualizar livro', 'danger');
            }
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro ao atualizar livro', 'danger');
        }
    });
});