<?php
include "dbConnect.php";
session_start();

$lat = $_POST['lat'];
$lon = $_POST['lon'];


$userId = array();
$result = mysqli_query($base, "SELECT `user_id` FROM `person` ORDER BY `user_id` DESC LIMIT 1;");
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($userId, array($row['user_id']));
    }
    
}
$kati = $userId[0][0]; 

$query1 = "INSERT INTO `vehicles`(`resquer_id`, `lat`, `lon`) VALUES ('$kati','$lat','$lon')";

if (mysqli_query($base, $query1)) {
    echo 1;
} else {
    echo "Error: " . $query1 . mysqli_error($base);
}
