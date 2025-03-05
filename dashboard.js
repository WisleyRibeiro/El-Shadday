document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Tenta obter congregacao_id do sessionStorage PRIMEIRO
    let congregacaoId = sessionStorage.getItem('congregacao_id');

    // Se NÃO estiver no sessionStorage, tenta obter dos parâmetros da URL
    if (!congregacaoId) {
        congregacaoId = urlParams.get('congregacao_id');
    }

    // Validação rigorosa do congregacao_id
    if (!congregacaoId || isNaN(congregacaoId)) {
        console.error('ID da congregação inválido ou ausente.'); // Mensagem de console mais genérica
        alert('Erro: ID da congregação não encontrado. Redirecionando...');
        window.location.href = 'index.html';
        return;
    }

    // Salva no sessionStorage (SE já não estiver lá, ou atualiza se veio da URL)
    sessionStorage.setItem('primeiroNome', urlParams.get('primeiro_nome') || sessionStorage.getItem('primeiroNome') || 'Usuário'); // Mantém sessionStorage se já existir
    sessionStorage.setItem('phoneNumber', urlParams.get('phone_number') || sessionStorage.getItem('phoneNumber') || 'Não informado'); // Mantém sessionStorage se já existir
    sessionStorage.setItem('userType', urlParams.get('user_type') || sessionStorage.getItem('userType') || 'Não Definido'); // Mantém sessionStorage se já existir
    sessionStorage.setItem('congregacao_id', parseInt(congregacaoId, 10)); // Garante que seja salvo como número

    // Atualiza a UI
    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone');
    nomeUsuarioSpan.textContent = `Bem-vindo, ${sessionStorage.getItem('primeiroNome')}!`;
    phoneSpan.textContent = `Tipo: ${sessionStorage.getItem('userType')}`;

    // Log para depuração
    console.log('Dados salvos (dashboard):', {
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