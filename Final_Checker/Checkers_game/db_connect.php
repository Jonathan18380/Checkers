<?php
// Check if the INI file exists and is readable
$ini_path = "db_credential.ini";
if (!file_exists($ini_path) || !is_readable($ini_path)) {
    die("Error: Unable to locate the INI file.");
}

$db_params = parse_ini_file($ini_path);
if ($db_params === false) {
    die("Error: Unable to parse the INI file.");
}

define('DB_SERVER', $db_params['server'] ?? 'localhost');
define('DB_USERNAME', $db_params['username'] ?? 'root'); // Default username
define('DB_PASSWORD', $db_params['password'] ?? ''); // Default password
define('DB_NAME', $db_params['dbname'] ?? 'player'); // Default database name

$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn === false) {
    die("CONNECTION FAILED: " . mysqli_connect_error());
}
?>
