document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Captura e validação dos parâmetros
    const primeiroNome = urlParams.get('primeiro_nome');
    const phoneNumber = urlParams.get('phone_number');
    const userType = urlParams.get('user_type');
    const congregacaoId = urlParams.get('congregacao_id');

    // Validação rigorosa do congregacao_id
    if (!congregacaoId || isNaN(congregacaoId)) {
        console.error('ID da congregação inválido ou ausente na URL.');
        alert('Erro: ID da congregação não encontrado. Redirecionando...');
        window.location.href = 'index.html';
        return;
    }

    // Salva no sessionStorage como número
    sessionStorage.setItem('primeiroNome', primeiroNome || 'Usuário');
    sessionStorage.setItem('phoneNumber', phoneNumber || 'Não informado');
    sessionStorage.setItem('userType', userType || 'Não Definido');
    sessionStorage.setItem('congregacao_id', parseInt(congregacaoId, 10));

    // Atualiza a UI
    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone');
    nomeUsuarioSpan.textContent = `Bem-vindo, ${sessionStorage.getItem('primeiroNome')}!`;
    phoneSpan.textContent = `Tipo: ${sessionStorage.getItem('userType')}`;

    // Log para depuração
    console.log('Dados salvos:', {
        congregacaoId: sessionStorage.getItem('congregacao_id'),
        userType: sessionStorage.getItem('userType')
    });
});

// ... toggleSidebar() mantido ...
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