<?php
$servername = "localhost";
$username = "Admin";
$password = "4VPnroTOC6wOU3mn";
$database = "player";
$tableName = "Users";
$jsonFilePath = "people.json";

// Create connection without selecting a database
$conn = new mysqli($servername, $username, $password);
checkConnection($conn);

// Create database and connect to it
createDatabase($conn, $database);
$conn->select_db($database);

// Create table
createTable($conn, $tableName);

// Read JSON file and insert data
$data = readJsonFile($jsonFilePath);
insertData($conn, $tableName, $data);

// Retrieve and display data
displayData($conn, $tableName);

// Close connection
$conn->close();

// Function definitions
function checkConnection($conn) {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}

function createDatabase($conn, $database) {
    $sql = "CREATE DATABASE IF NOT EXISTS $database";
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating database: " . $conn->error;
    }
}

function createTable($conn, $tableName) {
    $sql = "CREATE TABLE IF NOT EXISTS $tableName (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        win INT,
        lose INT,
        draw INT,
        total_game INT,
        total_time INT
    )";
    if ($conn->query($sql) !== TRUE) {
        echo "Error creating table: " . $conn->error;
    }
}

function readJsonFile($jsonFilePath) {
    $jsonData = file_get_contents($jsonFilePath);
    return json_decode($jsonData, true);
}

function insertData($conn, $tableName, $data) {
    // Check if data already exists to avoid duplicates
    $sqlCheck = "SELECT * FROM $tableName";
    $result = $conn->query($sqlCheck);
    if ($result->num_rows > 0) {
        echo "Data already exists in the table\n";
        return;
    }

    foreach ($data as $player) {
        $sqlInsert = "INSERT INTO $tableName (username, win, lose, draw, total_game, total_time) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sqlInsert);
        $stmt->bind_param("siiiii", $player['username'], $player['win'], $player['lose'], $player['draw'], $player['total_game'], $player['total_time']);
        $stmt->execute();
    }
    echo "Data inserted successfully\n";
}

function displayData($conn, $tableName) {
    $sqlSelect = "SELECT * FROM $tableName";
    $result = $conn->query($sqlSelect);
    $users = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode($users);
    } else {
        echo "No results found";
    }
}
?>

