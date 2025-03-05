<?php
header('Content-Type: application/json');

$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

try {
    $pdo = new PDO("pgsql:host=$hostname;port=$port;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se o ID do usuário foi passado via POST
    if (isset($_POST['user_id']) && is_numeric($_POST['user_id'])) {
        $user_id = $_POST['user_id'];

        // Prepara e executa a query de DELETE
        $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = :user_id");
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            // Se a exclusão for bem-sucedida
            echo json_encode(['success' => true, 'message' => 'Usuário deletado com sucesso!']);
        } else {
            // Se houver um erro na execução da query
            echo json_encode(['success' => false, 'error' => 'Erro ao deletar usuário.']);
        }
    } else {
        // Se o ID do usuário não foi passado corretamente
        echo json_encode(['success' => false, 'error' => 'ID do usuário inválido ou não fornecido.']);
    }
} catch (PDOException $e) {
    // Em caso de erro de conexão ou outros erros PDO
    echo json_encode(['success' => false, 'error' => 'Erro de banco de dados: ' . $e->getMessage()]);
}
