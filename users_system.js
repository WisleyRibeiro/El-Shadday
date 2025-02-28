document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone');

    // Modais e Botões - CADASTRO
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal'); // Modal de Cadastro
    const closeModal = document.querySelector('.close-modal'); // Botão de fechar do modal de cadastro (X)
    const userForm = document.getElementById('userForm'); // Formulário de cadastro
    const userTypesDatalist = document.getElementById('userTypes'); // Datalist de tipos de usuário (cadastro)

    // Modais e Botões - EDIÇÃO (NOVOS ELEMENTOS)
    const editUserModal = document.getElementById('editUserModal'); // Modal de Edição
    const editModalClose = document.querySelector('.edit-modal-close'); // Botão de fechar do modal de edição (X)
    const editUserForm = document.getElementById('editUserForm'); // Formulário de edição
    const editUserTypesDatalist = document.getElementById('editUserTypes'); // Datalist de tipos de usuário (edição)


    // Preenche o ID da congregação no formulário de CADASTRO
    document.getElementById('congregacaoId').value = sessionStorage.getItem('congregacao_id');


    // *** MODAL DE CADASTRO ***

    // Abrir modal de cadastro
    addUserBtn.addEventListener('click', () => {
        addUserModal.style.display = 'block';
        loadUserTypes(); // Carrega tipos de usuário para o modal de CADASTRO
    });

    // Fechar modal de cadastro (botão X)
    closeModal.addEventListener('click', () => {
        addUserModal.style.display = 'none';
    });

    // Fechar modal de cadastro ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === addUserModal) {
            addUserModal.style.display = 'none';
        }
    });

    // Carregar tipos de usuário para o MODAL DE CADASTRO
    function loadUserTypes() {
        const congregacaoId = sessionStorage.getItem('congregacao_id');
        fetch(`get_user_types.php?congregacao_id=${congregacaoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    userTypesDatalist.innerHTML = data.user_types // Preenche datalist do MODAL DE CADASTRO
                        .map(type => `<option value="${type}">${type}</option>`)
                        .join('');
                    editUserTypesDatalist.innerHTML = data.user_types // Preenche datalist do MODAL DE EDIÇÃO TAMBÉM
                        .map(type => `<option value="${type}">${type}</option>`)
                        .join('');
                }
            })
            .catch(error => console.error('Erro:', error));
    }

    // Enviar formulário de cadastro
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar senhas no cadastro
        if (document.getElementById('password').value !== document.getElementById('confirmPassword').value) {
            alert('As senhas não coincidem!');
            return;
        }

        const formData = new FormData(this);

        fetch('add_user.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuário cadastrado com sucesso!');
                addUserModal.style.display = 'none'; // Fechar modal de CADASTRO
                this.reset();
                fetchUsers(); // Recarrega a lista
            } else {
                alert('Erro: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao cadastrar usuário');
        });
    });


    // *** MODAL DE EDIÇÃO *** (NOVAS FUNÇÕES E EVENT LISTENERS)

    // Fechar modal de edição (botão X)
    editModalClose.addEventListener('click', () => {
        editUserModal.style.display = 'none';
    });

    // Fechar modal de edição ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === editUserModal) {
            editUserModal.style.display = 'none';
        }
    });

    // Enviar formulário de edição
    editUserForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        fetch('edit_users.php', { // Arquivo PHP para edição
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuário atualizado com sucesso!');
                editUserModal.style.display = 'none'; // Fechar modal de EDIÇÃO
                fetchUsers(); // Recarrega a lista
            } else {
                alert('Erro ao atualizar usuário: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar usuário');
        });
    });


    // ***  INICIALIZAÇÃO E FUNÇÕES GERAIS  ***

    // Tenta pegar o primeiro nome do sessionStorage
    const storedPrimeiroNome = sessionStorage.getItem('primeiroNome');
    if (storedPrimeiroNome) {
        nomeUsuarioSpan.textContent = "Bem-vindo, " + storedPrimeiroNome + "!";
    } else {
        nomeUsuarioSpan.textContent = "Bem-vindo, Usuário!"; // Fallback se não tiver no sessionStorage
    }

    // Tenta pegar o user_type do sessionStorage
    const storedUserType = sessionStorage.getItem('userType');
    if (storedUserType) {
        phoneSpan.textContent = "Tipo: " + storedUserType;
    } else {
        phoneSpan.textContent = "Tipo: Não Definido"; // Fallback se não tiver user_type no sessionStorage
    }

    // Função para buscar os usuários do servidor
    function fetchUsers() {
        const congregacaoId = sessionStorage.getItem('congregacao_id');
        console.log('Congregacao ID:', congregacaoId);

        fetch(`users_system.php?congregacao_id=${congregacaoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderUserBoxes(data.data);
                } else {
                    console.error('Erro do servidor:', data.error);
                    alert('Erro: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
                alert('Falha ao carregar usuários. Verifique o console.');
            });
    }

    // Função para renderizar os boxes e cards de usuários (MODIFICADA)
    function renderUserBoxes(usersByType) {
        const userTypeBoxesContainer = document.querySelector('.user-type-boxes');

        if (userTypeBoxesContainer) {
            userTypeBoxesContainer.innerHTML = '';

            for (const userType in usersByType) {
                if (usersByType.hasOwnProperty(userType)) {
                    const users = usersByType[userType];

                    const userTypeBox = document.createElement('div');
                    userTypeBox.classList.add('user-type-box');

                    const boxTitle = document.createElement('h3');
                    boxTitle.textContent = userType;
                    userTypeBox.appendChild(boxTitle);

                    const userCardsContainer = document.createElement('div');
                    userCardsContainer.classList.add('user-cards');

                    users.forEach(user => {
                        const userCard = document.createElement('div');
                        userCard.classList.add('user-card');

                        const usernameParagraph = document.createElement('p');
                        usernameParagraph.textContent = 'Usuário: ' + user.username;
                        userCard.appendChild(usernameParagraph);

                        const emailParagraph = document.createElement('p');
                        emailParagraph.textContent = 'Email: ' + user.email;
                        userCard.appendChild(emailParagraph);

                        const phoneParagraph = document.createElement('p');
                        phoneParagraph.textContent = 'Telefone: ' + user.phone_number;
                        userCard.appendChild(phoneParagraph);

                        // Container para os ícones
                        const iconsContainer = document.createElement('div');
                        iconsContainer.classList.add('user-icons');

                        // Ícone de Deletar
                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
                        iconsContainer.appendChild(deleteIcon);

                        // Ícone de Editar
                        const editIcon = document.createElement('i');
                        editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
                        iconsContainer.appendChild(editIcon);

                        userCard.appendChild(iconsContainer);

                        userCardsContainer.appendChild(userCard);


                        // *** EVENT LISTENER PARA O ÍCONE DE DELETAR (JÁ EXISTENTE - MANTIDO) ***
                        deleteIcon.addEventListener('click', function() {
                            if (confirm('Tem certeza que deseja deletar o usuário ' + user.username + '?')) {
                                deleteUser(user.id);
                            }
                        });

                        // *** EVENT LISTENER PARA O ÍCONE DE EDITAR (NOVO) ***
                        editIcon.addEventListener('click', function() {
                            openEditModal(user); // Chama função para abrir modal de edição e preencher dados
                        });


                    });

                    userTypeBox.appendChild(userCardsContainer);
                    userTypeBoxesContainer.appendChild(userTypeBox);
                }
            }
        } else {
            console.error("Container .user-type-boxes não encontrado no HTML.");
        }
    }


    // Função para abrir o modal de edição e preencher os dados do usuário (NOVA FUNÇÃO)
    function openEditModal(user) {
        document.getElementById('editUserId').value = user.id; // Preenche o campo hidden com o ID do usuário
        document.getElementById('editFullName').value = user.username; // Preenche o campo de nome
        document.getElementById('editEmail').value = user.email; // Preenche o campo de email
        document.getElementById('editPhone').value = user.phone_number; // Preenche o campo de telefone
        document.getElementById('editUserType').value = user.user_type; // Preenche o tipo de usuário
        editUserModal.style.display = 'block'; // Exibe o modal de edição
    }


    // Função para buscar os usuários ao carregar a página (JÁ EXISTENTE - MANTIDA)
    fetchUsers();


    // Função para deletar usuário (JÁ EXISTENTE - MANTIDA)
    function deleteUser(userId) {
        fetch('del_users.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Indica que os dados serão enviados como form URL-encoded
            },
            body: `user_id=${userId}` // Envia o ID do usuário no corpo da requisição
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message); // Exibe a mensagem de sucesso do PHP
                fetchUsers(); // Recarrega a lista de usuários
            } else {
                alert('Erro ao deletar usuário: ' + data.error); // Exibe a mensagem de erro do PHP
            }
        })
        .catch(error => {
            console.error('Erro ao deletar usuário:', error);
            alert('Erro ao deletar usuário. Verifique o console.');
        });
    }


}); // FECHAMENTO DO DOMContentLoaded


// Função para alternar a sidebar (MOVIDA PARA ESCOPO GLOBAL)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
    } else {
        console.error("Sidebar or Main content elements not found!");
    }
}