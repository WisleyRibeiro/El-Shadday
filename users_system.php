<?php
$hostname = "slovenly-amicable-dormouse.data-1.use1.tembo.io";
$username = "postgres";
$password = "dUnTnycqXe2ppHv6";
$port = 5432;
$database = "postgres";

try {
    // Conexão com o banco de dados
    $conn = new PDO("pgsql:host=$hostname;port=$port;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query para buscar os usuários agrupados por tipo
    $sql = "SELECT user_type, username, email, phone_number FROM usuarios ORDER BY user_type, username";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch all users grouped by user_type
    $usersByType = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $usersByType[$row['user_type']][] = $row;
    }

    // Retorna os dados em formato JSON
    echo json_encode($usersByType);

} catch (PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}
?>