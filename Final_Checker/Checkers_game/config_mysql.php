<?php
/* Database credentials. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
 
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'Admin');
define('DB_PASSWORD', '4VPnroTOC6wOU3mn');
define('DB_NAME', 'checkers_db');  
 
/* Attempt to connect to MySQL database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>