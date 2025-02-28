<?php
$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

$conn = pg_connect("host=" . $hostname . " port=" . $port . " dbname=" . $database . " user=" . $username . " password=" . $password);

if (!$conn) {
    echo json_encode(['success' => false, 'error' => 'Falha na conexão com o banco de dados.']);
    exit;
}

$email = $_POST["email"] ?? '';
$senha_digitada = $_POST["password"] ?? '';

// Consulta corrigida para evitar SQL injection e validar congregacao_id
$query = "SELECT senha, congregacao_id, user_type, username, phone_number FROM usuarios WHERE email = $1";
$result = pg_query_params($conn, $query, array($email));

if (!$result) {
    echo json_encode(['success' => false, 'error' => 'Erro na consulta ao banco de dados.']);
    exit;
}

$row = pg_fetch_assoc($result);
if (!$row) {
    echo json_encode(['success' => false, 'error' => 'Email não encontrado.']);
    exit;
}

if ($senha_digitada !== $row["senha"]) {
    echo json_encode(['success' => false, 'error' => 'Senha incorreta.']);
    exit;
}

// Validação crítica do congregacao_id
if (empty($row["congregacao_id"]) || !is_numeric($row["congregacao_id"])) {
    echo json_encode(['success' => false, 'error' => 'ID da congregação inválido para o usuário.']);
    exit;
}

$primeiro_nome = explode(" ", $row["username"])[0];

// Redirecionamento com URL correta e parâmetros codificados
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