<?php
$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

// Função auxiliar para exibir alertas
function showAlert($message, $redirect = 'index.html') {
    echo "<script>
        alert('" . addslashes($message) . "');
        window.location.href = '$redirect';
    </script>";
    exit;
}

$conn = pg_connect("host=" . $hostname . " port=" . $port . " dbname=" . $database . " user=" . $username . " password=" . $password);

if (!$conn) {
    showAlert('Falha na conexão com o banco de dados.');
}

$email = $_POST["email"] ?? '';
$senha_digitada = $_POST["password"] ?? '';

// Validação de campos obrigatórios
if(empty($email)) {
    showAlert('Por favor, informe seu e-mail.');
}

if(empty($senha_digitada)) {
    showAlert('Por favor, informe sua senha.');
}

$query = "SELECT senha, congregacao_id, user_type, username, phone_number FROM usuarios WHERE email = $1";
$result = pg_query_params($conn, $query, array($email));

if (!$result) {
    showAlert('Erro na consulta ao banco de dados.');
}

$row = pg_fetch_assoc($result);
if (!$row) {
    showAlert('E-mail não encontrado.');
}

$senha_hash_digitada = md5(trim($senha_digitada));
if ($senha_hash_digitada !== trim($row["senha"])) {
    showAlert('Senha incorreta.');
}

if (empty($row["congregacao_id"]) || !is_numeric($row["congregacao_id"])) {
    showAlert('ID da congregação inválido para o usuário.');
}

$primeiro_nome = explode(" ", $row["username"])[0];
$redirect_url = sprintf(
    'dashboard.html?congregacao_id=%d&user_type=%s&primeiro_nome=%s&phone_number=%s',
    (int)$row["congregacao_id"],
    urlencode($row["user_type"]),
    urlencode($primeiro_nome),
    urlencode($row["phone_number"])
);

echo "<script>
    alert('Login realizado com sucesso!');
    window.location.href = '$redirect_url';
</script>";

pg_close($conn);
?>