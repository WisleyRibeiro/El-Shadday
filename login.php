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
$senha_digitada = $_POST["password"]; // Renomeado para evitar confusão

// Consulta SQL para buscar o usuário pelo email
$query = "SELECT senha FROM usuarios WHERE email = $1";
$result = pg_query_params($conn, $query, array($email));

if ($result) {
    $row = pg_fetch_assoc($result);
    if ($row) {
        $senha_banco = $row["senha"];

        // Verificação da senha (por enquanto, comparação direta - INSEGURO em produção)
        if ($senha_digitada == $senha_banco) {
            echo "Login realizado com sucesso!";
            // Aqui você irá redirecionar para a página principal do sistema
            // header("Location: dashboard.php"); // Próximo passo: redirecionamento
            // exit(); // Próximo passo: redirecionamento
        } else {
            echo "Senha incorreta.";
        }
    } else {
        echo "Email não encontrado.";
    }
} else {
    echo "Erro ao consultar o banco de dados.";
}

pg_close($conn); // Fecha a conexão com o banco de dados

?>