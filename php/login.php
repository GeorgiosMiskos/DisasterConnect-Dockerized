<?php

session_start();
include "dbConnect.php";
$result = array();

$email = $_POST['email']; 
$pass = $_POST['password'];

$query = mysqli_query($base, "SELECT * FROM `person` WHERE `email`='$email' AND `password`='$pass' "); 
if (mysqli_num_rows($query) === 1) { 
    $row = mysqli_fetch_assoc($query); 
    array_push($result, array('user_id' => $row['user_id'], 'admin' => $row['admin'])); 
    $_SESSION['admin'] = $row['admin']; 
    $_SESSION['user_id'] = $row['user_id'];
    echo json_encode($result, true); 
    exit();
} else {
    echo 2; 
    exit();
}
