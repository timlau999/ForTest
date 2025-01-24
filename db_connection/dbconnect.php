<?php
$servername = "localhost";
$password = ""; 
$dbname = "restaurant_sys_db"; 

// Create connection
$db = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$db) {       
    die("Connection failed: " . mysqli_connect_error());
}
?>