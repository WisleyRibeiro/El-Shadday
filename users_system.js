document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone');

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

    // Função para renderizar os boxes e cards de usuários
    function renderUserBoxes(usersByType) {
        const userTypeBoxesContainer = document.querySelector('.user-type-boxes'); // Container dos boxes

        if (userTypeBoxesContainer) { // Verifica se o container existe no HTML
            // Limpa o container antes de adicionar novos boxes
            userTypeBoxesContainer.innerHTML = '';

            // Itera sobre os tipos de usuário e cria os boxes e cards
            for (const userType in usersByType) {
                if (usersByType.hasOwnProperty(userType)) {
                    const users = usersByType[userType];

                    // Cria o box do tipo de usuário
                    const userTypeBox = document.createElement('div');
                    userTypeBox.classList.add('user-type-box');

                    // Cria o título do box (tipo de usuário)
                    const boxTitle = document.createElement('h3');
                    boxTitle.textContent = userType;
                    userTypeBox.appendChild(boxTitle);

                    // Cria o container para os cards de usuário
                    const userCardsContainer = document.createElement('div');
                    userCardsContainer.classList.add('user-cards');

                    // Cria os cards de usuário para este tipo de usuário
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

                        userCardsContainer.appendChild(userCard); // Adiciona card ao container de cards
                    });

                    userTypeBox.appendChild(userCardsContainer); // Adiciona container de cards ao box
                    userTypeBoxesContainer.appendChild(userTypeBox); // Adiciona box ao container geral
                }
            }
        } else {
            console.error("Container .user-type-boxes não encontrado no HTML.");
        }
    }

    // Chama a função para buscar os usuários ao carregar a página
    fetchUsers();

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
});