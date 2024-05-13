<?php
// connect to db
require_once 'db_connect.php';

session_start();

$username = $password = "";
$err_arr = array();

    // Check if username is empty
    if(($_POST["username"]) == NULL){
        array_push($err_arr,'Please enter username.');
    } else{
        $username = trim($_POST["username"]);
    }

    // Check if password is empty
    if(($_POST['password']) == NULL){
        array_push($err_arr,'Please enter your password.');
    } else{
        $password = trim($_POST['password']);
    }

    // check if there were any errors
    if(empty($err_arr)){
        // Prepare a select statement
        $sql = "SELECT username, password, win, lose, draw, total_games, total_time FROM player_tbl WHERE username = ?";
        if($stmt = mysqli_prepare($conn, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s",  $param_username);
            $param_username = $username;

           // run stmt and check db for any matching results. 
            if(mysqli_stmt_execute($stmt)){
                mysqli_stmt_store_result($stmt);  // get query results
                if(mysqli_stmt_num_rows($stmt) == 1){  // found matching username in db  
					mysqli_stmt_bind_result($stmt, $username, $hashed_password, $win, $lose, $draw, $total_games, $total_time);     
                    if(mysqli_stmt_fetch($stmt)){
                        // echo $password ." user input <br>";
						// echo $hashed_password ." from db<br>";
                        // check that input pass == hashed pass
                        if(password_verify($password, $hashed_password)){
                            $_SESSION['username'] = $username;
                            $_SESSION['win'] = $win; 
                            $_SESSION['lose'] = $lose; 
                            $_SESSION['draw'] = $draw; 
                            $_SESSION['total_games'] = $total_games;  
                            $_SESSION['total_time'] = $total_time;   
                            header("Location: ../menu/menu.php");
                            exit;
                        } else{
                            // Display an error message if password is not valid
                            array_push($err_arr,"The password you entered was not valid.");
                        }
                    }
                } else{
                    // Display an error message if username doesn't exist
                    array_push($err_arr,"No account found with that username.");
                }
            } else{
                array_push($err_arr,"Oops! Something went wrong. Please try again later.");
            }
        }          
        // Close statement
        mysqli_stmt_close($stmt);
    } 
      
    // return array of errors to login page
    $_SESSION['login_err_message'] = $err_arr;    
      header("Location: ../login/login_register_page.php");
    //header("Location: \CSCI-130-CONNECT-4\menu\menu.php");
    
    // Close connection
    mysqli_close($conn);
?>