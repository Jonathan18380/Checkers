<?php
// Initialize the session
session_start();
// If session variable is not set it will redirect to login page
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login_mysql.php");
  exit;
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>  
    <style>
                        body {
            background-color: rgb(19, 40, 76);
            text-align: center;
        }

        h2 {
            color: rgb(255, 255, 255);
            background-color: rgb(176, 16, 43);
            font-size: 45px;
        }

        p {
            color: rgb(255, 255, 255);
            background-color: rgb(19, 40, 76);
            font-size: 25px;
            font-weight: 90;
            text-align: center;
        }
        table,th, td {
            border: 2px solid black;
            background-color: rgb(255,255,255);
            text-align: center;
        }
        label,li{
            font-size: 25px;
        }
    </style>    
</head>
<body>
    <div>
        <h1>Hi, <b><?php echo $_SESSION['username']; ?></b>. Welcome to this site.</h1>
    </div>
    <h2> Would you like to play a Game?</h2>

    <h2>Clicking on the following page will lead to the following:</h2>
    <p> Leader Board will take you to the list of past Champions.</p>
    <p> Help Page will help you understand the rule of the game.</p>
    <p> Contact Page tell you who made this fantastic super awsome amazaing Checkers Game.</p>

   

    <ul id="page">
        <li><a href="leader_board.html" title="Display the best Player">Leader Board</a></li>
    </ul>

    <ul id="page">
        <li><a href="Help.html" title="Explain on how to play Checkers">Help Page</a></li>
    </ul>

    <ul id="page">
        <li><a href="Contact.html" title="Authors of this Checkers Game">Contact Page</a></li>
    </ul>

    <p> To play the game please Login if you have an account already, if you do not
        please create one. You can do so by filling up the sign up form. Once you have
        done so, it will take straight into the game.
    </p>

    <p>Play a quick game</p>
    <p><a href="2game.php">Quick Game</a></p>
</body>
</html>