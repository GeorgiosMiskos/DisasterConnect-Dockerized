<?php
include "dbConnect.php";
session_start();

$user_id =  $_SESSION['user_id'];
$lat = $_POST['lat'];
$lng = $_POST['lng'];

$query = "UPDATE `vehicles` SET `lat`= '$lat ',`lon` ='$lng' WHERE `resquer_id` = '$user_id'";
if (mysqli_query($base, $query)) {
    echo 1;
} else {
    echo "Error: " . $query . mysqli_error($base);
}
