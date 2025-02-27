document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const primeiroNome = urlParams.get('primeiro_nome');
    const phoneNumber = urlParams.get('phone_number');
    const userType = urlParams.get('user_type'); // Pega o user_type da URL

    // Verifica se 'primeiroNome' e 'phoneNumber' existem antes de salvar
    if (primeiroNome && phoneNumber) {
        // Salva o primeiro nome, telefone e user_type no sessionStorage
        sessionStorage.setItem('primeiroNome', primeiroNome);
        sessionStorage.setItem('phoneNumber', phoneNumber); // Vamos continuar salvando, mesmo que não mostremos agora
        sessionStorage.setItem('userType', userType); // Salva o user_type no sessionStorage
    }

    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone'); // Usaremos 'phoneSpan' para mostrar o user_type agora

    // Tenta pegar o primeiro nome do sessionStorage
    const storedPrimeiroNome = sessionStorage.getItem('primeiroNome');
    if (storedPrimeiroNome) {
        nomeUsuarioSpan.textContent = "Bem-vindo, " + storedPrimeiroNome + "!";
    } else {
        nomeUsuarioSpan.textContent = "Bem-vindo, Usuário!"; // Fallback se não tiver no sessionStorage
    }

    // Tenta pegar o user_type do sessionStorage (MUDAMOS PARA user_type)
    const storedUserType = sessionStorage.getItem('userType'); // Pega o userType do sessionStorage
    if (storedUserType) {
        phoneSpan.textContent = "Tipo: " + storedUserType; // **AGORA MOSTRAMOS user_type NO phoneSpan**
    } else {
        phoneSpan.textContent = "Tipo: Não Definido"; // Fallback se não tiver user_type no sessionStorage
    }
});

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