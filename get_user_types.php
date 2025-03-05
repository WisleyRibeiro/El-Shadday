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

    if (!$congregacaoId || !ctype_digit($congregacaoId)) {
        throw new Exception("ID da congregação inválido");
    }

    $stmt = $conn->prepare("
        SELECT DISTINCT user_type 
        FROM usuarios 
        WHERE congregacao_id = :congregacao_id 
        ORDER BY user_type
    ");
    $stmt->bindParam(':congregacao_id', $congregacaoId, PDO::PARAM_INT);
    $stmt->execute();

    $userTypes = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'user_types' => $userTypes
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
