<?php
header('Content-Type: application/json');

$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

try {
    $conn = new PDO("pgsql:host=$hostname;port=$port;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $congregacaoId = $_GET['congregacao_id'] ?? null;

    // Validação reforçada
    if ($congregacaoId === null || !ctype_digit($congregacaoId)) {
        throw new Exception("ID da congregação inválido. Recebido: " . $congregacaoId);
    }

    $stmt = $conn->prepare("
        SELECT id, user_type, username, email, phone_number 
        FROM usuarios 
        WHERE congregacao_id = :congregacao_id 
        ORDER BY user_type, username
    ");
    $stmt->bindParam(':congregacao_id', $congregacaoId, PDO::PARAM_INT);
    $stmt->execute();

    $usersByType = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $usersByType[$row['user_type']][] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $usersByType
    ]);
} catch (PDOException $e) {
    error_log("Erro no banco de dados: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
