<?php
$servername = "localhost";
$dbUsername = "Admin"; // Database username
$dbPassword = "4VPnroTOC6wOU3mn"; // Database password
$database = "player"; // Database name
$tableName = "Users"; // Correct table name

// Create connection
$conn = new mysqli($servername, $dbUsername, $dbPassword, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['login'])) {
        // Login user
        $user = $_POST['username'];
        $pass = $_POST['password'];

        // SQL to check user
        $sql = "SELECT id, username, password FROM $tableName WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user);
        $stmt->execute();

        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($pass, $row['password'])) {
                // Password is correct, start a new session
                session_start();
                $_SESSION['loggedin'] = true;
                $_SESSION['username'] = $row['username'];
                $_SESSION['id'] = $row['id'];

                // Redirect to user profile page
                header("location: profile.php");
            } else {
                // Password not valid
                echo "The password you entered was not valid.";
            }
        } else {
            // Username doesn't exist
            echo "No account found with that username.";
        }

        $stmt->close();
    } elseif (isset($_POST['signup'])) {
        // Register user
        $newUser = $_POST['newUsername'];
        $newPass = $_POST['newPassword'];

        // Check if username is already taken
        $checkUserSql = "SELECT id FROM $tableName WHERE username = ?";
        $checkStmt = $conn->prepare($checkUserSql);
        $checkStmt->bind_param("s", $newUser);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            echo "Username already taken. Please choose another.";
        } else {
            // Insert new user
            $hashedPassword = password_hash($newPass, PASSWORD_DEFAULT);
            $insertSql = "INSERT INTO $tableName (username, password) VALUES (?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ss", $newUser, $hashedPassword);
            if ($insertStmt->execute()) {
                echo "Registration successful.";
            } else {
                echo "Error: " . $insertStmt->error;
            }
            $insertStmt->close();
        }
        $checkStmt->close();
    }
}

$conn->close();
?>
