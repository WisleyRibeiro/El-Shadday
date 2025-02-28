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

    // Validação dos dados
    $requiredFields = ['username', 'email', 'senha', 'user_type', 'phone_number', 'congregacao_id'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("O campo $field é obrigatório");
        }
    }

    // Inserir no banco
    $stmt = $conn->prepare("
        INSERT INTO usuarios (
            username, 
            email, 
            senha, 
            user_type, 
            phone_number, 
            congregacao_id
        ) VALUES (
            :username, 
            :email, 
            :senha, 
            :user_type, 
            :phone_number, 
            :congregacao_id
        )
    ");

    $stmt->execute([
        ':username' => $_POST['username'],
        ':email' => $_POST['email'],
        ':senha' => $_POST['senha'],
        ':user_type' => $_POST['user_type'],
        ':phone_number' => $_POST['phone_number'],
        ':congregacao_id' => (int)$_POST['congregacao_id']
    ]);

    echo json_encode(['success' => true]);

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
?>