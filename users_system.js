document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuarioSpan = document.getElementById('nome-usuario');
    const phoneSpan = document.getElementById('user-phone'); // Mantemos a variável, mas vamos usar para user_type

    // Tenta pegar o primeiro nome do sessionStorage
    const storedPrimeiroNome = sessionStorage.getItem('primeiroNome');
    if (storedPrimeiroNome) {
        nomeUsuarioSpan.textContent = "Bem-vindo, " + storedPrimeiroNome + "!";
    } else {
        nomeUsuarioSpan.textContent = "Bem-vindo, Usuário!"; // Fallback se não tiver no sessionStorage
    }

    // Tenta pegar o user_type do sessionStorage (MUDAMOS PARA user_type)
    const storedUserType = sessionStorage.getItem('userType'); // Pegamos o userType do sessionStorage
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