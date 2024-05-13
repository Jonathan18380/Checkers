<?php
$servername = "localhost";
$username = "Checkers Admin"; // Ensure this is the correct username
$password = "checker4king";
$database = "playerDB";
$tableName = "Players";

// Create connection
function createConnection($servername, $username, $password, $database) {
    $conn = new mysqli($servername, $username, $password, $database);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

$conn = createConnection($servername, $username, $password, $database);

// Create table
$sql = "CREATE TABLE IF NOT EXISTS $tableName (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    win INT NOT NULL,
    lose INT NOT NULL,
    draw INT NOT NULL,
    total_games INT NOT NULL,
    total_time INT NOT NULL
)";

if ($conn->query($sql) !== TRUE) {
    echo "Error creating table: " . $conn->error;
}

// fetch player data
if (isset($_GET['fetchPlayers'])) {
    $sql = "SELECT * FROM $tableName";
    $result = $conn->query($sql);
    $players = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $players[] = $row;
        }
        echo json_encode($players);
    } else {
        echo "0 results";
    }
}


$conn->close();
?>
