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
$senha = $_POST["password"];

echo "Conexão com o banco de dados realizada com sucesso!<br><br>"; // Mantém a mensagem de sucesso
echo "Email digitado: " . $email . "<br>";
echo "Senha digitada: " . $senha . "<br>";

?>