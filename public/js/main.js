document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    
    document.getElementById('livroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const livro = {
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            ano: document.getElementById('ano').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/livros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livro)
            });

            if (response.ok) {
                carregarLivros();
                document.getElementById('livroForm').reset();
            }
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
        }
    });

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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livro)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
                modal.hide();
                carregarLivros();
            }
        } catch (error) {
            console.error('Erro ao editar livro:', error);
        }
    });
});

async function carregarLivros() {
    try {
        const response = await fetch('http://localhost:3000/api/livros');
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
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletarLivro(${livro.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

function editarLivro(id, titulo, autor, ano) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitulo').value = titulo;
    document.getElementById('editAutor').value = autor;
    document.getElementById('editAno').value = ano;
    
    const modal = new bootstrap.Modal(document.getElementById('editarModal'));
    modal.show();
}

async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/livros/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                carregarLivros();
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
        }
    }
} 