<?php
include "dbConnect.php";
session_start();


$lat = $_POST['lat'];
$lng = $_POST['lng'];

$query = "UPDATE `baseposition` SET `lat`= '$lat ',`lon` ='$lng'";
if (mysqli_query($base, $query)) {
    echo 1;
} else {
    echo "Error: " . $query . mysqli_error($base);
}