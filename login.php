<?php

$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

$conn = pg_connect("host=" . $hostname . " port=" . $port . " dbname=" . $database . " user=" . $username . " password=" . $password);

if (!$conn) {
    echo "Falha na conexão com o banco de dados.";
    exit;
}

// Recebe os dados do formulário
$email = $_POST["email"];
$senha_digitada = $_POST["password"];

// Consulta SQL para buscar o usuário pelo email, incluindo username e user_type
$query = "SELECT senha, congregacao_id, user_type, username, phone_number FROM usuarios WHERE email = $1";
$result = pg_query_params($conn, $query, array($email));

if ($result) {
    $row = pg_fetch_assoc($result);
    if ($row) {
        $senha_banco = $row["senha"];

        if ($senha_digitada == $senha_banco) 
        {
            // Login Success - Exibe alert de sucesso e redireciona para dashboard.html com congregacao_id, user_type, primeiro_nome e phone_number
            $nome_completo = $row["username"];
            $nome_array = explode(" ", $nome_completo);
            $primeiro_nome = $nome_array[0];
            echo "<script>alert('Login realizado com sucesso!'); window.location.href = 'dashboard.html?congregacao_id=" . $row["congregacao_id"] . "&user_type=" . $row["user_type"] . "&primeiro_nome=" . urlencode($primeiro_nome) . "&phone_number=" . urlencode($row["phone_number"]) . "';</script>";
            exit();
        }
        else 
        {
            // Senha Incorreta - Exibe alert de senha incorreta
            echo "<script>alert('Senha incorreta. Tente novamente.'); window.location.href = 'index.html?login_status=incorrect_password_js_alert';</script>";
            exit();
        }
    } else {
        // Email não encontrado - Exibe alert de email não encontrado
            echo "<script>alert('Email não encontrado. Verifique seu email.'); window.location.href = 'index.html?login_status=email_not_found_js_alert';</script>";
        exit();
    }
} else {
    // Erro no banco de dados - Exibe alert de erro de banco de dados
    echo "<script>alert('Erro ao conectar com o banco de dados. Tente novamente mais tarde.'); window.location.href = 'index.html?login_status=database_error_js_alert';</script>";
    exit();
}

pg_close($conn);

?>