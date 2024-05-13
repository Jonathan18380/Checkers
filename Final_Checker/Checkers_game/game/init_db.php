<?php
include "player_class.php";
$db_params = parse_ini_file("db_credential.ini");
define('DB_SERVER',  $db_params['server']);
define('DB_USERNAME',  $db_params['username']);
define('DB_PASSWORD',  $db_params['password']);

// Create connection to mysql and check it
$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error ."<br>");
} 
echo "Connected successfully <br>";
$db_name="checkers_db";
// // Create the database
$sql = "CREATE DATABASE ". $db_name;
if ($conn->query($sql) === TRUE) {
    echo "Database ". $db_name ." created successfully<br>";
} else {
    echo "Error creating database: " . $conn->error ."<br>";
}
// close the connection
$conn->close();

// Create connection
$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//create str to create table w/col headers
$sql = "CREATE TABLE player_tbl (
pkey INT(6) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
username  VARCHAR(255) NOT NULL,
password  VARCHAR(255) NOT NULL,
win INT(10) NOT NULL,
lose INT(10) NOT NULL,
draw INT(10) NOT NULL,
total_games INT(10) NOT NULL,
total_time INT(255) NOT NULL)";

// confirm table creationplac
if ($conn->query($sql) === TRUE) {
    echo "Table Person created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error ."<br>";
}


$stmt = $conn->prepare("INSERT INTO player_tbl (username, password, win, lose, draw, total_games, total_time) VALUES (?,?,?,?,?,?,?)");
if ($stmt==FALSE) {
	echo "There is a problem with prepare <br>";
	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
}
// bind parameters
$stmt->bind_param("ssiiiii", $username, $password, $win, $lose, $draw, $total_games, $total_time);

// load json data into table
$json_str = file_get_contents('../leaderboard/generated.json');
$players_arr = json_decode($json_str);
$count = count($players_arr);
//create player
for ($i=0;$i<$count;$i++) {
    $username = $players_arr[$i]->username;
    $password = $players_arr[$i]->password;
    $win = $players_arr[$i]->win;
    $lose = $players_arr[$i]->lose;
    $draw = $players_arr[$i]->draw;
    $total_games = $players_arr[$i]->total_games;
    $total_time = $players_arr[$i]->total_time;
    $stmt->execute();
    //echo $username.' '.$password.' '.$win.' '.$lose.' '.$draw.' '.$total_games.' '.$total_time;
}
$stmt->close();
$conn->close();

?>