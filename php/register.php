<?php

session_start();
include "dbConnect.php";


$first_name = $_POST['first_name']; 
$last_name = $_POST['last_name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$password = $_POST['password'];
$lat = $_POST['lat'];
$lon = $_POST['lon'];
$admin = $_POST['admin'];

$result = mysqli_query($base, "SELECT * FROM person WHERE Email='$email'"); 

if (mysqli_num_rows($result) > 0) {
    echo 0; 
    exit();
} else {
    $result2 = mysqli_query($base, "INSERT INTO `person`(`first_name`, `last_name`, `email`, `password`, `phone`, `lat`, `lon`, `admin`) VALUES ('$first_name','$last_name','$email','$password','$phone','$lat','$lon', '$admin')"); 

    if ($result2) {
        echo 1; 
        exit();
    } else {
        echo 2; 
        exit();
    }
}
