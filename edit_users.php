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
    $requiredFields = ['edit_user_id', 'username', 'email', 'user_type', 'phone_number'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("O campo $field é obrigatório.");
        }
    }

    // 1. Buscar a senha atual do usuário
    $stmt = $conn->prepare("SELECT senha FROM usuarios WHERE id = :edit_user_id");
    $stmt->execute([':edit_user_id' => $_POST['edit_user_id']]);
    $currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentUser) {
        throw new Exception("Usuário não encontrado.");
    }

    // 2. Verificar se a nova senha é diferente da atual
    $needUpdatePassword = false;
    $newPasswordHash = null;

    if (!empty($_POST['senha'])) {
        $newPasswordHash = md5($_POST['senha']); // Hash da nova senha
        $needUpdatePassword = ($newPasswordHash !== $currentUser['senha']); // Compara hashes
    }

    // 3. Montar query dinamicamente
    $sql = "UPDATE usuarios SET 
            username = :username, 
            email = :email, 
            user_type = :user_type, 
            phone_number = :phone_number";

    if ($needUpdatePassword) {
        $sql .= ", senha = :senha";
    }

    $sql .= " WHERE id = :edit_user_id";

    // 4. Preparar e executar
    $stmt = $conn->prepare($sql);

    $params = [
        ':edit_user_id' => $_POST['edit_user_id'],
        ':username' => $_POST['username'],
        ':email' => $_POST['email'],
        ':user_type' => $_POST['user_type'],
        ':phone_number' => $_POST['phone_number']
    ];

    if ($needUpdatePassword) {
        $params[':senha'] = $newPasswordHash;
    }

    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Usuário atualizado com sucesso!']);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro de banco de dados: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
